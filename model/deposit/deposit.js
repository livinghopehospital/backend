const mongoose = require('mongoose');

const joi = require('joi');


const depositFieldValidation = joi.object({
  invoice_number: joi.string().required(),
  customer_name:  joi.string().required(),
  items: joi.array().min(1).required(),
  total_amount: joi.number().required(),
  amount_deposited: joi.number().required(),
  branch: joi.string().required(),
  payment_type: joi.string().required(),
  created_at: joi.date().required()
});

const depositSchema = new mongoose.Schema({
  invoice_number:{type:String, required:true},
  customer_name: {type:String, required:true},
  amount_deposited:{type:Number, required:true},
  items: [],
  total_amount : {type:Number, required:true},
  amount_to_balance: {type:Number, required:true},
  payment_type:{type:String},
  branch: {type:String,required:true}, //add at backend
  created_at:{type:Date}  
});



depositSchema.statics.createDeposit = function createDeposit(Deposit){
    return new Deposit(Deposit)
}


depositSchema.statics.findDeposit = async function findDeposit(){
    const Deposit = await Deposit.find({});
    return Deposit;
}

depositSchema.statics.findSingleDeposit = async function findSingleDeposit(invoice_number){
  const Deposit = await Deposit.findOne({invoice_number});
  return Deposit;
}



const Deposit = mongoose.model('deposit', depositSchema);


module.exports={
  depositSchema,
    depositFieldValidation,
    Deposit,
}