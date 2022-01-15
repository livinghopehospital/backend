const { HttpError } = require("../../middlewares/errors/http-error");
const { httpResponse } = require("../../middlewares/http/http-response");
const { payementDeposit } = require("../../model/deposit/deposit")




const viewAllDeposits = async(req,res,next)=>{
    try {
        const allDeposit = await payementDeposit.findDeposit();
        if (allDeposit&&allDeposit.length>0) {
         httpResponse({status_code:200, response_message:'Deposit fetched', data:allDeposit, res});
        }else{
            const e = new HttpError(400, 'No customer has made deposit');
            return next(e);
        }
    } catch (error) {
        const e = new HttpError(500, error.message)
        return next(e);
    }
}

module.exports={
    viewAllDeposits
}