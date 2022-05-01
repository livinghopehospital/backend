const { HttpError } = require("../../../middlewares/errors/http-error");
const { httpResponse } = require("../../../middlewares/http/http-response");
const servicesRendered = require("../../../model/service/service");

const updateService = async function updateService(req, res, next) {
  try {
    const { serviceId } = req.params;

    if (!serviceId) {
      return next(
        new HttpError(400, "Please supply serviceId in your params.")
      );
    }
    const serviceToUpdate = await servicesRendered.updateService(
      serviceId,
      req.body
    );
    if (serviceToUpdate) {
      httpResponse({
        status_code: 200,
        response_message: "Service successfully updated.",
        data: { categoryToUpdate },
        res,
      });
    } else {
      return next(new HttpError(400, "Failed to update the services."));
    }
  } catch (error) {
    error = new HttpError(
      500,
      "Internal server error, please contact support if perists."
    );
    return next(error);
  }
};

module.exports = {
  updateService,
};
