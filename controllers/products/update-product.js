const { HttpError } = require("../../middlewares/errors/http-error");
const { httpResponse } = require("../../middlewares/http/http-response");
const { product } = require("../../model/products/products");



const updateProducts =async(req,res,next)=>{
    /***
     * Update price, quantity
     * 
     * 
     */
    try {
      const {price,quantity} = req.body;
      const {productId} = req.params;
      const mproduct = await product.findProduct(productId);
      if (mproduct) {
        const data ={
          product_price:price,
          current_product_quantity: quantity,
          previous_product_quantity: mproduct.current_product_quantity -quantity
        }  

        const updatedProduct = await product.updateProduct(productId,data);
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
        const err = new HttpError(500, error.message);
        return next(err);
    }
}


module.exports={
    updateProducts
}