/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */
define(['N/email', 'N/log', 'N/record', 'N/runtime'],
    /**
 * @param{email} email
 * @param{log} log
 * @param{record} record
 * @param{runtime} runtime
 */
    (email, log, record, runtime) => {
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
            // Implement beforeLoad logic if needed
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
            // Implement beforeSubmit logic if needed
        };

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
                    let entity = newRecord.getValue({ fieldId: 'employee' });

                    if (recordType === record.Type.PURCHASE_ORDER && entity) {
                        let employeeRecord = record.load({
                            type: record.Type.EMPLOYEE,
                            id: entity
                        });
                        let emailAddress = employeeRecord.getValue({ fieldId: 'email' });
                        let recipientEmail = emailAddress;

                        // Iterate over the items sublist
                        let itemCount = newRecord.getLineCount({ sublistId: 'item' });

                        for (let i = 0; i < itemCount; i++) {
                            let item = newRecord.getSublistValue({
                                sublistId: 'item',
                                fieldId: 'item',
                                line: i
                            });

                            let itemRecord = record.load({
                                type: record.Type.INVENTORY_ITEM, // or the appropriate type for the item
                                id: item
                            });

                            let itemName = itemRecord.getValue({ fieldId: 'itemid' });
                            let isPreferredVendor = itemRecord.getValue({ fieldId: 'preferredvendor' });

                            if (!isPreferredVendor) {
                                let subject = 'No Preferred Vendor';
                                let body = 'No Preferred Vendor is added for the item ' + itemName;

                                email.send({
                                    author: currentUser.id,
                                    recipients: recipientEmail,
                                    subject: subject,
                                    body: body
                                });

                                log.debug('Email sent successfully', 'Subject: ' + subject + ', Recipient: ' + recipientEmail);
                            }

                         
                            log.debug('The item is: ' + item);
                        }
                    }
                }
            } catch (e) {
                log.debug('Error Sending Email: ', e.message);
            }
        };

        return { beforeLoad, beforeSubmit, afterSubmit };
    });
