/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */
define(['N/log', 'N/record'],
    /**
 * @param{log} log
 * @param{record} record
 */
    (log, record) => {
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
                    let entityId = newRecord.getValue({ fieldId: 'entity' });

                    if (recordType === record.Type.SALES_ORDER && entityId) {
                        try {
                            let customerRecord = record.load({
                                type: record.Type.CUSTOMER,
                                id: entityId
                            });
                            customerRecord.setValue({
                                fieldId: 'custentity_jj_checkbox_sales',
                                value: true
                            });
                            customerRecord.save();
                            log.debug('Customer checkbox updated', 'Customer ID: ' + entityId);
                        } catch (e) {
                            log.error('Error updating customer checkbox', e.message);
                        }
                        
                    } else if (recordType === record.Type.PURCHASE_ORDER && entityId) {
                        try {
                            let vendorRecord = record.load({
                                type: record.Type.VENDOR,
                                id: entityId
                            });
                            vendorRecord.setValue({
                                fieldId: 'custentity_jj_checkbox_purchase',
                                value: true
                            });
                            vendorRecord.save();
                            log.debug('Vendor checkbox updated', 'Vendor ID: ' + entityId);
                        } catch (e) {
                            log.error('Error updating vendor checkbox', e.message);
                        }
                    }
                }
            } catch (e) {
                log.error('Error in afterSubmit', e.message);
            }



        }

        return {beforeLoad, beforeSubmit, afterSubmit}

    });
