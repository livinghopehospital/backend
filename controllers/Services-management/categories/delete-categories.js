const { HttpError } = require("../../../middlewares/errors/http-error");
const { httpResponse } = require("../../../middlewares/http/http-response");
const serviceCategory = require("../../../model/service-management/service-categories");

const deleteCategories = async function deleteCategories(req, res, next) {
  try {
    const { categoryId } = req.params;
    if (!categoryId) {
      return next(
        new HttpError(400, "Please supply categoryId in your params")
      );
    }
    const category = await serviceCategory.deleteServiceCategories(categoryId);
    if (category) {
      httpResponse({
        status_code: 200,
        response_message: "Delete category successfully.",
        data: { category },
        res,
      });
    } else {
      return next(new HttpError(404, "Failed to delete category."));
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
  deleteCategories,
};
