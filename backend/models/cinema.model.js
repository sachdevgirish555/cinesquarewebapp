const mongoose = require("mongoose");

const cinemaSchema = new mongoose.Schema(
  {
    city: {
      type: String,
      required: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
    },
    phone: {
      type: [String],
      required: true,
    },
    img: {
      type: String, // stored image path
      required: true,
    },

    social: [
      {
        icon: {
          type: String,
          required: true,
        },
        link: {
          type: String,
          default: "",
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cinema", cinemaSchema);