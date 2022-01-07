const { HttpError } = require("../../middlewares/errors/http-error");
const { httpResponse } = require("../../middlewares/http/http-response");
const { product } = require("../../model/products/products")



const fetchProductPrice = async(req,res,next)=>{
    try {
        const mProduct = await product.findProducts();
        if (mProduct) {
         httpResponse({status_code:200, response_message:'Product available', data:{mProduct},res});   
        }
    } catch (error) {
        const e = new HttpError(500, error.message);
        return next(e);       
    }
}

module.exports={
    fetchProductPrice
}