

const mongoose = require('mongoose');

const joi = require('joi');


const productFieldValidation = joi.object({
  product_name: joi.string().required(),
  product_price: joi.number().required(),
  product_barcode: joi.string().required(),
  product_brand: joi.string().required(),
  supplier: joi.string().required(),
});

const productSchema = new mongoose.Schema({
  product_name: {type: String, required:true},
  product_price: {type:Number, required:true},
  product_barcode:{type:String, required:true},
  current_product_quantity:{type:Number, default:0},
  previous_product_quantity: {type: Number, default:0},
  branch: {type: mongoose.Types.ObjectId, ref:'Branch'}, 
  product_brand: {type: mongoose.Types.ObjectId, ref:'brand'},
  supplier: {type:mongoose.Types.ObjectId, ref:'supplier'}
});



productSchema.statics.createProduct = function createProduct(mproduct){
    return new product(mproduct)
}

productSchema.statics.findProducts = async function findProducts(){

    const mproduct = await product.find({});
    return mproduct;
}

productSchema.statics.findProduct = async function findProduct(productId){
    const mproduct = await product.findOne({_id:productId});
    return mproduct;
}

productSchema.statics.findProductByBarcode = async function findProductByBarcode(product_barcode){
    const mproduct = await product.findOne({product_barcode});
    return mproduct;
}

productSchema.statics.deleteProduct = async function(productId){
    const mproduct = await product.findOneAndDelete({_id:productId});
    return mproduct;
}
productSchema.statics.updateProduct = async function updateProduct(productId, data){
    const mproduct = await product.findOneAndUpdate({_id:productId},data);
    return mproduct;
}

productSchema.statics.manageProductSales = async function manageProductSales(product_barcode, data){
    const mproduct = await product.findOneAndUpdate({product_barcode},data);
    return mproduct;
}

const product = mongoose.model('product', productSchema);


module.exports={
    productFieldValidation,
    product
}