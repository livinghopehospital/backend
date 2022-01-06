

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



productSchema.statics.createProduct = function createProduct(product){
    return new product(product)
}

productSchema.statics.findProducts = async function findProducts(){

    const product = await product.find({});
    return product;
}

productSchema.statics.findProduct = async function findProduct(productId){
    const product = await product.findOne({_id:productId});
    return product;
}

productSchema.statics.findProductByBarcode = async function findProductByBarcode(product_barcode){
    const product = await product.findOne({product_barcode});
    return product;
}

productSchema.statics.deleteProduct = async function(productId){
    const product = await product.findOneAndDelete({_id:productId});
    return product;
}
productSchema.statics.updateProduct = async function updateProduct(productId, data){
    const product = await product.findOneAndUpdate({_id:productId},data);
    return product;
}

productSchema.statics.manageProductSales = async function manageProductSales(product_barcode, data){
    const product = await product.findOneAndUpdate({product_barcode},data);
    return product;
}

const product = mongoose.model('product', productSchema);


module.exports={
    productFieldValidation,
    product
}