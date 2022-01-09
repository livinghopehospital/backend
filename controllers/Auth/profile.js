const { HttpError } = require("../../middlewares/errors/http-error");
const { httpResponse } = require("../../middlewares/http/http-response");
const { User } = require("../../model/user/user");





const staffProfile = async(req,res,next)=>{
    try {
        const {email} = req.userData;
        // console.log(req.userData)
        const staff = await User.findUserByUserName(email);
        console.log(staff);
        if(staff){
            httpResponse({status_code:200, response_message:'profile found', data:staff,res});
            return;
        }
        const e = new HttpError(404, "No user is asscoiated with the this username");
        return next(e);
    } catch (error) {
        const e = new HttpError(500, error.messgae);
        return next(e);
    }
}

module.exports={
    staffProfile
}