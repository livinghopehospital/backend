
const mongoose = require('mongoose');

const servicePaymentDepositSchema = new mongoose.Schema({
    amount_paid: {type:Number, required:true},
    amount_to_pay: {type:Number, required:true},
    invoice_number: {type:String},
    amount_to_balance: {type:Number,required:true},
    username: {type:String},
    service_name: {type:String, required:true},
    branch: {type:String, required:true},
    service_categories: {type:String, required:true},
    customer_name: {type:String, required:true},
    created_at:{type:Date},
    
});

const servicePaymentDepositTrackSchema = new mongoose.Schema({
    amount_paid: {type:Number, required:true},
    payment_type: {type:String},
    amount_paid_today: {type:Number},
    amount_to_pay: {type:Number, required:true},
    amount_to_balance: {type:Number,required:true},
    service_name: {type:String, required:true},
    branch: {type:String, required:true},
    service_categories: {type:String, required:true},
    customer_name: {type:String, required:true},
  
    
},{
    timestamps:true
});



servicePaymentDepositTrackSchema.statics.createDepositTrack = function createDepositTrack(trackRecord){
/***Create record of how the deposit is made by customers */
    const newRecord = new serviceDepositTrack(trackRecord);
    const e = newRecord.save();
    return e;
}

servicePaymentDepositTrackSchema.statics.fetchDepositTrack = async function fetchDepositTrack(customer_name, branch){
    /***Check how payment was made by this customer ***/
        const track = await serviceDepositTrack.find({customer_name:customer_name, branch});
        return track;
}



servicePaymentDepositSchema.statics.addPayment = function addPayment(paymentDetails){
    const newPayment = new servicePaymentDeposit(paymentDetails);
    const e = newPayment.save();
    return e;
}


servicePaymentDepositSchema.statics.fetchDeposit = async function fetchDeposit(branch){
    const deposit = await servicePaymentDeposit.find({branch});
    return deposit;
}

servicePaymentDepositSchema.statics.updateServiceDeposit = async function updateDepositPayemt(depositId,data){
    const updateDeposit = await servicePaymentDeposit.findOneAndUpdate({_id:depositId}, data, {upsert:true,new:true});
    return updateDeposit
}


const servicePaymentDeposit = mongoose.model("service-payment-deposit", servicePaymentDepositSchema);
const serviceDepositTrack = mongoose.model("service-deposit-track", servicePaymentDepositTrackSchema);
module.exports={
    servicePaymentDeposit,
    serviceDepositTrack
}