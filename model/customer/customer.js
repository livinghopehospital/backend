

const mongoose = require('mongoose');
const schema = mongoose.Schema;


const newCustomerSchema = new schema({
    first_name: {type: String, required:true},
    last_name: {type:String, required:true},
    branch:{type:String},
    email: {type: String, required:true},
    address: {type:String, required:true},
    phone_number: {type:String, required:true}
});


newCustomerSchema.statics.createNewCustomer = async function createNewCustomer(customerDetails,metadata){
    const {first_name, last_name,email,address,phone_number}=customerDetails
    const {branch} = metadata
    const customer = new  Customer({
        first_name,
        last_name,
        branch,
        email,
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

newCustomerSchema.statics.updateCustomer = async function updateCustomer(data, id) {
    const updatedCustomer = await Customer.findOneAndUpdate({_id:id}, data);
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