const mongoose = require("mongoose");
const schema = mongoose.Schema;

const users = new schema({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  phone_no: {
    type: Number,
    required: true,
  },

  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const account = mongoose.model("User", users);

module.exports = account;
