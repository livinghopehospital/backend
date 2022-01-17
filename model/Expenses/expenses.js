


const mongoose = require('mongoose');

const joi = require('joi');

const exepensesValidation = joi.object({
    date: joi.date().required(),
    amount: joi.number(). required(),
    expenses_type: joi.string().required(),
    additional_details: joi.string().required(),
})

const expensesSchema = new mongoose.Schema({
    date: {type:Date, required:true},
    amount: {type:Number, required:true},
    expenses_type: {type:String, required:true},
    additional_details: {type:String, required:true},
});


expensesSchema.statics.addExpenses = function addExpenses(expenses){
    const e = new Expenses(expenses);
    return e;
}


expensesSchema.statics.viewExpenses = function viewExpenses(){
    const e = Expenses.find({});
    return e;
}

expensesSchema.statics.updateExpenses = function updateExpenses(expenses_id, data){
    const update = Expenses.findOneAndUpdate({_id: expenses_id}, data);
    return update;
}

expensesSchema.statics.deleteExpenses = function deleteExpenses(expenses_id, data){
    const del = Expenses.findOneAndDelete({_id: expenses_id});
    return del;
}

const Expenses = mongoose.model('Expense', expensesSchema);

module.exports={
    exepensesValidation,
    Expenses
}