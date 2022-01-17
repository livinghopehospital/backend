const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
   
    category: {type: String, required:true}

});





categorySchema.statics.addCategory = function addCategory(c){

    return new ExpenseCategory(c);
}

categorySchema.statics.findCategory = function findCategory(c){

    return ExpenseCategory.find({});
}

const ExpenseCategory = mongoose.model('Expense-category', categorySchema);
module.exports={
    ExpenseCategory
}