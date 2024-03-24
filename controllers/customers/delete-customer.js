
const { Customer } = require('../../model/customer/customer');
const { HttpError } = require("../../middlewares/errors/http-error");
const { httpResponse } = require('../../middlewares/http/http-response');
const { healtRecordModel } = require('../../model/customer/customer-txn-list');



const deleteCustomers = async function deleteCustomer(req,res,next){
        try {
            const {customerId} = req.params;
            const deletedClient = await Customer.deleteCustomer(customerId);
            if (deletedClient) {
               httpResponse({status_code:200, response_message:'Customer has been successfully deleted',data:{deletedClient},res});
               await healtRecordModel.deleteAllHealthRecord(customerId);
            }else{
                const e = new HttpError(400, 'Something unexpected occur');
                return next(e);
            }
        } catch (error) {
            console.log(error);
            const e = new HttpError(400, 'Something unexpected occur');
            return next(e);
            
        }
}


module.exports={
    deleteCustomers
}