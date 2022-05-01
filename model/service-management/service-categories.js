const mongoose = require('mongoose');


const serviceCategoriesSchema = new mongoose.Schema({
    categories_name: {type: String, required:true},
    branch: {type: String, required:true}
});




serviceCategoriesSchema.statics.addServiceCategories = function addServiceCategories(categories){
    const category = serviceCategory(categories)
    const savedCategory = category.save();
 
    return  savedCategory;
}


serviceCategoriesSchema.statics.findCategories = async function findCategories(){
    //get all categories
    const category = await serviceCategory.find({});
    return category;
}

serviceCategoriesSchema.statics.editServiceCategories = async function editServiceCategories(id,data){
    const category = await serviceCategory.findOneAndUpdate({_id: id},data);
    return category;
  }

  serviceCategoriesSchema.statics.deleteServiceCategories = async function deleteServiceCategories(id){
    const category = await serviceCategory.findOneAndDelete({_id: id});
    return category;
  }

  const serviceCategory = mongoose.model('service-category', serviceCategoriesSchema);
module.exports= serviceCategory