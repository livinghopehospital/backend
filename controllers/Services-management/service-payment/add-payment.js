

const joi = require("joi");
const { HttpError } = require("../../../middlewares/errors/http-error");
const joiError = require("../../../middlewares/errors/joi-error");
const { servicePayment } = require("../../../model/service-management/service-payment");
const { httpResponse } = require("../../../middlewares/http/http-response");
const servicesRendered = require("../../../model/service/service");
const serviceCategory = require("../../../model/service-management/service-categories");
const val  = joi.object({
    service: joi.array().min(1),
    invoice_number: joi.string().required(),
    incoming_price: joi.any(),
    original_price: joi.any(),
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
        const paymentMaid = [];
        const {service, created_at, invoice_number, payment_type, total_amount, customer_name} = body;
        for (let index = 0; index < service.length; index++) {
            const bodyParams = {
                amount_paid: service[index].original_price!=null?service[index]. original_price:service[index].incoming_price,
                service_name: service[index].service_name,
                service_categories: service[index].service_category,
                created_at: `${created_at}Z`,
                invoice_number,
                customer_name,
                payment_type,
                total_amount,
                branch: branch_id
            }
         paymentMaid.push(bodyParams);
         const newPayment =await  servicePayment.addPayment(bodyParams);
         if (newPayment) {
            returnArray[index] = {product_name: '', product_price: 0}
            if (Object.keys(returnArray).length==service.length) {
                const data = await Promise.all(  paymentMaid.map(async(report)=>{
                    const service =await  servicesRendered.findOne({_id: report.service_name});
                    const {service_name,service_categories,...others} = report;
                      return { service_name : service.service_name,...others}
                    }));
                    console.log(data);
              httpResponse({status_code:200, response_message:'Payment successfully added',data:data,res});
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