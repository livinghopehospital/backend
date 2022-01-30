
const { type } = require("express/lib/response");
const mongoose = require("mongoose");

const purchaseSchema = new mongoose.Schema({
    purchase_date: {type: Date, required: true},
    branch:{ type:String},
    supplier:{type:String},
    product: {type:String},
    items: [],
    purchase_quantity: {type:Number, required:true},
    invoice_number: {type:String},
    total_purchase_value:{type:Number, required:true},
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

const Purchase = mongoose.model("Purchases", purchaseSchema);


module.exports={
    Purchase
}