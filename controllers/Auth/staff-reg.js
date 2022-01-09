const { HttpError } = require("../../middlewares/errors/http-error");
const joiError = require("../../middlewares/errors/joi-error");
const { httpResponse } = require("../../middlewares/http/http-response");
const { staffFieldValidation, User } = require("../../model/user/user")



const registerStaff =async(req,res,next)=>{
    try {
        const staffDetails =await staffFieldValidation.validateAsync(req.body);
         const staffExists = await User.findUserByUserName(staffDetails.username);
         if (staffExists) {
            const err = new HttpError(400, 'These username has already been used to register a staff');
            return next(err); 
         }
         const newStaff = await User.createUser(staffDetails);
         newStaff.save().then((staff)=>{
            httpResponse({status_code:201, response_message:'Account created',data:staff, res});
         }).catch((e)=>{
             const err = new HttpError(500, e.message);
             return next(err);
         });
    } catch (error) {
       joiError(error,next); 
    }
}


const viewStaff = async(req,res,next)=>{
    try {
        const staff =await User.findStaffs();
        if(staff){
            httpResponse({status_code:200, response_message:'Staff available', data:staff, res});
            return;
        }
        const e = new HttpError(400, 'You have not registered any staff');
        return next(e);
    } catch (error) {
        
        const e = new HttpError(400, error.mesage);
        return next(e);
    }
}



module.exports={
    registerStaff,
    viewStaff
}