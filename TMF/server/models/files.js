const mongoose = require ('mongoose');

const FilesSchema = mongoose.Schema({
  customer_id: String,
  sr_no :Number,
  path:  String ,
  user_id : Number,
});

FilesSchema.index({ sr_no: -1 });

const Files = mongoose.model(
  'Files',
  FilesSchema
);

module.exports = Files;
