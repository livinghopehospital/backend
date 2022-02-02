const mongoose = require('mongoose');

const joi = require('joi');


const depositFieldValidation = joi.object({
  invoice_number: joi.string().required(),
  customer_name:  joi.string().required(),
  items: joi.array().min(1).required(),
  total_amount: joi.number().required(),
  branch: joi.string().required(),
  payment_type: joi.string().required(),
  created_at: joi.date().required()
});

const depositSchema = new mongoose.Schema({
  invoice_number:{type:String, required:true},
  customer_name: {type:String, required:true},
  amount_deposited:{type:Number, required:true},
  total_amount : {type:Number, required:true},
  amount_to_balance: {type:Number,},
  barcode:{type:String},
  product: {type:String},
  selectedProduct:{type:String},
  serial_number:{type:String},
  product_id:{type:String},
  quantity:{type:String},
  selling_price:{type:String},
  payment_type:{type:String},
  branch: {type:String,required:true}, 
  created_at:{type:Date}  
});



depositSchema.statics.createDeposit = function createDeposit(Deposits){
    const d = new Deposit(Deposits);
    return d;
}

depositSchema.pre('save', function(done){
   const balance = this.get("total_amount") - this.get("amount_deposited");
   this.set("amount_to_balance",balance);
   console.log(balance);
   done()
});

depositSchema.statics.findDeposit = async function findDeposit(){
    const Deposits = await Deposit.find({});
    return Deposits;
}

depositSchema.statics.findSingleDeposit = async function findSingleDeposit(invoice_number){
  const Deposits = await Deposit.findOne({invoice_number});
  return Deposits;
}

depositSchema.statics.updateDeposit = async function updateDeposit(id,data){
  const Deposits = await Deposit.findOneAndUpdate({_id:id},data,{upsert:true, new:true});
  return Deposits;
}



const Deposit = mongoose.model('deposit', depositSchema);


module.exports={
    depositFieldValidation,
    depositSchema,
    Deposit
}