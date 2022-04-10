const mongoose = require ('mongoose');

const ProductSchema = mongoose.Schema({
  product_id :{type: Number, required:true},
  product_name: { type: String, required: true },
});

ProductSchema.index({ product_name: -1 });

const Product = mongoose.model(
  'Product',
  ProductSchema
);

module.exports = Product;
