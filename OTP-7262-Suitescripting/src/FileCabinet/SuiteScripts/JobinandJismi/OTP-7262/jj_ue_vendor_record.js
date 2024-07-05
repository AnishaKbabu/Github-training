/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */
define(['N/log', 'N/search'],
    /**
 * @param{log} log
 * @param{search} search
 */
    (log, search) => {
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
            let vendorSearch = search.create({
                title: 'Vendor Record JJ',
                id: 'customsearch_jj_vendor_record',
                type:search.Type.VENDOR,
                columns:[
                    'entityid','subsidiary'
                ]
            })
            vendorSearch.save();

            let searchResult=vendorSearch.run().getRange({
                start : 0,
                end :20
            })
            searchResult.forEach(function(result){
                let vendorName = result.getValue({name :'entityid'});
                let subsidiary=result.getText({name:'subsidiary'});
                log.debug('vendor Details','Name: '+vendorName+', Subsidiary : '+subsidiary);
            })
         }catch(e){
            log.error('Error Displaying vendor'+e.message);

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
