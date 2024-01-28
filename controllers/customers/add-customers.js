
const joi = require('joi');
const { HttpError } = require('../../middlewares/errors/http-error');
const joiError = require('../../middlewares/errors/joi-error');
const { httpResponse } = require('../../middlewares/http/http-response');
const { Customer } = require('../../model/customer/customer');
const { customerRecord, healtRecordModel } = require('../../model/customer/customer-txn-list');

const bodyValidation = joi.object({
    first_name: joi.string().required(),
    last_name: joi.string().required(),
    phone_number: joi.string(),
    email: joi.string().lowercase(),
    reg_id: joi.string().required().required(),
    address: joi.string()
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


const AddhealthRecord= async function AddhealthRecord(req,res,next){
    try {
     const {diagnosis, prescription, reg_id, customer_id}= req.body;
     const {username} = req.userData;
     if(!diagnosis||!prescription){
        const e = new HttpError(404, 'diagnosis and prescription are required');
        return next(e); 
     }
     if(!reg_id||!customer_id){
      const e = new HttpError(404, 'reg_id and customer_id are required');
      return next(e); 
     }
     const newRecord = await healtRecordModel.addHealtRecord({...req.body, assigned_by:username});
     if(newRecord){
     return httpResponse({status_code:201, response_message:'Record successfully added', data:{newRecord},res});
     }
     const e = new HttpError(404, 'Something went wrong. Try again later');
     return next(e); 
    } catch (error) {
      joiError(error, next)
    }
    }

const getHealthRecords = async function getHealthRecords(req,res,next){
  try {
    const {customerId} = req.params
    const  records=  await healtRecordModel.listHealthRecord(customerId)
    return httpResponse({status_code:201, response_message:'Record successfully added', data:{records},res});
  } catch (error) {
    joiError(error, next)
  }
}

module.exports={
addNewCustomer,
AddhealthRecord,
getHealthRecords
}