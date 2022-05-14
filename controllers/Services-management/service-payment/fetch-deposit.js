
const joiError = require("../../../middlewares/errors/joi-error");
const { httpResponse } = require("../../../middlewares/http/http-response");
const { servicePaymentDeposit } = require("../../../model/service-management/service-payment-deposit");
const servicesRendered = require("../../../model/service/service");



const fetchDeposit = async function fetchDeposit(req,res,next){
    try {
        const {branch_id} = req.userData;
        let returnArray  = [];
        const serviceDeposit  = await servicePaymentDeposit.fetchDeposit(branch_id);
        if (serviceDeposit) {
        const service = [];
            for (let index = 0; index < serviceDeposit.length; index++) {
                const serviceName = await servicesRendered.findOne({_id:serviceDeposit[index].service_name})
                const bodyParams = {
                    _id:  serviceDeposit[index]._id,
                    amount_paid: serviceDeposit[index].amount_paid,
                    amount_to_pay: serviceDeposit[index].amount_to_pay,
                    amount_to_balance: serviceDeposit[index].amount_to_balance,
                    service_name: serviceName.service_name,
                    service_categories: serviceDeposit[index].service_categories,
                    created_at:serviceDeposit[index].created_at,
                    customer_name: serviceDeposit[index].customer_name,
                    invoice_number:serviceDeposit[index].invoice_number,
                    branch: branch_id
                }
                service.push(bodyParams);
                returnArray[index] = {product_name: '', product_price: 0}
                if (Object.keys(returnArray).length==serviceDeposit.length) {
                  httpResponse({status_code:200, response_message:'Deposit Payment successfully added',data:service,res});
                } 
            }
           
        }
    } catch (error) {
        joiError(error,next)
    }
}


module.exports={
    fetchDeposit
}