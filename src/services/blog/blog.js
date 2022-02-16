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

blogRouter.get("/:blogId", async (req, res, next) => {
  try {
    const blogId = req.params.blogId;

    const blog = await BlogsModel.findById(blogId);
    if (blog) {
      res.send(blog);
    } else {
      next(createHttpError(404, `Blog with id ${blogId} not found!`));
    }
  } catch (error) {
    next(error);
  }
});

blogRouter.put("/:blogId", async (req, res, next) => {
  try {
    const blogId = req.params.blogId;
    const updatedBlog = await BlogsModel.findByIdAndUpdate(blogId, req.body, {
      new: true, // by default findByIdAndUpdate returns the record pre-modification, if you want to get back the newly updated record you should use the option new: true
    });
    if (updatedBlog) {
      res.send(updatedBlog);
    } else {
      next(createHttpError(404, `Blog with id ${blogId} not found!`));
    }
  } catch (error) {
    next(error);
  }
});

blogRouter.delete("/:blogId", async (req, res, next) => {
  try {
    const blogId = req.params.blogId;
    const deletedBlog = await BlogsModel.findByIdAndDelete(blogId);
    if (deletedBlog) {
      res.status(204).send(`Blog with id ${blogId} deleted!`);
    } else {
      next(createHttpError(404, `Blog with id ${blogId} not found!`));
    }
  } catch (error) {
    next(error);
  }
});

export default blogRouter;
