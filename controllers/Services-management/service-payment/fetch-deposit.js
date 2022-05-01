
const joiError = require("../../../middlewares/errors/joi-error");
const { httpResponse } = require("../../../middlewares/http/http-response");
const { servicePaymentDeposit } = require("../../../model/service-management/service-payment-deposit");



const fetchDeposit = async function fetchDeposit(req,res,next){
    try {
        const {branch_id} = req.userData;
        const serviceDeposit  = await servicePaymentDeposit.fetchDeposit(branch_id);
        if (serviceDeposit) {
      httpResponse({status_code:200, response_message:'Deposit records', data:{serviceDeposit}, res});
        }
    } catch (error) {
        joiError(error,next)
    }
}


module.exports={
    fetchDeposit
}