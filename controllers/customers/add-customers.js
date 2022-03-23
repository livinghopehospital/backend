
const joi = require('joi');
const { HttpError } = require('../../middlewares/errors/http-error');
const joiError = require('../../middlewares/errors/joi-error');
const { httpResponse } = require('../../middlewares/http/http-response');
const { Customer } = require('../../model/customer/customer');
const { customerRecord } = require('../../model/customer/customer-txn-list');

const bodyValidation = joi.object({
    first_name: joi.string().required(),
    last_name: joi.string().required(),
    phone_number: joi.string().required(),
    email: joi.string().required().lowercase(),
    address: joi.string().required()
})


const addNewCustomer = async(req,res,next)=>{
    try {
       const validation = await bodyValidation.validateAsync(req.body);
       const {branch_id} = req.userData
       const others ={
        branch:branch_id
       } 
      const newCustomer= await Customer.createNewCustomer(validation, others);
      if (newCustomer) {
          await customerRecord.createNewRecord(newCustomer._id);
         httpResponse({status_code:201, response_message:'Customer successfully added', data:{newCustomer},res}); 
      } else {
        const e = new HttpError(500, 'Something unexpected happened. Please contact support');
        return next(e);
      }
    } catch (error) {
        joiError(error, next)
    }
}

module.exports={
addNewCustomer
}