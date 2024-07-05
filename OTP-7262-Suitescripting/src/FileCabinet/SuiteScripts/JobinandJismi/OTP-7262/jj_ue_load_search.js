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
            
            let loadedSearch=search.load({
                id: 12,
                type: search.Type.CUSTOMER
            })
            

            let resultSet = loadedSearch.run().getRange({
                start:0,
                end:20
            });
            resultSet.forEach(function(result){
                let customerName = result.getValue({name:'entityid'});
                let subsidiary = result.getText({name :'subsidiary'});
                let salesrep = result.getText({name :'salesrep'} );
                let email = result.getValue({name :'email'});
                let datecreated = result.getValue({name :'datecreated'})
                log.debug('Customer Details','Customer Name : '+customerName +',Subsidiary : '+subsidiary + ',Sales Rep : '+salesrep+',Email : '+email+',Date Created:'+datecreated)
                
            })

          }catch(e){
            log.error('Error Loading and displaying search'+e.message);
          }
          return{
            beforeLoad:beforeLoad
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
