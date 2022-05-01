const { HttpError } = require("../../../middlewares/errors/http-error");
const { httpResponse } = require("../../../middlewares/http/http-response");
const servicesRendered = require("../../../model/service/service");

const findServices = async function findServices(req, res, next) {
  try {
    const {branch_id} = req.userData;
    const services = await servicesRendered.findServices(branch_id);
    if (services && services.length > 0) {
      httpResponse({
        status_code: 200,
        response_message: "Available services.",
        data: { services },
        res,
      });
    } else {
      return next(
        new HttpError(404, "You have not added any service. please add now.")
      );
    }
  } catch (error) {
    error = new HttpError(
      500,
      "Internal server error, please contact support if perists"
    );
    return next(error);
  }
};

module.exports = {
  findServices,
};
