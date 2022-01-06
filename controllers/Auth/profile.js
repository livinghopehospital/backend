const { HttpError } = require("../../middlewares/errors/http-error");
const { httpResponse } = require("../../middlewares/http/http-response");
const { User } = require("../../model/user/user");





const staffProfile = async(req,res,next)=>{
    try {
        const {username} = req.userData;
        const staff = await User.findUserByUserName(username);
        httpResponse({status_code:200, response_message:'profile found', data:staff,res});
    } catch (error) {
        const e = new HttpError(500, error.messgae);
        return next(e);
    }
}

module.exports={
    staffProfile
}