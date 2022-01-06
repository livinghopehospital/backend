

const mongoose = require('mongoose');

const joi = require('joi');


const salesFieldValidation = joi.object({
  product_name: joi.string().required(),
  product_barcode: joi.string().required(),
  invoice_number: joi.string(),
  purchased_qty: joi.number().required(),
  total_amount: joi.number().required(),
  payment_type: joi.string().required(),
  created_at: joi.date().required()
});

const salesSchema = new mongoose.Schema({
  product_name: {type: String, required:true},
  product_barcode:{ type:String,required:true},
  total_amount: {type:Number},
  unit_price: {type:Number},
  branch: {type:mongoose.Types.ObjectId, required:true}, //add at backend
  created_at:{type: Date}  
});



salesSchema.statics.createSales = function createSales(sales){
    return new sales(sales)
}

salesSchema.statics.findsales = async function(){
    const sales = await sales.find({});
    return sales;
}



const sales = mongoose.model('sales', salesSchema);


module.exports={
    salesFieldValidation,
    sales,
    salesSchema
}