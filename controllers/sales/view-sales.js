const { HttpError } = require("../../middlewares/errors/http-error");
const { httpResponse } = require("../../middlewares/http/http-response");
const { Sales } = require("../../model/sales/sales");


const viewSales =async(req,res,next)=>{
    try {
      const mSales = await Sales.findSales();
      if (mSales&&mSales.length>0) {
        httpResponse({status_code:200,response_message:'Sales successfully fetched', data:mSales,res})  
      }  
      const e = new HttpError(404, "You have not made any sales");
      return(e);
    } catch (error) {
        const e = new HttpError(500,error.message);
        return next(e);
    }
}




module.exports={
    viewSales
}