/**
 * @NApiVersion 2.1
 * @NScriptType MapReduceScript
 */
/**********************************************************************************
 * OTP-7463 : Monthly Overdue Remainder for Customer
 *
 *
 * ********************************************************************************
 *
 * ********************
 * company name
 *
 * Author: Jobin and Jismi IT Services
 *
 *
 * Date Created: 04-July-2024
 *
 * Description: This script is for sending an email remainder to customers who have overdue invoices.
 *
 *
 * REVISION HISTORY
 *
 * @version 1.0 company name: 03-July-2024: Created the initial build by JJ0352
 *
 *
 *
 **************/
define(['N/email', 'N/file', 'N/log', 'N/record', 'N/search'],
    /**
 * @param{email} email
 * @param{file} file
 * @param{log} log
 * @param{record} record
 * @param{search} search
 */
    (email, file, log, record, search) => {
        /**
         * Defines the function that is executed at the beginning of the map/reduce process and generates the input data.
         * @param {Object} inputContext
         * @param {boolean} inputContext.isRestarted - Indicates whether the current invocation of this function is the first
         *     invocation (if true, the current invocation is not the first invocation and this function has been restarted)
         * @param {Object} inputContext.ObjectRef - Object that references the input data
         * @typedef {Object} ObjectRef
         * @property {string|number} ObjectRef.id - Internal ID of the record instance that contains the input data
         * @property {string} ObjectRef.type - Type of the record instance that contains the input data
         * @returns {Array|Object|Search|ObjectRef|File|Query} The input data to use in the map/reduce process
         * @since 2015.2
         */

        const getInputData = (inputContext) => {
            let searchResult = search.create({
                type: search.Type.INVOICE,
                filters: [['mainline', 'is', 'T'], 'AND', ['daysoverdue', 'greaterthan', '0'], 'AND', ['datecreated', 'notafter', 'startoflastmonth']],
                columns: ['internalid', 'entity', 'email', 'tranid', 'daysoverdue', 'total', 'salesrep']
            });
            log.error("get input data point");
            return searchResult;
        }

        /**
         * Defines the function that is executed when the map entry point is triggered. This entry point is triggered automatically
         * when the associated getInputData stage is complete. This function is applied to each key-value pair in the provided
         * context.
         * @param {Object} mapContext - Data collection containing the key-value pairs to process in the map stage. This parameter
         *     is provided automatically based on the results of the getInputData stage.
         * @param {Iterator} mapContext.errors - Serialized errors that were thrown during previous attempts to execute the map
         *     function on the current key-value pair
         * @param {number} mapContext.executionNo - Number of times the map function has been executed on the current key-value
         *     pair
         * @param {boolean} mapContext.isRestarted - Indicates whether the current invocation of this function is the first
         *     invocation (if true, the current invocation is not the first invocation and this function has been restarted)
         * @param {string} mapContext.key - Key to be processed during the map stage
         * @param {string} mapContext.value - Value to be processed during the map stage
         * @since 2015.2
         */

        const map = (mapContext) => {


            let invoiceData = JSON.parse(mapContext.value);
            let invoiceId = invoiceData.id;
            let customerName = invoiceData.values.entity.text;
            let customerId = invoiceData.values.entity.value;
            let customerEmail = invoiceData.values.email;
            let tranId = invoiceData.values.tranid;
            let daysOverdue = invoiceData.values.daysoverdue;
            let total = invoiceData.values.total;
            let customerRecord = record.load({
                type: record.Type.CUSTOMER,
                id: customerId
            })
            let salesRepId = customerRecord.getValue({ fieldId: 'salesrep' });
            log.debug('salesRepId' + salesRepId);
            salesRepId = salesRepId ? salesRepId : 'admin';
            log.error(invoiceId + " " + customerName + " " + customerEmail + " " + tranId + " " + daysOverdue + " " + salesRepId + " " + total);
            mapContext.write({
                key: customerId,
                value: {
                    customer: customerName,
                    email: customerEmail,
                    docid: tranId,
                    internalid: invoiceId,
                    salesrep: salesRepId,
                    daysoverdue: daysOverdue,
                    total: total
                }
            });
        }

        /**
         * Defines the function that is executed when the reduce entry point is triggered. This entry point is triggered
         * automatically when the associated map stage is complete. This function is applied to each group in the provided context.
         * @param {Object} reduceContext - Data collection containing the groups to process in the reduce stage. This parameter is
         *     provided automatically based on the results of the map stage.
         * @param {Iterator} reduceContext.errors - Serialized errors that were thrown during previous attempts to execute the
         *     reduce function on the current group
         * @param {number} reduceContext.executionNo - Number of times the reduce function has been executed on the current group
         * @param {boolean} reduceContext.isRestarted - Indicates whether the current invocation of this function is the first
         *     invocation (if true, the current invocation is not the first invocation and this function has been restarted)
         * @param {string} reduceContext.key - Key to be processed during the reduce stage
         * @param {List<String>} reduceContext.values - All values associated with a unique key that was passed to the reduce stage
         *     for processing
         * @since 2015.2
         */
        const reduce = (reduceContext) => {

            try {
                let customerId = reduceContext.key;
                let invoiceData = reduceContext.values.map(JSON.parse);
                let salesRep = invoiceData[0].salesrep;
                log.debug("salesrep" + salesRep);
                salesRep = (salesRep == 'admin') ? -5 : salesRep;

                log.debug("customerId" + customerId);


                csvContent = 'Customer Name, Customer Email, Invoice document Number, Invoice Amount, Days Overdue\n'

                invoiceData.forEach(data => {
                    csvContent += `${data.customer},${data.email},${data.docid},${data.total},${data.daysoverdue}\n`
                })


                let csvFile = file.create({
                    name: 'invoice.csv',
                    folder: 457,
                    fileType: file.Type.CSV,
                    contents: csvContent

                })
                csvFile.save();

                email.send({
                    author: salesRep,
                    recipients: customerId,
                    subject: 'Overdue Invoice',
                    body: 'Your invoice is overdue',
                    attachments: [csvFile]
                })
                log.debug("Email send successfully");

            }
            catch (e) {
                log.error("Error in reduce:", e);
            }

        }


        /**
         * Defines the function that is executed when the summarize entry point is triggered. This entry point is triggered
         * automatically when the associated reduce stage is complete. This function is applied to the entire result set.
         * @param {Object} summaryContext - Statistics about the execution of a map/reduce script
         * @param {number} summaryContext.concurrency - Maximum concurrency number when executing parallel tasks for the map/reduce
         *     script
         * @param {Date} summaryContext.dateCreated - The date and time when the map/reduce script began running
         * @param {boolean} summaryContext.isRestarted - Indicates whether the current invocation of this function is the first
         *     invocation (if true, the current invocation is not the first invocation and this function has been restarted)
         * @param {Iterator} summaryContext.output - Serialized keys and values that were saved as output during the reduce stage
         * @param {number} summaryContext.seconds - Total seconds elapsed when running the map/reduce script
         * @param {number} summaryContext.usage - Total number of governance usage units consumed when running the map/reduce
         *     script
         * @param {number} summaryContext.yields - Total number of yields when running the map/reduce script
         * @param {Object} summaryContext.inputSummary - Statistics about the input stage
         * @param {Object} summaryContext.mapSummary - Statistics about the map stage
         * @param {Object} summaryContext.reduceSummary - Statistics about the reduce stage
         * @since 2015.2
         */
        const summarize = (summaryContext) => {

        }

        return { getInputData, map, reduce, summarize }

    });
