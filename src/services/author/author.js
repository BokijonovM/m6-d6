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

authorsRouter.get("/", async (req, res, next) => {
  try {
    const authors = await AuthorModel.find();
    res.send(authors);
  } catch (error) {
    next(error);
  }
});

authorsRouter.get("/:authorId", async (req, res, next) => {
  try {
    const author = await AuthorModel.findById(req.params.authorId);
    if (author) {
      res.send(author);
    } else {
      res.status(404).send(`Author not found1`);
    }
  } catch (error) {
    next(error);
  }
});

authorsRouter.put("/:authorId", async (req, res, next) => {
  try {
    const updatedAuthor = await AuthorModel.findByIdAndUpdate(
      req.params.authorId,
      req.body,
      {
        new: true,
      }
    );
    if (updatedAuthor) {
      res.send(updatedAuthor);
    } else {
      res.status(404).send(`Author not found!`);
    }
  } catch (error) {
    next(error);
  }
});

authorsRouter.delete("/:authorId", async (req, res, next) => {
  try {
    const deletedAuthor = await AuthorModel.findOneAndDelete(
      req.params.authorId
    );
    if (deletedAuthor) {
      res.status(204).send(`Author deleted!`);
    } else {
      res.status(404).send(`Author not found!`);
    }
  } catch (error) {
    next(error);
  }
});
export default authorsRouter;
