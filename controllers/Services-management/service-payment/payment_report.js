const { HttpError } = require("../../../middlewares/errors/http-error");
const { servicePayment } = require("../../../model/service-management/service-payment");
const { servicePaymentDeposit } = require("../../../model/service-management/service-payment-deposit");
const joi = require("joi");
const joiError = require("../../../middlewares/errors/joi-error");
const { httpResponse } = require("../../../middlewares/http/http-response");
const serviceCategory = require("../../../model/service-management/service-categories");
const servicesRendered = require("../../../model/service/service");
const ValidationObject = joi.object({
  from: joi.date(),
  to: joi.date()
});

// 62756660922911504ee30155
const fetchPaymentByServiceCategories = async function fetchPaymentByServiceCategories(req,res,next){
    try {
        
        const ValidationObject = joi.object({
          from: joi.date(),
          to: joi.date(),
          categories: joi.string().required(),
        });
        const body =   await ValidationObject.validateAsync(req.query);
        const {branch_id} = req.userData;
        // console.log(body);
        const FILTEREDRESULTS =await  servicePayment.aggregate([
            { "$match": {
              "$and": [
                
                { "created_at": { "$gte": body.from, "$lte": body.to }},

              ]
            }}
          ]);
          if (FILTEREDRESULTS&&FILTEREDRESULTS.length>0) {
            // console.log(FILTEREDRESULTS, branch_id);
            const branchReport = FILTEREDRESULTS.filter(item=>item.service_categories==body.categories&&item.branch==branch_id);
            if (branchReport.length>0) {
            
           const categoryName = await serviceCategory.findOne({_id:body.categories}) 
           const data = branchReport.map((report)=>{
             const {service_categories,...others} = report;
             return {...others, service_categories : categoryName.categories_name,}
           })
           httpResponse({status_code:200, response_message:'Payment record available under this category', data:data, res}); 
            }else{
              const e = new HttpError(404, "No record found within the categories selected");
              return next(e);
            }
          
          }else{
              const e = new HttpError(404, "No record found within this range of date");
              return next(e);
          }
    } catch (error) {
      joiError(error, next); 
    }
}





const fetchAllPayment = async function fetchAllPayment(req,res,next){
    try {
        const body =   await ValidationObject.validateAsync(req.query);
        const {branch_id} = req.userData;
        const FILTEREDRESULTS =await  servicePayment.aggregate([
          { "$match": {
            "$and": [
              { "created_at": { "$gte": body.from, "$lte":body.to }},

            ]
          }}
        ]);
          if (FILTEREDRESULTS&&FILTEREDRESULTS.length>0) {
            
            const branchReport = FILTEREDRESULTS.filter(item=>item.branch==branch_id);
            const data = await Promise.all(  branchReport.map(async(report)=>{
              const service =await  servicesRendered.findOne({_id: report.service_name});
              const {service_categories,...others} = report;
                return {...others, service_name : service.service_name,}
              }))
            
            
          

          httpResponse({status_code:200, response_message:'Sales record available', data:data, res});
          }else{
              const e = new HttpError(404, "No record found within this range of date");
              return next(e);
          }
    } catch (error) {
        console.log(error);
        joiError(error, next);
    }
}




const fetchDepositByCategories = async function fetchDepositByCategories(req,res,next){
    try {
      const ValidationObject = joi.object({
        from: joi.date(),
        to: joi.date(),
        categories: joi.string(),
      });
      const body =   await ValidationObject.validateAsync(req.query);
      const {branch_id} = req.userData;
  
      const FILTEREDRESULTS =await  servicePaymentDeposit.aggregate([
          { "$match": {
            "$and": [
              { "created_at": { "$gte": body.from, "$lte": body.to }},

            ]
          }}
        ]);
        if (FILTEREDRESULTS&&FILTEREDRESULTS.length>0) {
          const branchReport = FILTEREDRESULTS.filter(item=>item.service_categories==body.categories&&item.branch==branch_id);
          if (branchReport.length>0) {
         const categoryName = await serviceCategory.findOne({_id:body.categories}) 
         const data = branchReport.map((report)=>{
           const {service_categories,...others} = report;
           return {...others, service_categories : categoryName.categories_name,}
         });
         httpResponse({status_code:200, response_message:'Deposit record available under this category', data:{branchReport:data}, res}); 
          }else{
            const e = new HttpError(404, "No record found within the categories selected");
            return next(e);
          }
        }else{
            const e = new HttpError(404, "No record found within this range of date");
            return next(e);
        }
    } catch (error) {
      joiError(error, next);
    }
}

const fetchAllDeposit= async function fetchAllDeposit(req,res,next){
    try {
      const body =   await ValidationObject.validateAsync(req.query);
      const {branch_id} = req.userData;
    
      const FILTEREDRESULTS =await  servicePaymentDeposit.aggregate([
          { "$match": {
            "$and": [
              { "created_at": { "$gte": body.from, "$lte": body.to }},

            ]
          }}
        ]);
        if (FILTEREDRESULTS&&FILTEREDRESULTS.length>0) {
          const branchReport = FILTEREDRESULTS.filter( item=>item.branch==branch_id);
          const data = await Promise.all(  branchReport.map(async(report)=>{
            const service =await  servicesRendered.findOne({_id: report.service_name});
            const {service_categories,...others} = report;
              return {...others, service_name : service.service_name,}
            }))
        httpResponse({status_code:200, response_message:'Service payment record available', data:data, res});
        }else{
            const e = new HttpError(404, "No record found within this range of date");
            return next(e);
        }
    } catch (error) {
        
      joiError(error, next);
    }
}
module.exports={
    fetchPaymentByServiceCategories,
    fetchAllPayment,
    fetchAllDeposit,
    fetchDepositByCategories
}


