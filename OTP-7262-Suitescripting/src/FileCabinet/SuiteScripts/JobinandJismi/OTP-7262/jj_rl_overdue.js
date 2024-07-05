/**
 * @NApiVersion 2.1
 * @NScriptType Restlet
 */
define(['N/record', 'N/search'],
    /**
 * @param{record} record
 * @param{search} search
 */
    (record, search) => {
        /**
         * Defines the function that is executed when a GET request is sent to a RESTlet.
         * @param {Object} requestParams - Parameters from HTTP request URL; parameters passed as an Object (for all supported
         *     content types)
         * @returns {string | Object} HTTP response body; returns a string when request Content-Type is 'text/plain'; returns an
         *     Object when request Content-Type is 'application/json' or 'application/xml'
         * @since 2015.2
         */
        const get = (requestParams) => {



            try {
               
                cusId = requestParams.id
                let customerSearch = search.create({
                    title: 'Customer Overdue search JJ',
                    id: 'customsearch_jj_customeroverdue_search',
                    type: record.Type.INVOICE,
                    filters:[['entity','is','custId'],'AND',['mainline','is','T'],'AND',['daysoverdue','greaterthan','0']],
                   
                    columns: ['internalid','entity','trandate','daysoverdue','amountremaining'],
                   
                })
 
                let searchResult = customerSearch.run().getRange(0,100);

                customerSearch.save();
               
 
                if(searchResult.length > 0){
 
                    return searchResult.map(i=>({
                        internalId: i.getValue('internalid'),
                        customerName: i.getText('entity'),
                        invoiceDate: i.getValue('trandate'),
                        overdueBalance: i.getValue('amountremaining'),
                        daysOverdue: i.getValue('daysoverdue')
                       
                    }))
                   
 
                }
                else{
                    return "No records found"
                    }
                    } catch (e) {
                        log.error("Error",e)
                        }
 
        }

        /**
         * Defines the function that is executed when a PUT request is sent to a RESTlet.
         * @param {string | Object} requestBody - The HTTP request body; request body are passed as a string when request
         *     Content-Type is 'text/plain' or parsed into an Object when request Content-Type is 'application/json' (in which case
         *     the body must be a valid JSON)
         * @returns {string | Object} HTTP response body; returns a string when request Content-Type is 'text/plain'; returns an
         *     Object when request Content-Type is 'application/json' or 'application/xml'
         * @since 2015.2
         */
        const put = (requestBody) => {

        }

        /**
         * Defines the function that is executed when a POST request is sent to a RESTlet.
         * @param {string | Object} requestBody - The HTTP request body; request body is passed as a string when request
         *     Content-Type is 'text/plain' or parsed into an Object when request Content-Type is 'application/json' (in which case
         *     the body must be a valid JSON)
         * @returns {string | Object} HTTP response body; returns a string when request Content-Type is 'text/plain'; returns an
         *     Object when request Content-Type is 'application/json' or 'application/xml'
         * @since 2015.2
         */
        const post = (requestBody) => {

        }

        /**
         * Defines the function that is executed when a DELETE request is sent to a RESTlet.
         * @param {Object} requestParams - Parameters from HTTP request URL; parameters are passed as an Object (for all supported
         *     content types)
         * @returns {string | Object} HTTP response body; returns a string when request Content-Type is 'text/plain'; returns an
         *     Object when request Content-Type is 'application/json' or 'application/xml'
         * @since 2015.2
         */
        const doDelete = (requestParams) => {

        }

        return {get, put, post, delete: doDelete}

    });
