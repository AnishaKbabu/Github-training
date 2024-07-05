/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */
define(['N/record'],
    /**
 * @param{record} record
 */
    (record) => {
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
            try{
                let purchaseOrder =record.create({
                    type : record.Type.PURCHASE_ORDER,
                    isDynamic : true
                })

                purchaseOrder.setValue({
                    fieldId : 'entity',
                    value : 25
                })

                purchaseOrder.setValue({
                    fieldId : 'employee',
                    value : 35
                })

                purchaseOrder.setValue({
                    fieldId : 'subsidiary',
                    value : 1
                })

                //Add line items

                purchaseOrder.selectNewLine({sublistId : 'item'});
                purchaseOrder.setCurrentSublistValue({
                    sublistId : 'item',
                    fieldId : 'item',
                    value : 36
                })
               
                purchaseOrder.setCurrentSublistValue({
                    sublistId : 'item',
                    fieldId : 'quantity',
                    value : 2
                })
        
                purchaseOrder.setCurrentSublistValue({
                    sublistId : 'item',
                    fieldId : 'rate',
                    value : 200
                })

                purchaseOrder.commitLine({sublistId: 'item'});
                  

                //save the record

                let purId = purchaseOrder.save();
                log.debug('Purchase Order is Created','Purchase Order id: '+ purId);


            }
            catch(e){
                log.error('Error creating purchase order' + e.message);
            }
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

        }

        return {beforeLoad, beforeSubmit, afterSubmit}

    });
