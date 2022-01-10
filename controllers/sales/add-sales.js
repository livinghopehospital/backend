


/***When adding sales, the product level should be decreasing */

const { HttpError } = require("../../middlewares/errors/http-error");
const joiError = require("../../middlewares/errors/joi-error");
const { httpResponse } = require("../../middlewares/http/http-response");
const { product } = require("../../model/products/products");
const { salesFieldValidation, Sales, salesSchema } = require("../../model/sales/sales")

const addSales = async(req,res,next)=>{
    try {
        const {branch_id} = req.userData;
        function preSave(){
        
            salesSchema.pre("save",async function(done){
                this.set("branch", branch_id);
                done()
               });  
        }
       const mSales = await salesFieldValidation.validateAsync(req.body); 
       const addNewSales = Sales.createSales(mSales);
       /****check if the purchased qty is not greater than the current qty */
       /***find product, deduct the qty from the current qty */
       const mproduct = await product.findProductByBarcode(mSales.product_barcode);
       if (!mproduct) {
        const err= new HttpError(400, `No product is assigned to the provided barcode`);
        return next(err); 
       }

       if (mSales.purchased_qty > mproduct.current_shipping_quauntity) {
        const err= new HttpError(500, `The purchased quantity is greater than number of product in stock. You have ${mproduct.current_shipping_quauntity} left in stock`);
        return next(err);
       }

        if (mproduct) {
            const data = {
                current_shipping_quauntity: mproduct.current_shipping_quauntity - mSales.purchased_qty,
                previous_shipping_quantity: mproduct.current_shipping_quauntity
            }  
            const updateProduct = product.manageProductSales(mSales.product_barcode,data);
       if (updateProduct) {
        addNewSales.save().then((s)=>{
            httpResponse({status_code:200, response_message:'Sales successfully added',data:s,res});
           }).catch((e)=>{
            const err= new HttpError(500, e.message);
            return next(err);
           });
          preSave();
        }else{
            const err= new HttpError(400, `No product is associated with the provided barcode`);
            return next(err); 
        }
        //add branch to the sales
       }else{
        const err= new HttpError(500, 'Unable to add sales due to internal error, contact support');
        return next(err);
       }
     
    } catch (error) {
      joiError(error,next);  
    }
}

module.exports={
    addSales
}