const mongoose = require('mongoose');

const paymentSchema= mongoose.Schema({

    payment_type: {type:String, required:true}
});



paymentSchema.statics.createPaymentType = function createPaymentType(type){
    const payments = new paymentType(type);
    return payments;
}

paymentSchema.statics.listpaymentType =async function listpaymentType(){
    const d =await paymentType.find({});
    return d;
}
const paymentType = mongoose.model('payment', paymentSchema);

module.exports={
    paymentType
}

