

const mongoose = require('mongoose');

const recordSchema = new mongoose.Schema({
    total_purchased: {type: Number, default: 0},

    total_amount_paid: {type:Number, default:0},

    net_balance: {type: Number, default: 0},

    customer: {type:mongoose.Types.ObjectId, ref:'customer'}

})

const healthRecordSchema = new mongoose.Schema({
    reg_id: {type:String},
    diagnosis: {type:String, required:true},
    prescription:{type:String, required:true},
    assigned_by:{type:String},
    customer_id: {type:mongoose.Types.ObjectId, ref:'customer', require:true},
    date:{ type: Date, default: mongoose.now()}
})


recordSchema.statics.createNewRecord = async function createNewRecord(customer){
    const newRec = await customerRecord({
        customer
    })

    const created = newRec.save();
    return created;
}

recordSchema.statics.updateRecord = async function updateRecord(customerId, data) {
    const record = customerRecord.findOneAndUpdate({customer:customerId}, data);
    return record;
}
recordSchema.statics.findRecord = async function findRecord(customerId,data) {
    const record =await customerRecord.findOne({customer:customerId}, data);
    return record;
}
recordSchema.statics.viewCustomerHistory = async function viewGistory(customerId,branch) {
 const history = await customerRecord.findOne({customer:customerId, branch});
 return history;
}

/**This feature is special to living hope.
 * 
 * 
 */
healthRecordSchema.statics.addHealtRecord = async function(data){
    const newRecord = new healtRecordModel({
        ...data,
    })
    return await newRecord.save();
}

healthRecordSchema.statics.listHealthRecord = async function listHealthRecord(customerId) {
     return await healtRecordModel.find({customer_id:customerId})
    .sort({_id:-1})
    .limit(50)
}


const customerRecord = mongoose.model('customer-record', recordSchema);
const healtRecordModel = mongoose.model('health-record', healthRecordSchema);

module.exports={
    customerRecord,
    healtRecordModel
}