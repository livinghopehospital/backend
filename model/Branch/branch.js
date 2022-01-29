
const mongoose = require('mongoose');

const joi = require('joi');

const branchFieldValidation = joi.object({
   branch_name: joi.string().required(),
   address: joi.string().required(),
   manager_name: joi.string().required(),
   manager_phone: joi.string().required(),

});

const branchSchema = new mongoose.Schema({
     branch_name: {type: String, required:true},
     address: {type: String, required:true},
     manager_name: {type: String, required:true},
     manager_phone: {type: String, required:true},
});





branchSchema.statics.createBranch =  function createBranch(BranchDetails){
    return new Branch(BranchDetails);
    
}

branchSchema.statics.findBranches =async function findBranches(){
    const branch = await  Branch.find({});
    return branch;
}
branchSchema.statics.updateBranch =async function updateBranch(branchId,data){
    const branch =  await Branch.findOneAndUpdate({_id:branchId}, data);
    return branch;
}

branchSchema.statics.deleteBranch =async function deleteBranch(branchId){
    const branch =  await Branch.findOneAndDelete({_id:branchId});
    return branch;
}


const Branch = mongoose.model('Branch', branchSchema);
module.exports={
     Branch,
    branchFieldValidation
}