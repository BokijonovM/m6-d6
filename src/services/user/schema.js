import mongoose from "mongoose";
import bcrypt from "bcrypt";

const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    role: { type: String, enum: ["User", "Admin"], default: "User" },
    googleId: { type: String },
    comment: [
      {
        commentText: { type: String, required: true },
        rate: { type: Number, min: 1, max: 5, required: true },
        commentDate: { type: Date },
      },
    ],
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  const newUser = this;
  const plainPw = newUser.password;

  if (newUser.isModified("password")) {
    const hash = await bcrypt.hash(plainPw, 11);
    newUser.password = hash;
  }

  next();
});

userSchema.methods.toJSON = function () {
  const userDocument = this;
  const userObject = userDocument.toObject();

  delete userObject.password;
  delete userObject.__v;

  return userObject;
};

userSchema.statics.checkCredentials = async function (email, plainPW) {
  const user = await this.findOne({ email });

  if (user) {
    const isMatch = await bcrypt.compare(plainPW, user.password);

    if (isMatch) {
      return user;
    } else {
      return null;
    }
  } else {
    return null;
  }
};

export default model("User", userSchema);
