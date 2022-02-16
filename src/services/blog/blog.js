import express from "express";
import createHttpError from "http-errors";
import BlogsModel from "./schema.js";

const blogRouter = express.Router();

export default blogRouter;
