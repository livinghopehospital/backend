const { HttpError } = require("../../../middlewares/errors/http-error");
const { httpResponse } = require("../../../middlewares/http/http-response");
const servicesRendered = require("../../../model/service/service");

const addServices = async function addServices(req, res, next) {
  try {
    const { service_name, service_price, service_categories } = req.body;
    const {branch_id} = req.userData;
    if (!service_name ||!service_price||!service_categories) {
      const err = new HttpError(400, "service_name, service_price and service_categories are required");
      return next(err);
    }
       const regService ={
         ...req.body,
         branch: branch_id
       }
    const newService = servicesRendered.addServices(regService);
    if (newService) {
      httpResponse({
        status_code: 201,
        response_message: "Service successfully added.",
        data: { newService },
        res,
      });
    } else {
      const error = new HttpError(
        500,
        "An error occured when making the request. Please contact support if persists."
      );
      return next(error);
    }
  } catch (error) {
    console.log(error);
    const e = new HttpError(500, "Internal server error.");
    return next(e);
  }
};

module.exports = { addServices };
