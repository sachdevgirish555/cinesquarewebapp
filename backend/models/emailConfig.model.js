const mongoose = require("mongoose");

const emailConfigSchema = new mongoose.Schema(
  {
    emailUser: { type: String, required: true, trim: true },
    emailPass: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("EmailConfig", emailConfigSchema);
