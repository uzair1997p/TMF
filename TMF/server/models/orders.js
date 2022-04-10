const mongoose = require ('mongoose');

const OrdersSchema = new mongoose.Schema({
  sr_no :{type: Number, required:true},
  customer_name :{type: String, required:true},
  product_name: String,
  codes: String,
  code_date:{
    type:Date,
    default: Date.now()
  },
  design : String,
  design_date :{
    type:Date,
    default: Date.now()
  },
  design_approval :{
    type:String,
    default: ''
  },
  design_approval_date :{
    type:Date,
    default: Date.now()
  },
  send_to_printer :{
    type:String,
    default: ''
  },
  send_to_printer_date :{
    type:Date,
    default: Date.now()
  },
  proof_approval :{
    type:String,
    default: ''
  },
  proof_approval_date :{
    type:Date,
    default: Date.now()
  },
  shipping : String,
  ship_date :{
    type:Date,
    default: Date.now()
  },
  received :{
    type:String,
    default: ''
  },
  received_date :{
    type:Date,
    default: Date.now()
  },
  completed : String,
  notes : String,
  printing :{
    type:String,
    default: ''
  },
  printing_date :{
    type:Date,
    default: Date.now()
  },
  stapling :{
    type:String,
    default: ''
  },
  stapling_date :{
    type:Date,
    default: Date.now()
  },
  user_id :{type: Number, required:true}
},{strict: false});

OrdersSchema.index({ sr_no: -1 });

const Orders = mongoose.model(
  'Orders',
  OrdersSchema
);

module.exports = Orders;
