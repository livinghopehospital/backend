
const mongoose = require("mongoose");

const purchaseSchema = new mongoose.Schema({
    purchase_date: {type: Date, required: true},
    branch:{ type:mongoose.Types.ObjectId,ref:'Branch'},
    supplier:{type: mongoose.Types.ObjectId, ref:'supplier'},
    product: {type:mongoose.Types.ObjectId, ref:'product'},
    purchase_quantity: {type:Number, required:true},
    invoice_number: {type:String},
    total_purchase_value:{type:Number, required:true},
    discount:{type:String} 
});

purchaseSchema.statics.addPurchase = function addPurchase(purchaseDetails){
    const purchase =  new Purchase(purchaseDetails);
    return purchase;
}

purchaseSchema.statics.findPurchase = async function findPurchase(){
    const mPurchase = await Purchase.find({}).populate('branch').populate('supplier').populate('product') ;
    return mPurchase;
}

const Purchase = mongoose.model("Purchases", purchaseSchema);


module.exports={
    Purchase
}