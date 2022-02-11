


/***When adding sales, the product level should be decreasing */
const { HttpError } = require("../../middlewares/errors/http-error");
const joiError = require("../../middlewares/errors/joi-error");
const { httpResponse } = require("../../middlewares/http/http-response");
const { product } = require("../../model/products/products");
const { salesFieldValidation, Sales, } = require("../../model/sales/sales");

async function findProduct(barcode,id, branch_id){
    const mproduct = await product.findProductByBarcode(barcode,branch_id);
    if (mproduct) {
     return mproduct;
    }else{
     const prodcutById = await product.findOne({_id: id, branch:branch_id})
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

const addSales = async(req,res,next)=>{
    try {  
        const {branch_id} = req.userData;
       const mSales = await salesFieldValidation.validateAsync(req.body); 
       const doesSalesExist =await Sales.findSingleSales(mSales.invoice_number,branch_id);
       if (doesSalesExist) {
         const e = new HttpError(400, "A sales already existed with this invoice number");
         return next(e);  
       }   
       for (let index = 0; index < mSales.items.length; index++) {
         const mproduct =await findProduct(mSales.items[index].barcode, mSales.items[index].product_id,branch_id);
                if (mproduct) {
                    const datas = {
                        current_product_quantity: mproduct.current_product_quantity -Number(mSales.items[index].quantity),
                        previous_product_quantity: mproduct.current_product_quantity
                    }  
                    if (mSales.items[index].quantity <= mproduct.current_product_quantity) {
                        const updatedProduct =await updateProduct(mSales.items[index].barcode,mSales.items[index].product_id,branch_id,datas)
                        const data = {
                            invoice_number:mSales.items[index].invoice_number,
                            created_at: `${mSales.items[index].created_at}Z`,
                            payment_type:mSales.payment_type,
                            branch: mSales.branch, //add at backend
                            product_id: mSales.items[index].product_id,
                            cost_price: mproduct.product_price,
                            product_name: mproduct.product_name,
                            quantity: mSales.items[index].quantity,
                            barcode: mSales.items[index].barcode,
                            selling_price: mSales.items[index].selling_price,
                            selectedProduct:mSales.items[index].selectedProduct,
                            product: mSales.items[index].product,
                            amount: mSales.items[index].amount,
                            serial_number: mSales.items[index].serial_number
                        }
                        const addNewSales = Sales.createSales(data);
                        addNewSales.save().then((savedProduct)=>{
                         httpResponse({status_code:200, response_message:'Sales successfully added',data:savedProduct,res});
                        })
                       }else{
                        const e = new HttpError(400, "Out of stock");
                        return next(e);  
                       }
                }else{
                    const e = new HttpError(400, "No product found");
                    return next(e);
                }
       }  
    } catch (error) {
      joiError(error,next);  
    }
}

module.exports={
    addSales
}


// product_id: filterSale[i]._id,
// barcode: filterSale[i].items[index].barcode,
// product: filterSale[i].items[index].product,
// selectedProduct: filterSale[i].items[index].selectedProduct,
// serial_number: filterSale[i].items[index].serial_number,
// invoice_number: filterSale[i].items[index].invoice_number,
// cost_price: filterSale[i].items[index].cost_price,
// selling_price: filterSale[i].items[index].selling_price,
// amount: filterSale[i].items[index].amount,
// quantity: filterSale[i].items[index].quantity

// if (!errorDetected) {
//     addNewSales.save().then((s)=>{
       
//        }).catch((e)=>{
//         const err= new HttpError(500, e.message);
//         return next(err);
//        });  
//  }

// mSales.items.forEach(async(item)=>{
        
//     if (!mproduct) {
//         const err= new HttpError(400, `No product is assigned to the provided barcode`);
//         return next(err); 
//        }
//        if (item.quantity > mproduct.current_product_quantity) {
//         const err= new HttpError(400, `The purchased quantity is greater than number of product in stock. You have ${mproduct.current_product_quantity} left in stock`);
//         return next(err);
//        }

//         if (mproduct) {
            // const data = {
            //     current_product_quantity: mproduct.current_product_quantity -Number(item.quantity),
            //     previous_product_quantity: mproduct.current_product_quantity
            // }  
            
//              if (!errorDetected) {
//                 const updateProduct =await product.manageProductSales(item.barcode,data, branch_id); 
//              }
//        }else{
//         errorDetected = "error";
//         const err= new HttpError(500, 'Unable to add sales due to internal error, contact support');
//         return next(err);
//        }
//    });