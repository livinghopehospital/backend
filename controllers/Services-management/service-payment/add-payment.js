

const joi = require("joi");
const joiError = require("../../../middlewares/errors/joi-error");
const { servicePayment } = require("../../../model/service-management/service-payment");

const val  = joi.object({
    service: joi.array().min(1),
    invoice_number: joi.string().required(),
    created_at: joi.date().required()
})



const addServicePayment = async function addServicePayment(req,res,next){
    try {
        const body = await val.validateAsync(req.body);
        let returnArray = [];
        const {branch_id} = req.userData;
        const {service, created_at, invoice_number} = body;
        for (let index = 0; index < service.length; index++) {
            const bodyParams = {
                amount_paid: service[index].amount_paid,
                service_name: service[index].service_name,
                service_categories: service[index].service_categories,
                created_at,
                invoice_number,
                branch: branch_id
            }
         const newPayment = servicePayment.addPayment(bodyParams);
         if (newPayment) {
            returnArray[index] = {product_name: '', product_price: 0}
            if (Object.keys(returnArray).length==service.length) {
              httpResponse({status_code:200, response_message:'Payment successfully added',data:newPayment,res});
            } 
         }
         
        }
    } catch (error) {
        joiError(error, next)
    }
}


module.exports={
    addServicePayment
}