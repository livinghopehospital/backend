const { HttpError } = require("../../../middlewares/errors/http-error");
const { httpResponse } = require("../../../middlewares/http/http-response");
const serviceCategory = require("../../../model/service-management/service-categories")




const fetchAllCategories = async function fetchAllCategories(req,res,next){
    const {branch_id} = req.userData;
     try {
         const categories = await serviceCategory.findCategories(branch_id);
         if (categories&&categories.length>0) {
             
            httpResponse({status_code:200, response_message:'Available categories', data:{categories}, res});
         }else{
             return next(new HttpError(404, 'You have not added any service categories. please add now'));
         }
     } catch (error) {
        return next(new HttpError(500, 'Internal server error, please contact support if perists'));
     }
}

module.exports={
    fetchAllCategories
}