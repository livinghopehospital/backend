

const joi = require("joi");
const { HttpError } = require("../../middlewares/errors/http-error");
const joiError = require("../../middlewares/errors/joi-error");
const { httpResponse } = require("../../middlewares/http/http-response");

const {Sales} = require("../../model/sales/sales");

const VALIADATIONOBJECT = joi.object({
    from: joi.date().required(),
     to: joi.date().required()
})

const viewSalesReport =async(req,res,next)=>{
    try {
      const VALIDATEDOBJECT = await VALIADATIONOBJECT.validateAsync(req.query)
      const FILTEREDRESULTS =await  Sales.aggregate([
            { "$match": {
              "$and": [
                { "created_at": { "$lte": VALIDATEDOBJECT.to, "$gte": VALIDATEDOBJECT.from }},
                { "created_at": { "$not": { "$lt":VALIDATEDOBJECT.from, "$gt":VALIDATEDOBJECT.to }}}
              ]
            }}
          ]);
          if (FILTEREDRESULTS&&FILTEREDRESULTS.length>0) {
            const items = []
            FILTEREDRESULTS.map((result)=>{
                items.push(...result.items)
            });
          httpResponse({status_code:200, response_message:'Sales record available', data:items, res});
          }else{
              const e = new HttpError(404, "No record found within this range of date");
              return next(e);
          }
    } catch (error) {
       joiError(error,next);
    }
}


module.exports={
    viewSalesReport
}