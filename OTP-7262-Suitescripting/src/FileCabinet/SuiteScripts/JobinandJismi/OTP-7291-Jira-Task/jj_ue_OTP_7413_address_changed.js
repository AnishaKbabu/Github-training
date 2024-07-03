/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */
/**********************************************************************************
 * OTP-7413 : Identify change in address
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
 * Date Created: 02-July-2024
 *
 * Description: This script is for Whenever there is a change in exiting Address or new Address is added to the Customer Record, the custom checkbox in customer record should be checked.
 *
 *
 * REVISION HISTORY
 *
 * @version 1.0 company name: 02-July-2024: Created the initial build by JJ0352
 *
 *
 *
 **************/
define(['N/log', 'N/record'],
    /**
     * @param {log} log
     * @param {record} record
     */
    (log, record) => {
        /**
         * Defines the function definition that is executed before record is loaded.
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
         * @param {Form} scriptContext.form - Current form
         * @since 2015.2
         */
        const beforeLoad = (scriptContext) => {
            if (scriptContext.type === scriptContext.UserEventType.EDIT) {
                let newRecord = scriptContext.newRecord;
                newRecord.setValue({ fieldId: 'custentity_jj_address_changed', value: false });
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
            try {
                if (scriptContext.type !== scriptContext.UserEventType.EDIT) {
                    return;
                }
                else {

                    let newRecord = scriptContext.newRecord;
                    var oldRecord = scriptContext.oldRecord;


                    if (hasAddressChanged(newRecord, oldRecord)) {
                        newRecord.setValue({ fieldId: 'custentity_jj_address_changed', value: true });
                        log.debug({
                            title: 'Address Changed',
                            details: 'Setting custentity_jj_address_changed to true'
                        });
                    } else {
                        newRecord.setValue({ fieldId: 'custentity_jj_address_changed', value: false });
                        log.debug({
                            title: 'Address Not Changed',
                            details: 'Setting custentity_jj_address_changed to false'
                        });
                    }
                }

            } catch (e) {
                log.error({
                    title: 'Error in beforeSubmit',
                    details: e.toString()
                });
            }
        }

        /** The function hasAddressChanged is used for checking the address is changed or not in customer record  */

        function hasAddressChanged(newRecord, oldRecord) {
            try {
                var addressChanged = false;


                var newAddressCount = newRecord.getLineCount({ sublistId: 'addressbook' });
                var oldAddressCount = oldRecord ? oldRecord.getLineCount({ sublistId: 'addressbook' }) : 0;


                if (newAddressCount !== oldAddressCount) {
                    addressChanged = true;
                } else {

                    for (var i = 0; i < newAddressCount; i++) {
                        var fields = newRecord.getSublistFields({ sublistId: 'addressbook', line: i });


                        for (var j = 0; j < fields.length; j++) {
                            var fieldId = fields[j];
                            var newValue = newRecord.getSublistValue({ sublistId: 'addressbook', fieldId: fieldId, line: i });
                            var oldValue = oldRecord.getSublistValue({ sublistId: 'addressbook', fieldId: fieldId, line: i });


                            if (newValue !== oldValue) {
                                addressChanged = true;
                                break;
                            }
                        }

                        if (addressChanged) {
                            break;
                        }
                    }
                }

                return addressChanged;

            } catch (e) {
                log.error({
                    title: 'Error in hasAddressChanged',
                    details: e.toString()
                });
                return false;
            }
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
            // Optional: Implement any logic needed after submit
        }

        return { beforeLoad, beforeSubmit, afterSubmit };

    });
