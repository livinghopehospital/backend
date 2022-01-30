const mongoose = require('mongoose');

const joi = require('joi');


const salesFieldValidation = joi.object({
  invoice_number: joi.string().required(),
  items: joi.array().min(1).required(),
  total_amount: joi.number().required(),
  branch: joi.string().required(),
  payment_type: joi.string().required(),
  created_at: joi.date().required()
});

const salesSchema = new mongoose.Schema({
  invoice_number:{type:String, required:true},
  items: [],
  total_amount : {type:Number, required:true},
  payment_type:{type:String},
  branch: {type:String,required:true}, //add at backend
  created_at:{type:Date}  
});



salesSchema.statics.createSales = function createSales(sales){
    return new Sales(sales)
}


salesSchema.statics.findSales = async function findsales(){
    const sales = await Sales.find({});
    return sales;
}

salesSchema.statics.findSingleSales = async function findSingleSales(invoice_number){
  const sales = await Sales.findOne({invoice_number});
  return sales;
}

salesSchema.statics.deleteleSales = async function deleteleSales(id, branch){
  const sales = await Sales.findOneAndDelete({_id:id, branch});
  return sales;
}


const Sales = mongoose.model('sales', salesSchema);


module.exports={
  salesSchema,
    salesFieldValidation,
    Sales,
  
}