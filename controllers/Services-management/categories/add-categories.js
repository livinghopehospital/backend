const { HttpError } = require("../../../middlewares/errors/http-error");
const { httpResponse } = require("../../../middlewares/http/http-response");
const serviceCategory = require("../../../model/service-management/service-categories");



const addServiceCategories = async function addServiceCategories(req,res,next){
    try {
        const {categories_name} = req.body;
        const {branch_id} = req.userData;
        if (!categories_name) {
            const error= new HttpError(400, 'Please provide categories_name in your body');
            return next(error);
        }
        const categoriesDetails ={
            ...req.body,
            branch: branch_id
        }
        const newCategories = serviceCategory.addServiceCategories(categoriesDetails);
        if (newCategories) {
          httpResponse({status_code:201, response_message:'Service categories successfully added', data:{categories_name}, res});  
        }else{
            const error= new HttpError(500, 'An error occured when making the request. Please contact support if persists');
            return next(error); 
        }
    } catch (error) {
        console.log(error);
        const e= new HttpError(500, 'Internal server error');
         return next(e); 
        
    }
}

module.exports={
    addServiceCategories
}