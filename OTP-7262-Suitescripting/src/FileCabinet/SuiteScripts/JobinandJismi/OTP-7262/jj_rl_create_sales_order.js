/**
 * @NApiVersion 2.1
 * @NScriptType Restlet
 */
define(['N/log', 'N/record'],
    /**
 * @param{log} log
 * @param{record} record
 */
    (log, record) => {
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

            try {
                var salesOrder = record.create({
                    type: record.Type.SALES_ORDER,
                    isDynamic: true
                });

                // Set the customer ID
                salesOrder.setValue({
                    fieldId: 'entity',
                    value: requestBody.customerId
                });

                // Set the other necessary fields (add more as needed)
               

                if (requestBody.memo) {
                    salesOrder.setValue({
                        fieldId: 'memo',
                        value: requestBody.memo
                    });
                }

                // Add the items
                requestBody.items.forEach(function(item) {
                    salesOrder.selectNewLine({
                        sublistId: 'item'
                    });
                    salesOrder.setCurrentSublistValue({
                        sublistId: 'item',
                        fieldId: 'item',
                        value: item.itemId
                    });
                    salesOrder.setCurrentSublistValue({
                        sublistId: 'item',
                        fieldId: 'quantity',
                        value: item.quantity
                    });
                    salesOrder.setCurrentSublistValue({
                        sublistId: 'item',
                        fieldId: 'rate',
                        value: item.rate
                    });
                    salesOrder.commitLine({
                        sublistId: 'item'
                    });
                });

                var salesOrderId = salesOrder.save();

                return {
                    status: 'success',
                    salesOrderId: salesOrderId
                };
            } catch (e) {
                return {
                    status: 'error',
                    message: e.message
                };
            }

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
