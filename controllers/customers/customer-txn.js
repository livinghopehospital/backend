const { HttpError } = require("../../middlewares/errors/http-error");
const joiError = require("../../middlewares/errors/joi-error");
const { httpResponse } = require("../../middlewares/http/http-response");
const { customerRecord } = require("../../model/customer/customer-txn-list");
const { Deposit } = require("../../model/Deposit/mydeposit");
const { Sales } = require("../../model/sales/sales");






const viewTransactionHistory = async function viewCustomerTransactionHistory(req,res,next){

    try {
        const {customerId} = req.params
        if (!customerId) {
            const e = new HttpError(400, 'Please provide customerId');
            return next(e);
        }
        const history =await customerRecord.viewCustomerHistory(customerId);
        httpResponse({status_code:200, response_message:'Transaction history available',data:{history}, res});
    } catch (error) {
        console.log(error);
        const e = new HttpError(500, 'Internal system error. Contact support');
            return next(e);
    }
}


const viewCustomerDeposit = async function viewCustomerDeposit(req,res,next){
    try {
     const {customerId} = req.params;
     const {branch_id} = req.userData;
     const customerDeposit = await Deposit.findIndividualCustomerDeposit(customerId, branch_id);
     if (customerDeposit.length>0) {
        httpResponse({status_code:200, response_message:'Deposits available',data:{customerDeposit},res});
     }else{
         const e = new HttpError(404, 'This customer has not made any deposits. Or all deposits has been clear check sales');
         return next(e);
     }
    } catch (error) {
        joiError(error,next);
    }

}

const viewCustomerPurchased = async function viewCustomerSales(req,res,next){
    try {
        const {customerId} = req.params;
        const {branch_id} = req.userData
        const customerPurchased = await Sales.findIndividualCustomerSales(customerId,branch_id);
        if (customerPurchased.length>0){
          httpResponse({status_code:200, response_message:'Sales available', data:{customerPurchased},res});
        }else{
           const e = new HttpError(404, 'Customers has not made any purchase here');
           return next(e); 
        }
    } catch (error) {
        joiError(error,next);
    }
}


module.exports={
    viewTransactionHistory,
    viewCustomerPurchased,
    viewCustomerDeposit
    
}