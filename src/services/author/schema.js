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
        comment: [
          {
            commentText: { type: String, required: true },
            rate: { type: Number, min: 1, max: 5, required: true },
            commentDate: { type: Date },
          },
        ],
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default model("Author", AuthorSchema);
