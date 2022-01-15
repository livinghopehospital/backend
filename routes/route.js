const express = require('express');
const { loginStaff } = require('../controllers/Auth/login');
const { staffProfile } = require('../controllers/Auth/profile');
const { registerStaff, viewStaff } = require('../controllers/Auth/staff-reg');
const { createStore } = require('../controllers/Branch/create-branch');
const { listAllStores } = require('../controllers/Branch/view-branch');
const { addBrand } = require('../controllers/brand/add-brand');
const { deleteProductBrand } = require('../controllers/brand/delete-brand');
const { updateBrand } = require('../controllers/brand/update-brand');
const { viewAllBrands } = require('../controllers/brand/view-brands');
const { addpaymentType } = require('../controllers/PaymentType/add-deposit');
const { viewPaymentType } = require('../controllers/PaymentType/view-deposit');
const { addProducts } = require('../controllers/products/add-product');
const { updateProducts } = require('../controllers/products/update-product');
const { viewAllProducts, viewSingleProduct } = require('../controllers/products/view-products');
const { addPurchase } = require('../controllers/purchase/add-purchase');
const { viewPurchase } = require('../controllers/purchase/view-purchase');
const { fetchOutOfStock } = require('../controllers/reports/out-of-stock');
const { fetchProductPrice } = require('../controllers/reports/product-price-list');
const { addSales } = require('../controllers/sales/add-sales');
const { viewSales } = require('../controllers/sales/view-sales');
const { addSupplier } = require('../controllers/suppliers/add-supplier');
const { deleteSupplier } = require('../controllers/suppliers/delete-supplier');
const { updateSupplier } = require('../controllers/suppliers/edit-supplier');
const { viewAllSuppliers } = require('../controllers/suppliers/view-suppliers');
const { verifyToken } = require('../middlewares/Authorization/jwt');
const { isManager } = require('../middlewares/Authorization/role');

const router = express.Router();





/***Aunthenticated starts here */
router.get('/view-branch', listAllStores);

router.post('/login', loginStaff);

router.post('/register-staff', registerStaff);
router.post('/create-branch', createStore);
/***Aunthenticated routes stops here */


/***Protected routes below */

router.use(verifyToken);

// router.post('register-staff', registerStaff);
router.get('/profile', staffProfile);
router.get('/view-staff', viewStaff);
// router.post('/create-store',isManager, createStore);

/***DEPOSITS...... */

router.get('/view-payment-type', viewPaymentType);
router.post('/add-payment-type',addpaymentType);


/****SUPPLIER ROUTES */

router.post('/add-supplier', addSupplier);
router.get('/view-supplier', viewAllSuppliers);
router.delete('/delete-supplier/:supplierId', deleteSupplier);
router.put('/update-supplier/:supplierId', updateSupplier)

/*****BRAND ROUTES */
router.post('/add-brand', addBrand);
router.get('/view-brand', viewAllBrands);
router.delete('/delete-brand/:brandId', deleteProductBrand);
router.put('/update-brand/:brandId', updateBrand);

/****PRODUCT ROUTES */
router.post('/add-product', addProducts);
router.get('/view-product', viewAllProducts);
router.get('/view-product-by-barcode/:barcode', viewSingleProduct);
router.put('/update-product/:productId', updateProducts);

/****ADD SALES ROUTES*/

router.post('/add-sales', addSales);
router.get('/view-sales', viewSales);



/*****PURCHASE ROUTES */

router.post('/add-purchase', addPurchase);

router.get('/view-purchase', viewPurchase);


/****REPORTS ROUTES */

router.get('/view-out-of-stock', fetchOutOfStock);
router.get('/view-product-price', fetchProductPrice);
module.exports=router;