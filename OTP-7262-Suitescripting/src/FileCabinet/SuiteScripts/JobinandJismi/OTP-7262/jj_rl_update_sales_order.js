/**
 * @NApiVersion 2.1
 * @NScriptType Restlet
 */
define(['N/record'],
    /**
 * @param{record} record
 */
    (record) => {
        /**
         * Defines the function that is executed when a GET request is sent to a RESTlet.
         * @param {Object} requestParams - Parameters from HTTP request URL; parameters passed as an Object (for all supported
         *     content types)
         * @returns {string | Object} HTTP response body; returns a string when request Content-Type is 'text/plain'; returns an
         *     Object when request Content-Type is 'application/json' or 'application/xml'
         * @since 2015.2
         */
        const get = (requestParams) => {

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


            try{
                if(typeof requestBody === 'string')
                    {
                        requestBody=JSON.parse(requestBody);
                    }
                    if(!requestBody.salesOrderId){
                        return {
                            status : 'Error',
                            message : 'Sales Order Id is Required'
                        }
                    }
                    let salesOrder = record.load({
                        type: record.Type.SALES_ORDER,
                        id : requestBody.salesOrderId,
                        isDymanic :true
                    })
                    if (requestBody.memo) {
                        salesOrder.setValue({
                            fieldId: 'memo',
                            value: requestBody.memo
                        });
                    }
    
                    if (requestBody.salesRep) {
                        salesOrder.setValue({
                            fieldId: 'salesrep',
                            value: requestBody.salesrep
                        });
                    }
    
        
                    var salesOrderId = salesOrder.save();
    
                    return {
                        status: 'success',
                        salesOrderId: salesOrderId
                    };

            }
            catch(e)
            {
                return {
                    status: 'error',
                    message: e.message
                };
            }

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
