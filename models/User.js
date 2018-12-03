const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const valid = require('validator');

// Create Schema
const UserSchema = new Schema({
  name:{
    type: String,
    required: true
  },
  email:{
      type: String,
      required : true,
      unique : true,
      validate : {
          validator : (v) =>{
              return valid.isEmail(v)
          },
          message : "${v} is not an email"
      }
  },
  password:{
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const User = mongoose.model('User', UserSchema);
module.exports = User;
