const joi = require('joi');
const {  Expenses } = require("../../model/Expenses/expenses")
const { HttpError } = require("../../middlewares/errors/http-error");
const joiError = require("../../middlewares/errors/joi-error");
const { httpResponse } = require("../../middlewares/http/http-response");
const Validation = joi.object({
    date: joi.date(),
    amount: joi.number(),
    expenses_type: joi.string(),
    additional_details: joi.string(),
    branch_name: joi.string() 
})

const EditExpenses = async(req,res,next)=>{
    try {
        const {id} = req.params
        const body =await Validation.validateAsync(req.body);
        const expensesUpdated =await Expenses.updateExpenses(id,body);
        if (expensesUpdated) {
            httpResponse({status_code:200, response_message:'This expenses as been updated successfully', data:expensesUpdated, res});
        }else{
            const e = new HttpError(400, 'Unable to update this expenses. Please contact support');
            return next(e);
        }
    } catch (error) {
        joiError(error,next)
    }
}


const deleteExpenses = async(req,res,next)=>{
    try {
        const {id} = req.params;
        const expensesDeleted =await Expenses.deleteExpenses(id);
        if (expensesDeleted) {
            httpResponse({status_code:200, response_message:'Expenses successfully deleted',res});
        }else{
            const e = new HttpError(400, "Unable to delete this expenses. Contact support if persists");
            return next(e);
        }
    } catch (error) {
     joiError(error, next);   
    }
}



module.exports={
    EditExpenses,
    deleteExpenses
}