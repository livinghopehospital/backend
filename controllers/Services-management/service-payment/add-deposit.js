const { HttpError } = require("../../../middlewares/errors/http-error");
const { httpResponse } = require("../../../middlewares/http/http-response");
const { servicePaymentDeposit,serviceDepositTrack } = require("../../../model/service-management/service-payment-deposit");
const joiError = require("../../../middlewares/errors/joi-error");
const joi = require('joi');

const val  = joi.object({
    service: joi.array().min(1),
    customer_name: joi.string().uppercase(),
    payment_type: joi.string().required(),
    invoice_number: joi.string().required(),
    created_at: joi.date().required()
})


const addDeposit = async function addDeposit(req,res,next){
    try {
        const body = await val.validateAsync(req.body);
        let returnArray = [];
        const {branch_id} = req.userData;
        const {service, created_at, invoice_number, customer_name} = body;
        for (let index = 0; index < service.length; index++) {
            const bodyParams = {
                amount_paid: service[index].amount_paid,
                amount_to_pay: service[index].amount_to_pay,
                amount_to_balance: Number(service[index].amount_to_pay) -Number(service[index].amount_paid),
                service_name: service[index].service_name,
                service_categories: service[index].service_categories,
                created_at,
                customer_name,
                invoice_number,
                branch: branch_id
            }

         const newPayment = servicePaymentDeposit.addPayment(bodyParams); //create record
         const depositTrack = serviceDepositTrack.createDepositTrack(bodyParams); //deposit track record
         if (newPayment&&depositTrack) {
            returnArray[index] = {product_name: '', product_price: 0}
            if (Object.keys(returnArray).length==service.length) {
              httpResponse({status_code:200, response_message:'Deposit Payment successfully added',data:newPayment,res});
            } 
         }
         
        }
    } catch (error) {
        joiError(error, next);
    }
}






const updateDepositPayemt = async function updateDepositPayemt(req,res,next){
    try {
        const {depositId} = req.query;
        const {amount} = req.body;
        if (!depositId) {
            return next(new HttpError(400, 'Please provide depositId in your query'));
        }else if(!amount){
        return next(new HttpError(400, 'Please provide amount this customer want to pay'));  
        }
        const data = {
            $inc: { amount_to_balance: -amount},
            $inc: { amount_paid: +amount}
        }
        const updatePayment = await servicePaymentDeposit.updateServiceDeposit(depositId, data);

        if (updatePayment) {
            const depositParams = {
                ...updatePayment
            }
            const depositTrack = serviceDepositTrack.createDepositTrack(depositParams);
            /****Move this payment to sales once this customer has successfully paid all the money */
            httpResponse({status_code:200, response_message:'Deposit payment successfully added', data:{updatePayment}, res});
        }else{
            return next(new HttpError(500, 'Deposit payment not updated. Please contact support if persists'));   
        }
    } catch (error) {
      return next(new HttpError(500, 'Internal server error. Please contact support if persists'));   
    }
}

module.exports={
    addDeposit,
    updateDepositPayemt
}