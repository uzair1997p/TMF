const mongoose = require ('mongoose');

const CustomerSchema = mongoose.Schema({
  business_name: { type: String, required: true, unique: true },
  contact_name:  {
    type: String,
    default : ""
  },
  customer_address:  {
    type: String,
    default : ""
  },
  customer_email : {
    type: String,
    default : ""
  },
  customer_contact_no: 
  {
    type: String,
    default : ""
  },
  filename_1 : 
  {
    type: String,
    default : ""
  },
  file_1 : 
  {
    type: Object,
    default: {}
  },
  filename_2 : 
  {
    type: String,
    default : ""
  },
  file_2 : 
  {
    type: Object,
    default: {}
  },
  filename_3 : 
  {
    type: String,
    default : ""
  },
  file_3 : 
  {
    type: Object,
    default: {}
  },
  filename_4 : 
  {
    type: String,
    default : ""
  },
  file_4 : 
  {
    type: Object,
    default: {}
  },
  filename_5 : 
  {
    type: String,
    default : ""
  },
  file_5 : 
  {
    type: Object,
    default: {}
  },
  filename_6 : 
  {
    type: String,
    default : ""
  },
  file_6 : 
  {
    type: Object,
    default: {}
  },
  filename_7 : 
  {
    type: String,
    default : ""
  },
  file_7 : 
  {
    type: Object,
    default: {}
  },
  filename_8 : 
  {
    type: String,
    default : ""
  },
  file_8 : 
  {
    type: Object,
    default: {}
  },
  filename_9 : 
  {
    type: String,
    default : ""
  },
  file_9 : 
  {
    type: Object,
    default: {}
  },
  filename_10 : 
  {
    type: String,
    default : ""
  },
  file_10 : 
  {
    type: Object,
    default: {}
  },
  user_id: Number,
});

CustomerSchema.index({ business_name: -1 });

const Customer = mongoose.model(
  'Customer',
  CustomerSchema
);

module.exports = Customer;
