const { HttpError } = require("../../middlewares/errors/http-error");
const { httpResponse } = require("../../middlewares/http/http-response");
const { User } = require("../../model/user/user");





const staffProfile = async (req, res, next) => {
    try {
        const { username } = req.userData;
        const staff = await User.findUserByUserName(username);
        if (staff) {
            httpResponse({ status_code: 200, response_message: 'profile found', data: staff, res });
            return;
        }
        const e = new HttpError(404, "No user is asscoiated with the this username");
        return next(e);
    } catch (error) {
        const e = new HttpError(500, error.messgae);
        return next(e);
    }
}


const updateProfile = async function updateProfile(req, res, next) {
    try {
        const { first_name,
            last_name,
            username,
            email,
            role,
            branch, } = req.body;
        const data = {
            first_name,
            last_name,
            username,
            email,
            role,
            branch,
        }
        const {id} = req.params;
        const updateUser = await User.updateUser(id, data);
        if (updateUser) {
            httpResponse({ status_code: 200, response_message: "Profile Successfully updated", data: {}, res })
        } else {
            const e = new HttpError(400, "Unable to update profile. Contact support if persists");
            return next(e);
        }
    } catch (error) {
        const e = new HttpError(500, error.messgae);
        return next(e);
    }
}

module.exports = {
    staffProfile,
    updateProfile
}