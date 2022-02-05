
const { type } = require("express/lib/response");
const mongoose = require("mongoose");

const purchaseSchema = new mongoose.Schema({
    purchase_date: {type: Date, required: true},
    branch:{ type:String},
    product: {type:String},
    created_at:{type:Date},
    supplier: {type:String},
    product_id: {type:String},
    purchase_quantity: {type:String},
    total_purchase_value:{ type:String},
    invoice_number: {type:String},
    discount:{type:String} 
});

purchaseSchema.statics.addPurchase = function addPurchase(purchaseDetails){
    const purchase =  new Purchase(purchaseDetails);
    return purchase;
}

purchaseSchema.statics.findPurchase = async function findPurchase(branch){
    const mPurchase = await Purchase.find({branch});
    return mPurchase;
}

purchaseSchema.statics.deletePurchase = async function deletePurchase(id){
    const mPurchase = await Purchase.findOneAndDelete({_id:id});
    return mPurchase;
}

purchaseSchema.statics.editPurchase = async function editPurchase(id,data){
    const mPurchase = await Purchase.findOneAndUpdate({_id:id},data);
    return mPurchase;
}
const Purchase = mongoose.model("Purchases", purchaseSchema);


module.exports={
    Purchase
}