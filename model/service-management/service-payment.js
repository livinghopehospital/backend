const { types } = require('joi');
const mongoose = require('mongoose');

const servicePaymentSchema = new mongoose.Schema({
    amount_paid: {type:Number, required:true},
    service_name: {type:String, required:true},
    invoice_number:{type:String, required:true},
    total_amount: {type:Number, required:true},
    payment_type:{type:String},
    branch: {type:String, required:true},
    service_categories: {type:String, required:true},
    customer_name: {type:String, required:true},
    created_at:{type:Date},
    
});


servicePaymentSchema.statics.addPayment = function addPayment(paymentDetails){
    const newPayment = new servicePayment(paymentDetails);
    const e = newPayment.save();
    return e;
}

const servicePayment = mongoose.model("service-payment", servicePaymentSchema);

module.exports={
    servicePayment
}