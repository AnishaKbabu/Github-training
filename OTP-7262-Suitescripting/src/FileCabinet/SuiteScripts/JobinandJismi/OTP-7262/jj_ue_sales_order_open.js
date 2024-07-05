/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */
define(['N/email', 'N/log', 'N/record', 'N/runtime', 'N/search'],
    /**
 * @param{email} email
 * @param{log} log
 * @param{record} record
 * @param{runtime} runtime
 * @param{search} search
 */
    (email, log, record, runtime, search) => {
        /**
         * Defines the function definition that is executed before record is loaded.
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
         * @param {Form} scriptContext.form - Current form
         * @param {ServletRequest} scriptContext.request - HTTP request information sent from the browser for a client action only.
         * @since 2015.2
         */
        const beforeLoad = (scriptContext) => {

        }

        /**
         * Defines the function definition that is executed before record is submitted.
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {Record} scriptContext.oldRecord - Old record
         * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
         * @since 2015.2
         */
        const beforeSubmit = (scriptContext) => {

        }

        /**
         * Defines the function definition that is executed after record is submitted.
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {Record} scriptContext.oldRecord - Old record
         * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
         * @since 2015.2
         */
        const afterSubmit = (scriptContext) => {

            try {
                if (scriptContext.type === scriptContext.UserEventType.CREATE) {
                    let newRecord = scriptContext.newRecord;
                    let recordType = newRecord.type;
                    let currentUser = runtime.getCurrentUser();
                    let entityId = newRecord.getValue({ fieldId: 'entity' });
                    let entityName = scriptContext.newRecord.getValue({ fieldId: 'entityid' });

                    if (recordType === record.Type.SALES_ORDER && entityId) {

                        let customerRecord = record.load({
                            type: record.Type.CUSTOMER,
                            id: entityId
                        });

                        let salesRep = customerRecord.getValue({ fieldId: 'salesrep' });

                        let employeeRecord = record.load({
                            type: record.Type.EMPLOYEE,
                            id: salesRep
                        });
                        let emailAddress = employeeRecord.getValue({ fieldId: 'email' });
                        let recipientEmail = emailAddress;
                        let subject, body;

                        let salesOrder = search.create({
                            title: 'Sales Order  Open Search JJ',
                            id: 'customsearch_jj_sales_order_open',
                            type: search.Type.SALES_ORDER,
                            columns: ['tranid', 'trandate', 'entity', 'subsidiary', 'amount'],
                            filters: [['status', 'anyof', 'SalesOrd:B'], 'AND',
                            ['mainline', 'is', 'T'], 'AND', ['entity', 'is', entityId]]

                        });
                        let resultSet = salesOrder.run().getRange({
                            start: 0,
                            end: 20
                        });
                        resultSet.forEach(function (result) {
                            let documentNumber = result.getValue({ name: 'tranid' });
                            let date = result.getValue({ name: 'trandate' });
                            let customerName = result.getText({ name: 'entity' });
                            let subsidiary = result.getText({ name: 'subsidiary' });
                            let amount = result.getValue({ name: 'amount' })
                            log.debug('Sales Order Details', 'Document Number : ' + documentNumber + ',Date : ' + date + ',Customer Name : ' + customerName + ',Subsidiary : ' + subsidiary + ',Amount:' + amount)

                        })



                        subject = recordType + 'Open Sales Order is More than 5';
                        body = 'The' + entityName + ' has more than 5 open sales orders:\n';

                        if (resultSet.length > 5) {

                            log.debug('The sales order count is : ' + resultSet.length);
                            log.debug('The sales Rep ' + salesRep);
                            log.debug('The sales email ' + emailAddress);
        
                            email.send({
                                author: currentUser.id,
                                recipients: recipientEmail,
                                subject: subject,
                                body: body
                            });
        
                            log.debug('Email sent successfully', 'Subject: ' + subject + ', Recipient: ' + recipientEmail);
        
                        }
        
        
                        log.debug("The sales order and search is created");
        

                    }
                    
                }

                




            } catch (e) {
                log.debug('Error Sending email to the sales rep: ' + e.message);
            }
        }

        return { beforeLoad, beforeSubmit, afterSubmit }

    });
