
const { HttpError } = require("../../middlewares/errors/http-error");
const joiError = require("../../middlewares/errors/joi-error");
const { httpResponse } = require("../../middlewares/http/http-response");
const { Deposit,depositFieldValidation } = require("../../model/Deposit/deposit");
const { product } = require("../../model/products/products");


const addDeposit = async(req,res,next)=>{
    try {  
       const mDeposit = await depositFieldValidation.validateAsync(req.body); 
       const addNewDeposit = Deposit.createDeposit(mDeposit);
       mDeposit.items.forEach(async(item)=>{
        const mproduct = await product.findProductByBarcode(item.barcode);
        if (!mproduct) {
            const err= new HttpError(400, `No product is assigned to the provided barcode`);
            return next(err); 
           }
           if (item.quantity > mproduct.current_product_quantity) {
            const err= new HttpError(400, `The purchased quantity is greater than number of product in stock. You have ${mproduct.current_product_quantity} left in stock`);
            return next(err);
           }
    
            if (mproduct) {
                const data = {
                    current_product_quantity: mproduct.current_product_quantity -Number(item.quantity),
                    previous_product_quantity: mproduct.current_product_quantity
                }  
                const updateProduct = product.manageProductDeposit(mDeposit.product_barcode,data);
           }else{
            const err= new HttpError(500, 'Unable to add Deposit due to internal error, contact support');
            return next(err);
           }
       });
       
       addNewDeposit.save().then((s)=>{
        httpResponse({status_code:200, response_message:'Deposit successfully added',data:s,res});
       }).catch((e)=>{
        const err= new HttpError(500, e.message);
        return next(err);
       });
    } catch (error) {
      joiError(error,next);  
    }
}

module.exports={
    addDeposit
}