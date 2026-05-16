const mongoose = require("mongoose");
const { Status, GENDER } = require("../config/constants");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      min: 2,
      max: 50,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(Status),
      default: Status.INACTIVE,
    },
    phone: {
      type: String,
    },
    gender: {
      type: String,
      enum: Object.values(GENDER),
    },
    dob: Date,
    activationToken: String,
    otp: String,
    forgetPasswordToken: String,
    expiryTime: Date,
    image: {
      publicId: String,
      secureUrl: String,
      optimizedUrl: String,
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      default: null,
    },
    updatedBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    autoCreate: true,
    autoIndex: true,
    timestamps: true,
  },
);

const UserModel = mongoose.model("User", UserSchema);

module.exports = UserModel;
