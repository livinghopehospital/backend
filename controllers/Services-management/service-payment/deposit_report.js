const { HttpError } = require("../../../middlewares/errors/http-error");
const { servicePayment } = require("../../../model/service-management/service-payment");
const { servicePaymentDeposit } = require("../../../model/service-management/service-payment-deposit");
const joi = require("joi");
const joiError = require("../../../middlewares/errors/joi-error");
const { httpResponse } = require("../../../middlewares/http/http-response");
const ValidationObject = joi.object({
  from: joi.date(),
  to: joi.date()
});
const fetchPaymentByServiceCategories = async function fetchPaymentByServiceCategories(req,res,next){
    try {
        const {categories,from, to} = req.query;
        const {branch_id} = req.userData;
        if (!from||!to) {
         const e  = new HttpError(400, "from and to are required paramaters");
           return next(e);
        }
        const FILTEREDRESULTS =await  servicePaymentDeposit.aggregate([
            { "$match": {
              "$and": [
                { "created_at": { "$gte": from, "$lte": to }},

              ]
            }}
          ]);
          if (FILTEREDRESULTS&&FILTEREDRESULTS.length>0) {
            const branchReport = FILTEREDRESULTS.filter(item=>item.categories==categories&&item.bracn==branch_id);
          httpResponse({status_code:200, response_message:'Sales record available', data:branchReport, res});
          }else{
              const e = new HttpError(404, "No record found within this range of date");
              return next(e);
          }
    } catch (error) {
        console.log(error);
        const e = new HttpError(500, "An error occured when making the request");
        return next(e);  
    }
}





const fetchAllPayment = async function fetchAllPayment(req,res,next){
    try {
        const body =   await ValidationObject.validateAsync(req.query);
        const {branch_id} = req.userData;
        const FILTEREDRESULTS =await  servicePaymentDeposit.aggregate([
          { "$match": {
            "$and": [
              { "created_at": { "$gte": body.from, "$lte":body.to }},

            ]
          }}
        ]);
          if (FILTEREDRESULTS&&FILTEREDRESULTS.length>0) {
            console.log(FILTEREDRESULTS);
            const branchReport = FILTEREDRESULTS.filter(item=>item.branch==branch_id);
          httpResponse({status_code:200, response_message:'Sales record available', data:branchReport, res});
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
      const {categories,from, to} = req.query;
      const {branch_id} = req.userData;
      if (!from||!to) {
       const e  = new HttpError(400, "from and to are required paramaters");
         return next(e);
      }
      const FILTEREDRESULTS =await  servicePaymentDeposit.aggregate([
          { "$match": {
            "$and": [
              { "created_at": { "$gte": from, "$lte": to }},

            ]
          }}
        ]);
        if (FILTEREDRESULTS&&FILTEREDRESULTS.length>0) {
          const branchReport = FILTEREDRESULTS.filter(item=>item.categories==categories&&item.bracn==branch_id);
        httpResponse({status_code:200, response_message:'Sales record available', data:branchReport, res});
        }else{
            const e = new HttpError(404, "No record found within this range of date");
            return next(e);
        }
    } catch (error) {
        
    }
}

const fetchAllDeposit= async function fetchAllDeposit(req,res,next){
    try {
      const {from, to} = req.query;
      const {branch_id} = req.userData;
      if (!from||!to) {
       const e  = new HttpError(400, "from and to are required paramaters");
         return next(e);
      }
      const FILTEREDRESULTS =await  servicePaymentDeposit.aggregate([
          { "$match": {
            "$and": [
              { "created_at": { "$gte": from, "$lte": to }},

            ]
          }}
        ]);
        if (FILTEREDRESULTS&&FILTEREDRESULTS.length>0) {
          const branchReport = FILTEREDRESULTS.filter(item=>item.branch==branch_id);
        httpResponse({status_code:200, response_message:'Sales record available', data:branchReport, res});
        }else{
            const e = new HttpError(404, "No record found within this range of date");
            return next(e);
        }
    } catch (error) {
        
    }
}
module.exports={
    fetchPaymentByServiceCategories,
    fetchAllPayment,
    fetchAllDeposit,
    fetchDepositByCategories
}


