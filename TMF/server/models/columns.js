const mongoose = require ('mongoose');

const ColumnsSchema = mongoose.Schema({
  sr_no : Number,
  column_name:  String,
  column_type: String,
  order_type: String,
  user_id : Number
});

ColumnsSchema.index({ sr_no: -1 });

const Columns = mongoose.model(
  'Columns',
  ColumnsSchema
);

module.exports = Columns;
