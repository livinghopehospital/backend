const { HttpError } = require("../../middlewares/errors/http-error");
const { httpResponse } = require("../../middlewares/http/http-response");
const { Supplier } = require("../../model/supplier/supplier")



const viewAllSuppliers = async(req,res,next)=>{
 
      try {
          const supplier = await Supplier.findsupplier();
          if (supplier) {
              httpResponse({status_code:200, response_message:'Supplier found', data:supplier,res});
          }
      } catch (error) {
          const e = new HttpError(500, e.message);
          return next(e);
      }

}

module.exports={
    viewAllSuppliers
}