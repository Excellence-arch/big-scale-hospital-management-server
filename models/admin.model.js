const mongoose = require("mongoose");

const adminSchema = mongoose.Schema({
  id: Number,
  name: String,
  password: String,
});

const AdminModel = mongoose.model("admin_tbs", adminSchema);

module.exports = AdminModel;