const mongoose = require("mongoose");

const enquirySchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, lowercase: true },
    phone: { type: String, required: true },
    city: { type: String },
    state: { type: String },
    jobTitle: { type: String },
    company: { type: String },
    message: { type: String },
    category: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Enquiry", enquirySchema);