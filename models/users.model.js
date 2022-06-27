const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  first_name: String,
  last_name: String,
  email: String,
  id: Number,
  address: String,
  role: String,
  picture: String,
  verified: Boolean,
  fired: Boolean,
});

const UserModel = mongoose.model("users_tbs", userSchema);

module.exports = UserModel;