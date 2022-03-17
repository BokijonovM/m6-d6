import express from "express";
import createHttpError from "http-errors";
import BlogsModel from "./schema.js";
import q2m from "query-to-mongo";
import { basicAuthMiddleware } from "../../auth/basic.js";
import { authenticateUser } from "../../auth/tools.js";
import { JWTAuthMiddleware } from "../../auth/token.js";

const blogRouter = express.Router();

blogRouter.post("/", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const newBlog = new BlogsModel({ ...req.body, user: req.user._id });
    const { _id } = await newBlog.save();
    res.status(201).send(newBlog);
  } catch (error) {
    next(error);
  }
});

blogRouter.get("/", async (req, res, next) => {
  try {
    const mongoQuery = q2m(req.query);
    const total = await BlogsModel.findBlogsWithUser(mongoQuery);
    const blogs = await BlogsModel.find(mongoQuery.criteria)
      .populate({
        path: "user",
        select: ["_id", "firstName", "lastName", "role", "email"],
      })
      .sort(mongoQuery.options.sort)
      .skip(mongoQuery.options.skip)
      .limit(mongoQuery.limit);
    // res.send(blogs);
    res.send({
      links: mongoQuery.links("/blog", total),
      total,
      totalPages: Math.ceil(total / mongoQuery.options.limit),
      blogs,
    });
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
