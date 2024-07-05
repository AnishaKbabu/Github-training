/**
 * @NApiVersion 2.1
 * @NScriptType Restlet
 */
define(['N/log', 'N/record', 'N/search'],
    /**
 * @param{log} log
 * @param{record} record
 * @param{search} search
 */
    (log, record, search) => {
        /**
         * Defines the function that is executed when a GET request is sent to a RESTlet.
         * @param {Object} requestParams - Parameters from HTTP request URL; parameters passed as an Object (for all supported
         *     content types)
         * @returns {string | Object} HTTP response body; returns a string when request Content-Type is 'text/plain'; returns an
         *     Object when request Content-Type is 'application/json' or 'application/xml'
         * @since 2015.2
         */
        const get = (requestParams) => {
            let salesOrderId = requestParams.id;
            try {
                let salesOrder = record.load({
                    type: record.Type.SALES_ORDER,
                    id: salesOrderId
                });
        
                let itemCount = salesOrder.getLineCount({ sublistId: 'item' });
                let items = [];
                for (let i = 0; i < itemCount; i++) {
                    let item = salesOrder.getSublistValue({
                        sublistId: 'item',
                        fieldId: 'item',
                        line: i
                    });
                    let quantity = salesOrder.getSublistValue({
                        sublistId: 'item',
                        fieldId: 'quantity',
                        line: i
                    });
                    let rate = salesOrder.getSublistValue({
                        sublistId: 'item',
                        fieldId: 'rate',
                        line: i
                    });
                    let amount = salesOrder.getSublistValue({
                        sublistId: 'item',
                        fieldId: 'amount',
                        line: i
                    });
        
                    items.push({
                        item: item,
                        quantity: quantity,
                        rate: rate,
                        amount: amount
                    });
                }
        
                let salesOrderData = {
                    id: salesOrderId,
                    tranid: salesOrder.getValue({ fieldId: 'tranid' }),
                    entity: salesOrder.getText({ fieldId: 'entity' }),
                    items: items
                };
        
                if (itemCount > 2) {
                    log.audit('Info', 'Sales order contains more than 2 items');
                    salesOrderData.message = 'Sales order contains more than 2 items';
                }
        
                return salesOrderData;
        
            } catch (e) {
                log.error('Error displaying data: ' + e.message);
                return 'Sales Order is not found';
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
