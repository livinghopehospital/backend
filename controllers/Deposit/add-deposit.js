

const joi = require('joi');
const { HttpError } = require('../../middlewares/errors/http-error');
const joiError = require('../../middlewares/errors/joi-error');
const { httpResponse } = require('../../middlewares/http/http-response');
const { payementDeposit } = require('../../model/deposit/deposit');
const { Sales } = require('../../model/sales/sales');

const fieldvalidation = joi.object({
   invoice_number: joi.string().required(),
   customer_name: joi.string().required(),
   customer_number: joi.string().required(),
   amount_deposited: joi.number().required(),
   amount_to_balance: joi.number().required(),
   total_amount_to_pay : joi.number().required(),   
   branch: joi.string().required(),
   date: joi.date().required(),
   product_barcode: joi.string().required(),
   product: joi.string().required()
})


const addDeposit = async(req,res,next)=>{
    try {
        const depositValidation = await fieldvalidation.validateAsync(req.body);
        const doesSalesExist  = Sales.findSingleSales(depositValidation.invoice_number);
        if (!doesSalesExist) {
          const e = new HttpError(400, 'No sales is attached to this invoice number. Please add sales');
          return next(e);  
        }
        const doesDepositExists =await payementDeposit.DepositExist({invoice_number:depositValidation.invoice_number});
        if (!doesDepositExists) {
            const newDeposits = payementDeposit.addDeposit(depositValidation);
            newDeposits.save().then((d)=>{
                httpResponse({status_code:201, response_message:'Deposit successfully added', data:d, res});
            }).catch((err)=>{
                const e = new HttpError(500, err.message);
                return next(e);
            });

        }else{
            const e = new HttpError(400, 'A deposit has already been made with this invoice number. Please update deposit instead')
            return next(e);
        }
    } catch (error) {
        joiError(error,next)        
    }
}


module.exports={
    addDeposit
}