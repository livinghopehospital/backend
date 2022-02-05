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
        if (mDeposit.items[index].quantity < mproduct.current_product_quantity) {
            const datas = {
                current_product_quantity: mproduct.current_product_quantity -Number(mDeposit.items[index].quantity),
                previous_product_quantity: mproduct.current_product_quantity
            }  
            const updatedProduct =await updateProduct(mDeposit.items[index].barcode,mDeposit.items[index].product_id,branch_id,datas)
            const depositData ={
                created_at:mDeposit.items[index].created_at,
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





// mDeposit.items.forEach(async(item)=>{
//     const mproduct = await findProduct(item.barcode, item.id);
//     if (!mproduct) {
//         const err= new HttpError(400, `No product is assigned to the provided barcode`);
//         return next(err); 
//        }
//        if (item.quantity > mproduct.current_product_quantity) {
//         const err= new HttpError(400, `The purchased quantity is greater than number of product in stock. You have ${mproduct.current_product_quantity} left in stock`);
//         return next(err);
//        }
//         if (mproduct) {
//             const data = {
//                 current_product_quantity: mproduct.current_product_quantity -Number(item.quantity),
//                 previous_product_quantity: mproduct.current_product_quantity
//             }  
//            product.manageProductSales(item.barcode,data,branch_id);
    
//        }else{
//         const err= new HttpError(500, 'Unable to add Deposit due to internal error, contact support');
//         return next(err);
//        }
//    });
//    const ADDNEWDEPOSIT = Deposit.createDeposit(mDeposit);
//       ADDNEWDEPOSIT.save().then((s)=>{
//      httpResponse({status_code:201, response_message:'Deposit successfully created', res}) 
//     }).catch((err)=>{
//         const  ERROR =  new HttpError(500, err.message);
//         return  next(ERROR);
//     })