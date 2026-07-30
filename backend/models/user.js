const mongoose = require("mongoose");
/* This function does not creates a actual collection in the database, it just creates a model(Blueprint) of the user schema.*/
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minLength: 8
  }
},
{
  timestamps: true
});

module.exports = mongoose.model("User", userSchema);