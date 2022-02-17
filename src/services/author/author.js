import express from "express";
import AuthorModel from "./schema.js";

const authorsRouter = express.Router();

authorsRouter.post("/", async (req, res, next) => {
  try {
    const newAuthor = new AuthorModel(req.body);
    const { _id } = await newAuthor.save();
    res.status(201).send(newAuthor);
  } catch (error) {
    next(error);
  }
});

export default authorsRouter;
