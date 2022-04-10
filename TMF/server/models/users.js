const mongoose = require ('mongoose');

const UserSchema = mongoose.Schema({
  userid : {type:Number, required: true},
  username: { type: String, required: true, unique: true },
  password : String,
  userlogo:  String,
});

UserSchema.index({ username: -1 });

const User = mongoose.model(
  'User',
  UserSchema
);

module.exports = User;
