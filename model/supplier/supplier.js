

const mongoose = require('mongoose');

const joi = require('joi');


const supplierFieldValidation = joi.object({
  supplier_name: joi.string().required()
});

const supplierSchema = new mongoose.Schema({
  supplier_name: {type: String, required:true},
  supplier_address:{ type: String},
  supplier_phone: {type: String},
  supplier_email: {type:String},
  contact_person: {type: String}
});



supplierSchema.statics.createSupplier = function createSupplier(supplier){
    return new supplier(supplier)
}

supplierSchema.statics.findsupplier = async function(){

    const supplier = await supplier.find({});
    return supplier;
}

supplierSchema.statics.deleteSupplier = async function deleteSupplier(supplierId){
    const supplier = await supplier.findOneAndDelete({_id:supplierId});
    return supplier;
}
supplierSchema.statics.updateSupplier = async function updateSupplier(supplierId, data){
    const supplier = await supplier.findOneAndUpdate({_id:supplierId},data);
    return supplier;
}
const Supplier = mongoose.model('supplier', supplierSchema);


module.exports={
    supplierFieldValidation,
    Supplier
}