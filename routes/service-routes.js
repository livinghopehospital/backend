const express = require("express");

// Import for service categories.
const {
  addServiceCategories,
} = require("../controllers/Services-management/categories/add-categories");
const {
  deleteCategories,
} = require("../controllers/Services-management/categories/delete-categories");
const {
  fetchAllCategories,
} = require("../controllers/Services-management/categories/fetch-categories");
const {
  editServiceCategories,
} = require("../controllers/Services-management/categories/update-categories");
const { addDeposit, updateDepositPayemt } = require("../controllers/Services-management/service-payment/add-deposit");
const { addServicePayment } = require("../controllers/Services-management/service-payment/add-payment");
const { fetchDeposit } = require("../controllers/Services-management/service-payment/fetch-deposit");
const { fetchDepositTrack } = require("../controllers/Services-management/service-payment/fetch-deposit-track");
const { fetchAllPayment, fetchPaymentByServiceCategories, fetchAllDeposit, fetchDepositByCategories } = require("../controllers/Services-management/service-payment/payment_report");

// Import for services.
const {
  addServices,
} = require("../controllers/Services-management/service/add-service");
const {
  deleteService,
} = require("../controllers/Services-management/service/delete-service");
const {
  findServices,
} = require("../controllers/Services-management/service/fetch-service");
const {
  updateService,
} = require("../controllers/Services-management/service/update-service");
const { verifyToken } = require("../middlewares/Authorization/jwt");

const router = express.Router();
router.get('/payment-report?', fetchAllPayment);
// All about service categories
router.use(verifyToken);
router.post("/add-service-categories", addServiceCategories);
router.get("/fetch-all-categories", fetchAllCategories);
router.delete("/delete-a-category/:categoryId", deleteCategories);
router.put("/update-category/:categoryId", editServiceCategories);

// All about service rendered.
router.post("/add-service", addServices);
router.get("/fetch-services", findServices);
router.delete("/delete-service/:serviceId", deleteService);
router.put("/update-service/:serviceId", updateService);


/****payment and deposits */

router.post('/add-payment', addServicePayment);
router.post('/add-deposit', addDeposit)
router.put('/update-deposit-payment?', updateDepositPayemt);
router.get('/fetch-deposit', fetchDeposit);
router.get('/fetch-deposit-track?', fetchDepositTrack);



/****Report fetch all payment  */


router.get('/fetch-payment-by-categories?', fetchPaymentByServiceCategories);
router.get('/deposit-report?', fetchAllDeposit)
router.get('/deposit-report-by-categories?', fetchDepositByCategories);
module.exports = router;
