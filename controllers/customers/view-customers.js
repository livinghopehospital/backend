const { HttpError } = require("../../middlewares/errors/http-error");
const { httpResponse } = require("../../middlewares/http/http-response");
const { Customer } = require("../../model/customer/customer");


const viewAllCustomers = async function viewAllCustomers(req, res, next) {

    try {
        const { branch_id } = req.userData;
        const customers = await Customer.viewAllCustomer(branch_id);
        if (customers.length > 0) {
            httpResponse({ status_code: 200, response_message: 'Customers available', data: { customers }, res });
        } else {
            const e = new HttpError(404, 'You have not registered any customer');
            return next(e);
        }
    } catch (error) {
        console.log(error);
        const e = new HttpError(500, 'Internal server error');
        return next(e);
    }
}


const viewSingleCustomers = async function viewSingleCustomers(req, res, next) {

    try {
        const { branch_id } = req.userData;
        const {reg_id} = req.query;
        if(!reg_id){
            const e = new HttpError(400, 'reg_id is required');
          return next(e);   
        }
        const customers = await Customer.viewSingleCustomer(branch_id,reg_id);
        if (customers) {
            httpResponse({ status_code: 200, response_message: 'Customers available', data: { customers }, res });   
        }
        const e = new HttpError(400, 'No customer is associated with the registration Id');
        return next(e);
        
    } catch (error) {
        console.log(error);
        const e = new HttpError(500, 'Internal server error');
        return next(e);
    }
}

module.exports={
    viewAllCustomers,
    viewSingleCustomers
}