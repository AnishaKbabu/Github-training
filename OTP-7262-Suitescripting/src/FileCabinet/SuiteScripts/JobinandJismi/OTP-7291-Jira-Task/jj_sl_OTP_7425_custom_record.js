/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
/**********************************************************************************
 * OTP-7425 : External Custom Record form and actions
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
 * Date Created: 04-July-2024
 *
 * Description: This script is used for creating a custom record externally and If there is a customer with the given email Id, link that customer to the custom record.
 * Whenever there is an entry in a custom record, send a notification to a static NetSuite Admin.
    If there is a Sales Rep for the customer, send a notification email to the Sales Rep as well.
 *
 *
 * REVISION HISTORY
 *
 * @version 1.0 company name: 04-July-2024: Created the initial build by JJ0352
 *
 *
 *
 **************/
define(['N/email', 'N/record', 'N/runtime', 'N/search', 'N/ui/serverWidget'],
    /**
 * @param{email} email
 * @param{record} record
 * @param{runtime} runtime
 * @param{search} search
 * @param{serverWidget} serverWidget
 */
    (email, record, runtime, search, serverWidget) => {
        /**
         * Defines the Suitelet script trigger point.
         * @param {Object} scriptContext
         * @param {ServerRequest} scriptContext.request - Incoming request
         * @param {ServerResponse} scriptContext.response - Suitelet response
         * @since 2015.2
         */
        const onRequest = (scriptContext) => {
            if (scriptContext.request.method === 'GET') {
                let form = serverWidget.createForm({
                    title: 'Create Custom Record'
                });
                form.addField({
                    id: 'custpage_customer_name',
                    type: serverWidget.FieldType.TEXT,
                    label: 'Customer Name'
                }).isMandatory = true;

                form.addField({
                    id: 'custpage_customer_email',
                    type: serverWidget.FieldType.EMAIL,
                    label: 'Customer Email'
                }).isMandatory = true;

                form.addField({
                    id: 'custpage_subject',
                    type: serverWidget.FieldType.TEXT,
                    label: 'Subject'
                }).isMandatory = true;

                form.addField({
                    id: 'custpage_message',
                    type: serverWidget.FieldType.TEXTAREA,
                    label: 'Message'
                }).isMandatory = true;


                form.addSubmitButton({
                    label: 'Submit'
                });

                scriptContext.response.writePage(form);

            } else if (scriptContext.request.method === 'POST') {
                let data = scriptContext.request.parameters
                let customerName = data.custpage_customer_name;
                let customerEmail = data.custpage_customer_email;
                let subject = data.custpage_subject;
                let message = data.custpage_message;
                let adminEmail = -5;

                try {
                    let customerSearch = search.create({
                        type: search.Type.CUSTOMER,
                        filters: [
                            ['email', 'is', customerEmail]
                        ],
                        columns: ['internalid', 'salesrep']
                    });

                    let customerId = null;
                    let salesRepId = null;
                    let resultSet = customerSearch.run();
                    resultSet.each(function (result) {
                        customerId = result.getValue('internalid');
                        salesRepId = result.getValue('salesrep');
                        return false;
                    });


                    let customRecord = record.create({
                        type: 'customrecord_jj_external_custom_record'
                    });

                    customRecord.setValue('custrecord_jj_customer_name', customerName);
                    customRecord.setValue('custrecord_jj_customer_email', customerEmail);
                    if (customerId) {
                        customRecord.setValue('custrecord_jj_customer', customerId);
                    }
                    customRecord.setValue('custrecord_jj_customer_subject', subject);
                    customRecord.setValue('custrecord_jj_customer_message', message);

                    let recordId = customRecord.save();
                    log.debug('Custom Record Created', 'Record ID: ' + recordId);

                    email.send({
                        author: runtime.getCurrentUser().id,
                        recipients: adminEmail,
                        subject: 'New Custom Record Entry',
                        body: 'A new custom record entry has been created with email: ' + customerEmail
                    });


                    if (salesRepId) {
                        email.send({
                            author: runtime.getCurrentUser().id,
                            recipients: salesRepId,
                            subject: 'New Custom Record Entry for a Customer',
                            body: 'A new custom record entry has been created for a customer with email: ' + customerEmail
                        });
                    }

                    scriptContext.response.write('Custom record created successfully. Record ID: ' + recordId);
                } catch (e) {
                    log.error('Error creating custom record', e.message);
                    scriptContext.response.write('Error: ' + e.message);
                }
            }

        }

        return { onRequest }

    });
