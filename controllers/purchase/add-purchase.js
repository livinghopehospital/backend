

const joi = require('joi');
const { HttpError } = require('../../middlewares/errors/http-error');
const joiError = require('../../middlewares/errors/joi-error');
const { httpResponse } = require('../../middlewares/http/http-response');
const { product } = require('../../model/products/products');
const { Purchase } = require('../../model/Purchases/purchase');

const fieldValidation = joi.object({
    purchase_date: joi.date().required(),
    branch:joi.string().required(),
    supplier: joi.string().required(),
    product: joi.string().required(),
    purchase_quantity: joi.number().required(),
    invoice_number: joi.string().required(),
    total_purchase_value:joi.string().required(),
    discount:joi.string() 
});

const addPurchase = async(req,res,next)=>{
    try {
        const mPurchase = await fieldValidation.validateAsync(req.body);

/****Update the product quantity and save the purchase*/
      const mProduct = await product.findProduct(mPurchase.product);
      if (mProduct) {   
          const data ={
            current_product_quantity: mPurchase.purchase_quantity+mProduct.current_product_quantity,
            previous_product_quantity: mProduct.current_product_quantity -mPurchase.purchase_quantity
          }
        const updatedProduct = await product.updateProduct(mPurchase.product,data);
         if (updatedProduct) {
             /***save the purchase */
             const newPurchase =await  Purchase.addPurchase(mPurchase);

             newPurchase.save().then((s)=>{
                 httpResponse({status_code:201, response_message:"Purchase successfully added", data:s, res});
             }).catch((e)=>{
                 const err = new HttpError(500, e.message);
                 return next(err);
             });
         }
      }

    } catch (error) {
        joiError(error, next);
    
    }
}


module.exports={
    addPurchase
}