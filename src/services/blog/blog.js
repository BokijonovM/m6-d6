import express from "express";
import createHttpError from "http-errors";
import BlogsModel from "./schema.js";

const blogRouter = express.Router();

blogRouter.post("/", async (req, res, next) => {
  try {
    const newBlog = new BlogsModel(req.body);
    const { _id } = await newBlog.save();
    res.status(201).send(newBlog);
  } catch (error) {
    next(error);
  }
});

blogRouter.get("/", async (rea, res, next) => {
  try {
    const blogs = await BlogsModel.find();
    res.send(blogs);
  } catch (error) {
    next(error);
  }
});

export default blogRouter;
