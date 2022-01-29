const { HttpError } = require("../../middlewares/errors/http-error");
const { httpResponse } = require("../../middlewares/http/http-response");
const { Sales } = require("../../model/sales/sales")




const deleteSale = async function deleteSale(req,res,next){
    try {
        const {id}= req.params;
        if (!id) {
            const e = new HttpError(400, "please supply id");
            return next(e);
        }
        const mSales = await Sales.deleteSales(id);
        if (mSales) {
            httpResponse({status_code:200, response_message:"sales successfully deleted", data:mSales, res});
        }else{
            const e = new HttpError(500, "Unable to delete sales. Contact support if persists");
            return next(e);
        }

    } catch (error) {
        const e = new HttpError(500,error.message);
        return next(e);
    }
}


module.exports={
    deleteSale
}