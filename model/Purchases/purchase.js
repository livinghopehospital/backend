
const { type } = require("express/lib/response");
const mongoose = require("mongoose");

const purchaseSchema = new mongoose.Schema({
    purchase_date: {type: Date, required: true},
    branch:{ type:String},
    product: {type:String},
    items: [],
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

const Purchase = mongoose.model("Purchases", purchaseSchema);


module.exports={
    Purchase
}