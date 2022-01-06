
const mongoose = require('mongoose');

const joi = require('joi');

const paymentFieldValidation = joi.object({
  payment_type: joi.string().required().uppercase()
});


const paymentTypeSchema = new mongoose.Schema({  
    payment_type:{type:String, required:true},
});



paymentTypeSchema.statics.addPaymentType =function addPaymentType(type){
    return new PaymentType(type);
}

paymentTypeSchema.statics.findPaymentType =async function findPaymentType(type){
    const types = await PaymentType.find({});
    return types;
}
const PaymentType = mongoose.model('payment-type', paymentTypeSchema);

module.exports={
    paymentFieldValidation,
    PaymentType
}