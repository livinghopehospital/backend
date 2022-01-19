"use strict"
const { HttpError } = require("../../middlewares/errors/http-error");
const joiError = require("../../middlewares/errors/joi-error");
const { httpResponse } = require("../../middlewares/http/http-response");
const { Deposit,depositFieldValidation } = require("../../model/Deposit/deposit");
const { product } = require("../../model/products/products");


const addDeposit = async(req,res,next)=>{
    /***Saving of document to database should be improved.... currently files are been saved irrespective of error */
   //sacredness
    try {  
       const mDeposit = await depositFieldValidation.validateAsync(req.body); 
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
               product.manageProductSales(item.barcode,data);
        
           }else{
           var errorDetected="error"
            const err= new HttpError(500, 'Unable to add Deposit due to internal error, contact support');
            return next(err);
           }
       });
       const ADDNEWDEPOSIT = Deposit.createDeposit(mDeposit);
          ADDNEWDEPOSIT.save().then((s)=>{
         httpResponse({status_code:201, response_message:'Deposit successfully created', res}) 
        }).catch((err)=>{
            const  ERROR =  new HttpError(500, err.message);
            return  next(ERROR);
        })
      
      
       
 
    } catch (error) {
      joiError(error,next);  
    }
}

module.exports={
    addDeposit
}