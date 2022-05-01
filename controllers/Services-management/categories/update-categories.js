const { HttpError } = require("../../../middlewares/errors/http-error");
const { httpResponse } = require("../../../middlewares/http/http-response");
const serviceCategory = require("../../../model/service-management/service-categories")




const editServiceCategories = async function editServiceCategories(req,res,next){

     try {
         const {categoryId} = req.params;
      
         if (!categoryId) {
            return next(new HttpError(400, 'Please supply categoryId in your params.'));  
         }
         const categoryToUpdate = await serviceCategory.editServiceCategories(categoryId, req.body);
         if (categoryToUpdate) {
            httpResponse({status_code:200, response_message:'Category successfully updated.', data:{categoryToUpdate}, res});
         }else{
             return next(new HttpError(404, 'Failed to update the category.'));
         }
     } catch (error) {
        return next(new HttpError(500, 'Internal server error, please contact support if perists'));
     }
}

module.exports={
    editServiceCategories
}