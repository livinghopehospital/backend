const { HttpError } = require("../../middlewares/errors/http-error");
const { httpResponse } = require("../../middlewares/http/http-response");
const { product } = require("../../model/products/products");
const joi = require('joi');
const joiError = require("../../middlewares/errors/joi-error");

const fieldValidation = joi.object({
  productId: joi.string().required()
});

const updateProducts =async(req,res,next)=>{
    /***
     * Update price, quantity
     * 
     * 
     */
    try {
      const {price,quantity} = req.body;
     
        if (typeof quantity!="number") {
          
        }
      const pValidation = await fieldValidation.validateAsync(req.params);
      const mproduct = await product.findProduct(pValidation.productId);
      if (mproduct) {
        const data ={
          product_price:price,
          current_product_quantity: quantity,
          previous_product_quantity: mproduct.current_product_quantity 
        }  

        const updatedProduct = await product.updateProduct(pValidation.productId, data);
        if (updatedProduct) {
            httpResponse({status_code:200, response_message:'Product successfully updated',data:updatedProduct,res});
        }else{
            const err = new HttpError(500, 'Unable to update products. Please contact support if persists');
            return next(err);
        }
      }else{
        const err = new HttpError(400, 'No products is associated to this productId');
        return next(err);
      }    
    } catch (error) {
        joiError(error,next);
    }
}


module.exports={
    updateProducts
}