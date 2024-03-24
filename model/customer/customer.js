

const mongoose = require('mongoose');
const schema = mongoose.Schema;


const newCustomerSchema = new schema({
    first_name: {type: String,required:true},
    last_name: {type:String,required:true},
    reg_id:{type:String, required:true},
    branch:{type:String, required:true},
    gender: {type: String,},
    age:{type:String},
    address: {type:String,},
    phone_number: {type:String,}
});


newCustomerSchema.statics.createNewCustomer = async function createNewCustomer(customerDetails,metadata){
    const {first_name, last_name,gender,age,address,phone_number,reg_id}=customerDetails
    const {branch} = metadata
    const customer = new  Customer({
        first_name,
        last_name,
        branch,
        reg_id,
        gender,
        age,
        address,
        phone_number
    });
    const c = customer.save()
    return c;
}

newCustomerSchema.statics.viewSingleCustomer = async function viewCustomer(id){
    const customer = await Customer.findOne({_id:id});
    return customer;
}

newCustomerSchema.statics.viewAllCustomer = async function viewAllCustomer(branch){
    const customer = await Customer.find({branch});
    return customer;
}
newCustomerSchema.statics.viewSingleCustomer = async function viewSingleCustomer(branch,reg_id){
    const customer = await Customer.findOne({branch, reg_id});
    return customer;
}

newCustomerSchema.statics.updateCustomer = async function updateCustomer(data, id) {
    const updatedCustomer = await Customer.findOneAndUpdate({_id:id}, data,{upsert:true});
    return updatedCustomer;
}

newCustomerSchema.statics.deleteCustomer = async function deleteCustomer(id) {
    const deletedCustomer = await Customer.findOneAndDelete({_id:id});
    return deletedCustomer;
}




const Customer = mongoose.model('customer', newCustomerSchema);

module.exports={
    Customer
}