const { HttpError } = require("../../middlewares/errors/http-error");
const joiError = require("../../middlewares/errors/joi-error");
const { httpResponse } = require("../../middlewares/http/http-response");
const { Deposit, depositFieldValidation } = require("../../model//Deposit/mydeposit");
const { product } = require("../../model/products/products");



async function findProduct(barcode,id,branch_id){
    const mproduct = await product.findProductByBarcode(barcode,id,branch_id);
    if (mproduct) {
     return mproduct;
    }else{
     const prodcutById = await product.findOne({_id: id, branch:branch_id},)
     return prodcutById;
    }
   }

   async function updateProduct(barcode,id, branch_id,data){
    const mproduct = await product.findOneAndUpdate({_id:id,branch:branch_id},data);
    if (mproduct) {
     return mproduct;
    }else{
     const prodcutById = await product.findOneAndUpdate({product_barcode: barcode, branch:branch_id},data);
     return prodcutById;
    }
   }

const addDeposit = async(req,res,next)=>{
    try {  
       const mDeposit = await depositFieldValidation.validateAsync(req.body); 
       const {branch_id} = req.userData;
       for (let index = 0; index < mDeposit.items.length; index++) {
        const mproduct =await findProduct(mDeposit.items[index].barcode, mDeposit.items[index].product_id,branch_id);
        if (mDeposit.items[index].quantity <= mproduct.current_product_quantity) {
            const datas = {
                current_product_quantity: mproduct.current_product_quantity -Number(mDeposit.items[index].quantity),
                previous_product_quantity: mproduct.current_product_quantity
            }  
            const updatedProduct =await updateProduct(mDeposit.items[index].barcode,mDeposit.items[index].product_id,branch_id,datas)
            const depositData ={
                created_at:`${mDeposit.items[index].created_at}Z`,
                invoice_number:mDeposit.items[index].invoice_number ,
                amount_deposited: mDeposit.items[index].amount_deposited,
                customer_name: mDeposit.customer_name,
                branch: mDeposit.branch,
                total_amount:  mDeposit.items[index].amount,
                payment_type: mDeposit.payment_type,
                barcode: mDeposit.items[index].barcode,
                product: mDeposit.items[index].product,
                amount_to_balance:Number(mDeposit.items[index].amount) - Number(mDeposit.items[index].amount_deposited) ,
                selectedProduct: mDeposit.items[index].selectedProduct,
                serial_number: mDeposit.items[index].serial_number,
                product_id:mDeposit.items[index].product_id,
                cost_price: mproduct.product_price,
                quantity: mDeposit.items[index].quantity,
                selling_price: mDeposit.items[index].selling_price
              }
            const addDeposit = Deposit.createDeposit(depositData);
            addDeposit.save().then((d)=>{
            httpResponse({status_code:201, response_message:"Deposit successfully added",data:{},res});
            }).catch((err)=>{
                console.log(err);
                const e = new HttpError(500, err.message);
                return next(e);
            })
        }
       }
    } catch (error) {
      joiError(error,next);  
    }
}


module.exports={
    addDeposit
}

