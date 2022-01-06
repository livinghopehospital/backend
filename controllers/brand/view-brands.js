const { HttpError } = require("../../middlewares/errors/http-error");
const { httpResponse } = require("../../middlewares/http/http-response");
const { Brand } = require("../../model/brand/brand")



const viewAllBrands = async(req,res,next)=>{
    try {
        const mBrand = await Brand.findBrand();
        httpResponse({status_code:200, response_message:'Product successfully fetched',data:mBrand,res});
    } catch (error) {
        const e = new HttpError(500, error.message);
        return next(e);
    }
}

module.exports={
    viewAllBrands
}