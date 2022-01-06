

const mongoose = require('mongoose');

const joi = require('joi');


const brandFieldValidation = joi.object({
  brand_name: joi.string().required().uppercase()
});

const brandSchema = new mongoose.Schema({
  brand_name: {type: String, required:true}
});



brandSchema.statics.createBrand = function createBrand(brand){
    return new Brand(brand)
}

brandSchema.statics.findBrand = async function findBrand(){
    const brand = await Brand.find({});
    return brand;
}

brandSchema.statics.findBrandByName = async function findBrandByName(brand_name){
    const brand = await Brand.findOne({brand_name});
    return brand;
}

brandSchema.statics.deleteBrand = async function deleteBrand(brandId){
    const brand = await Brand.findOneAndDelete({_id:brandId});
    return brand;
}
brandSchema.statics.updateBrand = async function updateBrand(brandId, data){
    const brand = await Brand.findOneAndUpdate({_id:brandId},data);
    return brand;
}
const Brand = mongoose.model('Brand', brandSchema);


module.exports={
    brandFieldValidation,
    Brand
}