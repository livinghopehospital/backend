

const joi = require("joi");
const { HttpError } = require("../../../middlewares/errors/http-error");
const joiError = require("../../../middlewares/errors/joi-error");
const { servicePayment } = require("../../../model/service-management/service-payment");
const { httpResponse } = require("../../../middlewares/http/http-response");
const servicesRendered = require("../../../model/service/service");
const val  = joi.object({
    service: joi.array().min(1),
    invoice_number: joi.string().required(),
    created_at: joi.date().required(),
    customer_name: joi.any(),
    payment_type: joi.string(),
    total_amount: joi.string(),
})





const addServicePayment = async function addServicePayment(req,res,next){
    try {
        const body = await val.validateAsync(req.body);
        let returnArray = [];
        const {branch_id} = req.userData;
        console.log(req.body);
        const {service, created_at, invoice_number, payment_type, total_amount, customer_name} = body;
        for (let index = 0; index < service.length; index++) {
            const bodyParams = {
                amount_paid: service[index].amount_paid,
                service_name: service[index].service_name,
                service_categories: service[index].service_category,
                created_at: `${created_at}Z`,
                invoice_number,
                customer_name,
                payment_type,
                total_amount,
                branch: branch_id
            }
         const newPayment = servicePayment.addPayment(bodyParams);
         if (newPayment) {
             console.log(newPayment);
            returnArray[index] = {product_name: '', product_price: 0}
            if (Object.keys(returnArray).length==service.length) {
                // const data = await Promise.all(  branchReport.map(async(report)=>{
                //     const service =await  servicesRendered.findOne({_id: report.service_name});
                //     const {service_categories,...others} = report;
                //       return {...others, service_name : service.service_name,}
                //     }))
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