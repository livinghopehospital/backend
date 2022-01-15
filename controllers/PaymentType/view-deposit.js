const { HttpError } = require("../../middlewares/errors/http-error");
const { httpResponse } = require("../../middlewares/http/http-response");
const { Deposit } = require("../../model/PaymentType/deposit")





const viewPaymentType =async(req,res,next)=>{
    try {

        const d =await Deposit.listDeposits();
        httpResponse({status_code:201, response_message:'Deposit created',data:d,res});
    } catch (error) {
        const e = new HttpError(500, error.message);
        return next(e); 
    }
}

module.exports ={
    viewPaymentType
}