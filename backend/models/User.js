const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  VerificationToken:{
    type:String    
  },
  resetToken:{
    type:Number
  },
  resetTokenExpires:{
    type:Number
  }

});
userSchema.pre("save", async function (next) {
  try {
    if(!this.isModified('password')){
      return next()

    }
    const salt = await bcrypt.genSalt(10);
    const hashedpassword =  bcrypt.hashSync(this.password, salt);
    this.password = hashedpassword;
    next();
  } catch (err) {
    next(err);
  }
});

const User = mongoose.model("User", userSchema);

module.exports = User;

