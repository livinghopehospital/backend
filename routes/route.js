const express = require('express');
const { loginStaff } = require('../controllers/Auth/login');
const { staffProfile } = require('../controllers/Auth/profile');
const { registerStaff, viewStaff } = require('../controllers/Auth/staff-reg');
const { createStore } = require('../controllers/Branch/create-branch');
const { deleteBranch } = require('../controllers/Branch/delete-branch');
const { editBranch } = require('../controllers/Branch/update-branch');
const { listAllStores } = require('../controllers/Branch/view-branch');
const { addBrand } = require('../controllers/brand/add-brand');
const { deleteProductBrand } = require('../controllers/brand/delete-brand');
const { updateBrand } = require('../controllers/brand/update-brand');
const { viewAllBrands } = require('../controllers/brand/view-brands');
const { addExpensesCategory, viewCategory } = require('../controllers/Expenses/add-category');
const { addExpenses } = require('../controllers/Expenses/add-expenses');
const { EditExpenses, deleteExpenses } = require('../controllers/Expenses/manage_expenses');
const { viewExpenses } = require('../controllers/Expenses/view-expenses');
const { addpaymentType } = require('../controllers/PaymentType/add-payment-type');
const { viewPaymentType } = require('../controllers/PaymentType/view-payment-type');
const { addProducts } = require('../controllers/products/add-product');
const { deleteProduct } = require('../controllers/products/delete-product');
const { updateProducts, BalanceStockLevel } = require('../controllers/products/update-product');
const { viewAllProducts, viewSingleProduct, viewSingleProductById } = require('../controllers/products/view-products');
const { addPurchase } = require('../controllers/purchase/add-purchase');
const { deletePurchase } = require('../controllers/purchase/delete-purchase');
const { editPurchase } = require('../controllers/purchase/edit-purchase');
const { viewPurchase } = require('../controllers/purchase/view-purchase');
const { depositReport } = require('../controllers/reports/deposit-report');
const { fetchOutOfStock } = require('../controllers/reports/out-of-stock');
const { fetchProductPrice, stockLevel } = require('../controllers/reports/product-price-list');
const { viewProfitLossReport } = require('../controllers/reports/profit-loss-report');
const { viewSalesReport } = require('../controllers/reports/sales-report');
const { addDeposit } = require('../controllers/sales/add-deposit');
const { addSales } = require('../controllers/sales/add-sales');
const { deleteSale } = require('../controllers/sales/delete-sales');
const { editSale } = require('../controllers/sales/edit-sale');
const { updatemountPaid } = require('../controllers/sales/update-deposit');
const { viewDeposit } = require('../controllers/sales/view-deposit');
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

router.delete('/delete-branch/:id', deleteBranch);

router.put('/update-branch/:id', editBranch);


// router.post('register-staff', registerStaff);
router.get('/profile', staffProfile);
router.get('/view-staff', viewStaff);
// router.post('/create-store',isManager, createStore);

/***DEPOSITS...... */


router.get('/view-deposit', viewDeposit);

router.post('/add-deposit', addDeposit);

router.put('/update-deposit/:id', updatemountPaid);

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
router.get('/view-product-by-barcode/:product_barcode', viewSingleProduct);
router.put('/update-product/:productId', updateProducts);
router.get('/view-single-product-by-id/:id', viewSingleProductById);
/****ADD SALES ROUTES*/

router.post('/add-sales', addSales);
router.get('/view-sales', viewSales);
router.delete('/delete-sales/:id', deleteSale);
router.put('/update-sales/:id', editSale);
/***** */


/*****PURCHASE ROUTES */

router.post('/add-purchase', addPurchase);

router.get('/view-purchase', viewPurchase);

router.put('/update-purchase/:id', editPurchase);

router.delete('/delete-purchase/:id', deletePurchase);
/****PAYMENT TYPE */

router.post('/add-payment-type', addpaymentType);
router.get('/view-payment-type', viewPaymentType);


/******EXPENSES  ***/
router.post('/add-expenses', addExpenses);
router.get('/view-expenses', viewExpenses);
router.post('/add-expenses-category', addExpensesCategory);
router.get('/view-expenses-categories', viewCategory);
router.put('/update-expenses/:id',EditExpenses);
router.delete('/delete-expenses/:id', deleteExpenses);


/****DEPOSITS ROUTE */
// router.post('/add-deposits', addDeposit);
// router.get('/view-deposits', viewDeposit);
/****REPORTS ROUTES */



router.get('/view-out-of-stock?', fetchOutOfStock);
router.get('/view-product-price', fetchProductPrice);
router.get('/view-deposit-reports?', depositReport);
router.get('/view-sales-report?', viewSalesReport);
router.get('/view-stock-level', stockLevel);
router.put('/balance-stock-level/:id', BalanceStockLevel);
router.delete('/delete-product/:id', deleteProduct);
router.get('/view-profit-loss', viewProfitLossReport);

module.exports=router;