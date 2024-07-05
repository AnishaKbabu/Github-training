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
                let creditMemo = search.create({
                   title : 'Credit Memo JJ',
                   id: 'customsearch_jj_credit_memo',
                   type:search.Type.CREDIT_MEMO,
                   columns:['tranid','trandate','entity','amount','status'],
                   filters:[['entity', 'is', '28'],'AND',
                   ['mainline','is','T']]
   
                });
                let resultSet = creditMemo.run().getRange({
                   start:0,
                   end:20
               });
               resultSet.forEach(function(result){
                   let transactionId = result.getValue({name:'tranid'});
                   let transactionDate = result.getValue({name :'trandate'});
                   let totalAmount = result.getValue({name :'amount'} );
                   let status = result.getText({name :'status'});
                   let customerName = result.getText({name :'entity'} );
                   log.debug('Credit Memo Details','Transaction Id : '+transactionId+',Transaction Date : '+transactionDate +',Customer Name: '+customerName+ ',Total Amount : '+totalAmount+',Status : '+status)
                   
               })
             }catch(e){
               log.error('Error displaying Credit Memo : '+e.message);
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
