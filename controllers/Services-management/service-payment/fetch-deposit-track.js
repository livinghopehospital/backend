const { serviceDepositTrack } = require("../../../model/service-management/service-payment-deposit")
const joiError = require("../../../middlewares/errors/joi-error");
const joi = require("joi");
const { httpResponse } = require("../../../middlewares/http/http-response");
const { HttpError } = require("../../../middlewares/errors/http-error");
const servicesRendered = require("../../../model/service/service");

const val = joi.object({
    customer_name : joi.string().uppercase().trim()
})


const fetchDepositTrack = async  function fetchDepositTrack(req,res,next){

    try {
        const body = await val.validateAsync(req.query);
        console.log(body);
        const {branch_id} = req.userData;
      const track = await   serviceDepositTrack.fetchDepositTrack(body.customer_name, branch_id);

      if (track&&track.length>0) {
        const data = await Promise.all( track.map(async(report)=>{
            const service =await  servicesRendered.findOne({_id: report.service_name});
            const {service_categories,...others} = report;
              return {...others, service_name : service.service_name,}
            }));
        httpResponse({status_code:200, response_message:'Deposit track record available', data:track, res});
      }else{
          return next(new HttpError(404, 'Customer currently have not made any deposits'));
      }
    } catch (error) {
        joiError(error, next);
    }
}



module.exports={
    fetchDepositTrack
}