import mongoose from "mongoose";

const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    dateOfBirth: { type: Date, required: false },
    age: { type: Number, min: 18, max: 65, required: true },
    professions: [String],
    purchaseHistory: [
      {
        asin: { type: String },
        title: { type: String },
        category: { type: String },
        purchaseDate: { type: Date },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default model("User", userSchema);
