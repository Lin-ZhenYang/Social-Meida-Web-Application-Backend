const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required']
  },
  headline: {
    type: String
  },
  email: {
  	type: String,
  	required:[true, 'Email data is required']
  },
  zipcode: {
  	type: Number,
  	required:[true, 'Zipcode data is required']
  },
  dob:{
    type: String,
    required:[true, 'Dob data is required']
  },
  avatar:{
  	type: String
  },
  phone:{
    type: String
  },
  followed:[{type:String}]
})

module.exports = profileSchema;