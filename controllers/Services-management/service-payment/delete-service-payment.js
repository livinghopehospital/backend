const { HttpError } = require("../../../middlewares/errors/http-error");
const { httpResponse } = require("../../../middlewares/http/http-response");
const { servicePayment } = require("../../../model/service-management/service-payment");



const deleteServicePayment = async (req,res, next)=>{
    try {
        const {id} = req.params;
        if (!id) {
         return next(new HttpError(400, 'Please provide Id to be deleted'));  
        }
        const deletedService = await servicePayment.findOneAndDelete({_id:id});
        if (deletedService) {
           httpResponse({status_code:200, response_message:'Service rendered successfully deleted', data:{}, res});
        }else{
         return next(new HttpError(400, 'Something went wrong, unable to delete this service'));  
        }
    } catch (error) {
        return next(new HttpError(500, 'Internal server error'));  
    }
}

module.exports={
 deleteServicePayment
}