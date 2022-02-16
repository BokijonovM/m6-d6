import express from "express";
import createHttpError from "http-errors";
import BlogsModel from "./schema.js";

const blogRouter = express.Router();

blogRouter.get("/", async (rea, res, next) => {
  try {
    const blogs = await BlogsModel.find();
    res.send(blogs);
  } catch (error) {
    next(error);
  }
});

export default blogRouter;
