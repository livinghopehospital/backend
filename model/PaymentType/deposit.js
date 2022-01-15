const mongoose = require('mongoose');

const depositSchema= mongoose.Schema({

    deposit_type: {type:String, required:true}
});



depositSchema.statics.paymentType = function paymentType(type){

    const deposits = new Deposit(type);
    return deposits;
}

depositSchema.statics.listpaymentType =async function listpaymentType(){
    const d =await Deposit.find({});
    return d;
}
const paymentType = mongoose.model('deposit', depositSchema);

module.exports={
    paymentType
}

