const { HttpError } = require("../../middlewares/errors/http-error");
const { httpResponse } = require("../../middlewares/http/http-response");
const { Deposit } = require("../../model/PaymentType/deposit")





const addpaymentType =async(req,res,next)=>{
    try {
        const {payment_type} =req.body;
        if (!payment_type) {
            const e = HttpError(400,'Please provide a deposit type');
            return next(e);
        }
        const d =  Deposit.addDeposit(payment_type);
        d.save().then((s)=>{
         httpResponse({status_code:201, response_message:'Deposit created',data:s,res});
        }).catch((err)=>{
            const e = new HttpError(500, err.message);
            return next(e);
        });
    } catch (error) {
        const e = new HttpError(500, error.message);
        return next(e); 
    }
}

module.exports ={
    addpaymentType
}