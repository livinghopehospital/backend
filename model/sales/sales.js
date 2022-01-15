const mongoose = require('mongoose');

const joi = require('joi');


const salesFieldValidation = joi.object({
  product_barcode: joi.string().required(),
  invoice_number: joi.string().required(),
  price: joi.number().required(),
  branch: joi.string().required(),
  product: joi.string().required(),
  quantity: joi.number().required(),
  total_amount: joi.number().required(),
  amount: joi.number().required(),
  payment_type: joi.string().required(),
  created_at: joi.date().required()
});

const salesSchema = new mongoose.Schema({
  invoice_number:{type:String, required:true},
  item: [
    {
    product_barcode: {type:String, required:true},
    product: {type: mongoose.Types.ObjectId, ref:'product'},
    quantity: {type: Number, required:true},
    price: {type:Number, required:true},
    amount: {type:Number},
  }
],
total_amount : {type:Number, required:true},
 payment_type:{type:String},
  branch: {type:mongoose.Types.ObjectId, ref:'Branch',required:true}, //add at backend
  created_at:{type:Date}  
});



salesSchema.statics.createSales = function createSales(sales){
    return new Sales(sales)
}


salesSchema.statics.findsales = async function findsales(){
    const sales = await Sales.find({});
    return sales;
}

salesSchema.statics.findSingleSales = async function findSingleSales(invoice_number){
  const sales = await Sales.findOne({invoice_number});
  return sales;
}



const Sales = mongoose.model('sales', salesSchema);


module.exports={
  salesSchema,
    salesFieldValidation,
    Sales,
  
}