import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A user must have a name'],
  },
  email: {
    type: String,
    required: [true, 'A user must have a email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please enter a valid email'],
  },
  photo: {
    type: String,
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minLength: 8,
  },
  confirmPassword: {
    type: String,
    required: [true, 'Please confirm password'],
    validate: {
      // #### Will work on save/create only ###
      validator: function (el) {
        return el === this.password; // abc === abc -> true
      },
      message: 'Passwords are not same',
    },
  },
});

userSchema.pre('save', async function (next) {
  /** To see if the password is modified or not*/
  if (!this.isModified('password')) {
    return next();
  }

  /** Hash the passowrd */
  this.password = await bcrypt.hash(this.password, 15);

  /** Now this field 'confirmPassword' will not be persisted in the database */
  this.confirmPassword = undefined;
});

const User = mongoose.model('User', userSchema);

export default User;
