const { HttpError } = require("../../../middlewares/errors/http-error");
const { httpResponse } = require("../../../middlewares/http/http-response");
const { servicePaymentDeposit,serviceDepositTrack } = require("../../../model/service-management/service-payment-deposit");
const joiError = require("../../../middlewares/errors/joi-error");
const joi = require('joi');
const { servicePayment } = require("../../../model/service-management/service-payment");

const val  = joi.object({
    service: joi.array().min(1),
    customer_name: joi.string().uppercase().trim(),
    payment_type: joi.string().required(),
    invoice_number: joi.string().required(),
    created_at: joi.date().required()
});


const addDeposit = async function addDeposit(req,res,next){
    try {
        const body = await val.validateAsync(req.body);
        let returnArray = [];
        const {branch_id,username} = req.userData;
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
                username,
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
            $inc: { amount_to_balance: -amount, amount_paid: +amount},
          
        }
        const updatePayment = await servicePaymentDeposit.updateServiceDeposit(depositId, data);

        if (updatePayment) {
            const {_id, ...other} = updatePayment._doc;
           
            const depositParams = {
                ...other,
                amount_paid_today: amount
            }
            const depositTrack =await serviceDepositTrack.createDepositTrack(depositParams);
              if (Number(updatePayment. amount_to_balance)==0) {
                const {branch,service_name,service_categories,created_at,customer_name,username,invoice_number} = updatePayment;
                const bodyParams = {
                    amount_paid: amount_to_pay,
                    service_name,
                    service_categories,
                    created_at,
                    invoice_number,
                    customer_name,
                    username,
                    payment_type,
                    total_amount:amount_to_pay,
                    branch
                }
              const sales = await  servicePayment.addPayment(bodyParams);
              if (sales) {
                httpResponse({status_code:200, response_message:'Customer has successfully balance up', data:{updatePayment}, res});
              }
              }else{
                httpResponse({status_code:200, response_message:'Deposit payment successfully updated', data:{updatePayment}, res});
              }
           
        }else{
            return next(new HttpError(500, 'Deposit payment not updated. Please contact support if persists'));   
        }
    } catch (error) {
        console.log(error);
      return next(new HttpError(500, 'Internal server error. Please contact support if persists'));   
    }
}

module.exports={
    addDeposit,
    updateDepositPayemt
}