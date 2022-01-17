const joi = require('joi');
const { signToken } = require('../../middlewares/Authorization/jwt');
const { comparePassword } = require('../../middlewares/Authorization/password');
const { HttpError } = require('../../middlewares/errors/http-error');
const joiError = require('../../middlewares/errors/joi-error');
const { httpResponse } = require('../../middlewares/http/http-response');
const { User } = require('../../model/user/user');


const loginStaff =async(req,res,next)=>{
    try {
     const loginDetails  = joi.object({
         staff_username: joi.string().required().lowercase(),
         password:  joi.string().required(),
         branch_id: joi.string().required()
     });
     const staffDetails =await loginDetails.validateAsync(req.body);
    
     const staff = await User.findUserByUserName(staffDetails.staff_username);
     if (staff&&staff.branch==staffDetails.branch_id&&staff.staff_username!='admin') {
         const checkPassword = await comparePassword({password:staffDetails.password,username:staff.username});
         if (!!checkPassword) {
             const payload ={
                 email: staff.email,
                 username: staff.username,
                 id: staff._id,
                 role: staff.role,
                 branch_id:staff.branch,
             }
             const token  =  signToken({payload});
             httpResponse({status_code:200, response_message:'success',data:{token},res});
             return;
         }
         const err = new HttpError(401, 'You have provided an invalid credentials. Please check and try again');
         return next(err);
     }else{
         const err = new HttpError(400, 'No staff exists with provided username in the choosen branch. Please contact the company administrator');
         return next(err);
     }
    } catch (error) {
      joiError(error,next);  
    }
}


module.exports={
    loginStaff
}