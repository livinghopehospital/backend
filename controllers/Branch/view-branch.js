const { HttpError } = require("../../middlewares/errors/http-error");
const { httpResponse } = require("../../middlewares/http/http-response");
const { Branch } = require("../../model/Branch/branch");


const listAllStores = async(req,res,next)=>{
    try {
        const stores = await Branch.findBranches();
        httpResponse({status_code:200, response_message:'avaiilable', data:stores,res});
    } catch (error) {
        const err = new HttpError(500,error.message);
        return next(err);
    }
}

module.exports={
    listAllStores
}