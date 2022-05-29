const { serviceDepositTrack } = require("../../../model/service-management/service-payment-deposit")
const joiError = require("../../../middlewares/errors/joi-error");
const joi = require("joi");
const { httpResponse } = require("../../../middlewares/http/http-response");
const { HttpError } = require("../../../middlewares/errors/http-error");
const servicesRendered = require("../../../model/service/service");
const serviceCategory = require("../../../model/service-management/service-categories");


const fetchDepositTrack = async  function fetchDepositTrack(req,res,next){
    const val = joi.object({
        customer_name : joi.string().uppercase().trim()
    })
    
    try {
        const body = await val.validateAsync(req.query);
        if (!body.customer_name) {
           return next(new HttpError(400, "Please supply customer_name in your query")) 
        }
        const {branch_id} = req.userData;
      const track = await  serviceDepositTrack.fetchDepositTrack(body.customer_name, branch_id);

      if (track&&track.length>0) {
        const depositTrack = track.filter( item=>item.branch==branch_id);
        const data = await Promise.all(  depositTrack.map(async(report)=>{
            const service =await  servicesRendered.findOne({_id: report.service_name});
            const category =await  serviceCategory.findOne({_id: report.service_categories});
            const {service_name,service_categories,...others} = report._doc;
              return { service_categories: category.categories_name,service_name : service.service_name,...others}
            }));
        httpResponse({status_code:200, response_message:'Deposit track record available', data:data, res});
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