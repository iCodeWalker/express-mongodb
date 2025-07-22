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
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user',
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minLength: 8,
    select: false,
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
  passwordChangedAt: {
    type: Date,
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

/**
 * An instance method
 *
 * A method that is available on all the documents of a certain collection
 */

userSchema.methods.correctPassword = async function (
  enteredPassword,
  userPassword
) {
  // this keyword points to current document
  return await bcrypt.compare(enteredPassword, userPassword);
};

/**
 * Check if user has changed the password
 *
 */

userSchema.methods.changedPassword = function (JWTTimestamp) {
  /** Id the "passwordChangedAt" key does not exists than it means that the user has never changed
   * the password
   *
   * the "passwordChangedAt" key will exists only when a user changes it's password
   *
   * False means not changed
   */
  if (this.passwordChangedAt) {
    const passwordChangedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    // console.log(passwordChangedTimeStamp, JWTTimestamp, 'passwordChangedAt');
    return JWTTimestamp < passwordChangedTimeStamp;
  }

  return false;
};

const User = mongoose.model('User', userSchema);

export default User;
