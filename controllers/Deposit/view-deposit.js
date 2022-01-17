const { HttpError } = require("../../middlewares/errors/http-error");
const { httpResponse } = require("../../middlewares/http/http-response");
const { Deposit } = require("../../model/Deposit/deposit");




const viewDeposit =async(req,res,next)=>{
    try {
      const mDeposit = await Deposit.findDeposit();
      if (mDeposit&&mDeposit.length>0) {
        httpResponse({status_code:200,response_message:'Deposit successfully fetched', data:mDeposit,res})  
      }  
      const e = new HttpError(404, "You have not made any Deposit");
      return(e);
    } catch (error) {
        const e = new HttpError(500,error.message);
        return next(e);
    }
}




module.exports={
    viewDeposit
}
