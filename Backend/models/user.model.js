const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const constants = require("../utils/constants");

const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    fullName: { type: String },
    subUsersId: [
      {
        type: Schema.Types.ObjectId,
        ref: "user",
      },
    ],
    email: { type: String },
    mobileNumber: { type: String },
    password: { type: String, select: false },
    otp: { type: String, select: false },
    otpExpiredAt: { type: Date, select: false },
    otpRef: { type: String, select: false },
    // qr: { type: String, select: false },
    // qrCreatedOn: { type: String },
    role: {
      type: String,
      enum: constants.user.roles,
      default: constants.roles.user,
    },
    // isBlock: {
    //   type: Boolean,
    //   default: false,
    // },
    isParent: {
      type: Boolean,
      default: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    projectId: [
      {
        type: Schema.Types.ObjectId,
        ref: "project",
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

UserSchema.pre("save", function save(next) {
  const user = this;
  if (!user.isModified("password")) {
    return next();
  }
  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      return next(err);
    }
    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) {
        return next(err);
      }
      user.password = hash;
      next();
    });
  });
});

UserSchema.pre("save", function save(next) {
  const user = this;

  user.email = user.email.toLowerCase();
  next();
});

UserSchema.methods.comparePassword = function comparePassword(
  plainPassword,
  next
) {
  bcrypt.compare(plainPassword, this.password, (err, isMatch) => {
    next(err, isMatch);
  });
};

const UserModel = mongoose.model("user", UserSchema);

module.exports = UserModel;
