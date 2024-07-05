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
             let salesOrder = search.create({
                title : 'Sales Order Search JJ',
                id: 'customsearch_jj_sales_order',
                type:search.Type.SALES_ORDER,
                columns:['tranid','trandate','entity','subsidiary','amount'],
                filters:[['status', 'anyof', 'SalesOrd:B'],'AND',
                ['mainline','is','T']]

             });
             let resultSet = salesOrder.run().getRange({
                start:0,       
                end:20
            });
            resultSet.forEach(function(result){
                let documentNumber = result.getValue({name:'tranid'});
                let date = result.getValue({name :'trandate'});
                let customerName = result.getText({name :'entity'} );
                let subsidiary = result.getText({name :'subsidiary'});
                let amount = result.getValue({name :'amount'})
                log.debug('Sales Order Details','Document Number : '+documentNumber +',Date : '+date + ',Customer Name : '+customerName+',Subsidiary : '+subsidiary+',Amount:'+amount)
                
            })
          }catch(e){
            log.error('Error displaying sales order : '+e.message);
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
