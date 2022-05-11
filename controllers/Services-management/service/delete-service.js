const { HttpError } = require("../../../middlewares/errors/http-error");
const { httpResponse } = require("../../../middlewares/http/http-response");
const servicesRendered = require("../../../model/service/service");

const deleteService = async function deleteService(req, res, next) {
  try {
    const { serviceId } = req.params;
    if (!serviceId) {
      new HttpError(400, "Please supply serviceId in your params");
    }
    const service = await servicesRendered.deleteService(serviceId);

    if (service) {
      httpResponse({
        status_code: 200,
        response_message: "Delete service successfully.",
        data: { service },
        res,
      });
    } else {
      return next(new HttpError(404, "Failed to delete service."));
    }
  } catch (error) {
    return next(
      new HttpError(
        500,
        "Internal server error, please contact support if perists"
      )
    );
  }
};

module.exports = {
  deleteService,
};
