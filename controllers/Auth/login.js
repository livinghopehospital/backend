const joi = require('joi');
const { signToken } = require('../../middlewares/Authorization/jwt');
const { comparePassword } = require('../../middlewares/Authorization/password');
const { HttpError } = require('../../middlewares/errors/http-error');
const joiError = require('../../middlewares/errors/joi-error');
const { httpResponse } = require('../../middlewares/http/http-response');
const { User } = require('../../model/user/user');

const authValidation = async(req,res,next)=>{
    try {
        const {staff_username,branch_id} = req.body;
        if (!staff_username) {
            const e = new HttpError(401, "Please provide a valid username");
            return next(e); 
        }
     const staff = await User.findUserByUserName(staff_username);
     if (staff) {
        if (staff.role=="admin") {
            next();
        }else{
         if (staff.branch_id==branch_id) {
            next();
         }else{
            const e = new HttpError(401, "You don't work have access to login branch. Please choose appropriate brnach");
            return next(e);
         }
        }
     }
    } catch (error) {
     joiError(error,next);  
    }
}

const loginStaff =async(req,res,next)=>{
    try {
     const loginDetails  = joi.object({
         staff_username: joi.string().required().lowercase(),
         password:  joi.string().required(),
         branch_id: joi.string().required()
     });
     const staffDetails =await loginDetails.validateAsync(req.body);
     const staff = await User.findUserByUserName(staffDetails.staff_username);
     if (staff) {
        const checkPassword = await comparePassword({password:staffDetails.password,username:staff.username});
        if (!!checkPassword) {
            const payload ={
                email: staff.email,
                username: staff.username,
                id: staff._id,
                role: staff.role,
                branch_id:staffDetails.branch_id,
            }
            const token  =  signToken({payload});
            httpResponse({status_code:200, response_message:'success',data:{token},res});
            return;
        }
        const err = new HttpError(401, 'You have provided an invalid credentials. Please check and try again');
        return next(err);
     }
    } catch (error) {
      joiError(error,next);  
    }
}


module.exports={
    loginStaff,
    authValidation
}