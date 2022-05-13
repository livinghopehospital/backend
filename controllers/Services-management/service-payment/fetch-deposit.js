
const joiError = require("../../../middlewares/errors/joi-error");
const { httpResponse } = require("../../../middlewares/http/http-response");
const { servicePaymentDeposit } = require("../../../model/service-management/service-payment-deposit");
const servicesRendered = require("../../../model/service/service");



const fetchDeposit = async function fetchDeposit(req,res,next){
    try {
        const {branch_id} = req.userData;
        const serviceDeposit  = await servicePaymentDeposit.fetchDeposit(branch_id);
        if (serviceDeposit) {
     const serviceName = await servicesRendered.findOne({_id:serviceDeposit.service_name})
     const data = [
         {
             ...serviceDeposit,
            service_name: serviceName.service_name
         }
     ]
      httpResponse({status_code:200, response_message:'Deposit records', data:data, res});
        }
    } catch (error) {
        joiError(error,next)
    }
}


module.exports={
    fetchDeposit
}