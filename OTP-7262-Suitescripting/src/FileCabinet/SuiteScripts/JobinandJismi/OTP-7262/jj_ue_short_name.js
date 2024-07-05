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
           
            if(scriptContext.type===scriptContext.UserEventType.CREATE || scriptContext.type===scriptContext.UserEventType.EDIT)
                {
                    let newRecord=scriptContext.newRecord;
                    try{
                        let customerName = newRecord.getValue({fieldId :'entityid'});
                        let dateCreated = new Date(newRecord.getValue({fieldId:'createddate'}) || new Date());
                        let shortName = customerName.substring(0,2);
                        let creationMonth = ('0'+(dateCreated.getMonth()+1)).slice(-2);
                        shortName += ':'+creationMonth;
                        newRecord.setValue({
                            fieldId : 'custentity_jj_short_name',
                            value : shortName
                        })
                        log.debug('The short name is updated!!');
                    }catch(e){
                        log.debug('Error updating short name : '+e.message);
                    }
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

        }

        return {beforeLoad, beforeSubmit, afterSubmit}

    });
