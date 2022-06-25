const mongoose = require("mongoose");

const verificationSchema = mongoose.Schema({
  id: Number,
  expired: Boolean,
  userId: Number,
  for: String,
});

const VerificationModel = mongoose.model("verification_tbs", verificationSchema);

module.exports = VerificationModel;