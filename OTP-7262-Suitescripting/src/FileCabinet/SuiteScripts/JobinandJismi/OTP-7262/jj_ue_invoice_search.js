/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */
define(['N/search'],
    /**
 * @param{search} search
 */
    (search) => {
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
            try {
                let columns = [
                    search.createColumn({ name: 'tranid', label: 'Document Number' }),
                    search.createColumn({ name: 'trandate', label: 'Date' }),
                    search.createColumn({ name: 'entity', label: 'Customer Name' }),
                    search.createColumn({ name: 'email', label: 'Customer Email' }),
                    search.createColumn({ name: 'amount', label: 'Amount' })
                ];


                let invoiceSearch = search.create({
                    title: 'Open Invoice JJ',
                    id: 'customsearch_jj_open_invoice',
                    type: search.Type.INVOICE,
                    columns: columns,
                    filters: [
                        ['status', 'anyof', 'CustInvc:A'], 'AND',
                        ['mainline', 'is', 'T']
                    ]
                });
                invoiceSearch.save();

                let searchResults = invoiceSearch.run().getRange({
                    start: 0,
                    end: 20
                });

                searchResults.forEach(function (result) {
                    let documentNumber = result.getValue({ name: 'tranid' });
                    let date = result.getValue({ name: 'trandate' });
                    let customerName = result.getText({ name: 'entity' });
                    let customerEmail = result.getValue({ name: 'email', join: 'customer' });
                    let amount = result.getValue({ name: 'amount' });

                    log.debug('Invoice Details:', 'Document Number: ' + documentNumber + ', Date: ' + date + ', Customer Name: ' + customerName + ', Customer Email: ' + customerEmail + ', Amount: ' + amount);

                    return true;
                });

            } catch (e) {
                log.error('Error Displaying Invoices Open: ' + e.message);
            }
        };



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

        }

        return { beforeLoad, beforeSubmit, afterSubmit }

    });
