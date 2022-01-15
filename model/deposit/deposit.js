

const mongoose = require('mongoose');

const depositSchema = mongoose.Schema({
   invoice_number: {type: String, required:true},
   customer_name: {type:String, required:true},
   customer_number: {type:String, required:true},
   amount_deposited :{type:Number, required:true},
   amount_to_balance:{type:Number, required:true},
   total_amount_to_pay :{type:Number, required:true},
   date: {type: Date, required:true},
   branch: {type: mongoose.Types.ObjectId, required:true, ref:'branch'},
 
   product: [{
    product_barcode: {type:String, required:true},
    product_id: {type: mongoose.Types.ObjectId, ref:'product'},
    product_qty: {type: Number, required:true},
    price: {type:Number, required:true}
   }]
});

depositSchema.statics.addDeposit =function addDeposit(depo){
    const d = new payementDeposit(depo);
    return d;
}

depositSchema.statics.findDeposit=async function findDeposit(){
    const d = await payementDeposit.find({}).populate('product');
    return d;
}

depositSchema.statics.DepositExist=async function DepositExist(){
    const d = await payementDeposit.find({});
    return d
}

depositSchema.statics.updateDepositPayment = async function updateDeposit(invoice_number,data){
       const updated = await payementDeposit.findOneAndUpdate({invoice_number}, data);
       return updated;
}

const payementDeposit = mongoose.model('payment-deposit', depositSchema);


module.exports={
    payementDeposit
}