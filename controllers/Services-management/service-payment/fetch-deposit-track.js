const { serviceDepositTrack } = require("../../../model/service-management/service-payment-deposit")
const joiError = require("../../../middlewares/errors/joi-error");
const joi = require("joi");
const { httpResponse } = require("../../../middlewares/http/http-response");

const val = joi.object({
    customer_name : joi.string().uppercase()
})


const fetchDepositTrack = async  function fetchDepositTrack(req,res,next){
    try {
        const body = await val.validateAsync(req.body);
        const {branch_id} = req.userData;
      const track = await   serviceDepositTrack.fetchDepositTrack(body.customer_name, branch_id);
      if (track) {
        httpResponse({status_code:200, response_message:'Deposit track record available', data:{track}, res});
      }
    } catch (error) {
        joiError(error, next);
    }
}



module.exports={
    fetchDepositTrack
}