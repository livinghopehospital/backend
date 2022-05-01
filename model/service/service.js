const mongoose = require("mongoose");

const serviceRenderSchema = new mongoose.Schema({
  service_name: { type: String, required: true },
  service_price: {type:Number, required:true},
  branch: {type:String, required:true},
  service_categories: {type:mongoose.Types.ObjectId, required:true}
});

serviceRenderSchema.statics.addServices = function addServices(services) {
  const service = servicesRendered(services);
  const savedService = service.save();

  return savedService;
};

serviceRenderSchema.statics.findServices = async function findService(branch) {
  // Get all the services rendered.
  const service = await servicesRendered.find({branch});
  return service;
};

serviceRenderSchema.statics.updateService = async function updateService(
  id,
  data
) {
  // Find a service and update.
  const service = await servicesRendered.findOneAndUpdate({ _id: id }, data);
  return service;
};

serviceRenderSchema.statics.deleteService = async function deleteService(id) {
  const service = await servicesRendered.findOneAndDelete({ _id: id });
  return service;
};

const servicesRendered = mongoose.model("services", serviceRenderSchema);

module.exports = servicesRendered;
