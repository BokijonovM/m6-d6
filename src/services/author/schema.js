import mongoose from "mongoose";

const { Schema, model } = mongoose;

const AuthorSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    user: [
      {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        email: { type: String, required: true },
        dateOfBirth: { type: Date, required: false },
        age: { type: Number, min: 18, max: 65, required: true },
        professions: [String],
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default model("Author", AuthorSchema);
