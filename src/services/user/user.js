import express from "express";
import createHttpError from "http-errors";
import UsersModel from "./schema.js";
import BlogsModel from "../blog/schema.js";
import { basicAuthMiddleware } from "../../auth/basic.js";
import { adminOnlyMiddleware } from "../../auth/admin.js";
import { authenticateUser } from "../../auth/tools.js";
import { JWTAuthMiddleware } from "../../auth/token.js";

const usersRouter = express.Router();

usersRouter.post("/", async (req, res, next) => {
  try {
    const newUser = new UsersModel(req.body);
    const { _id } = await newUser.save();
    res.status(201).send(newUser);
  } catch (error) {
    next(error);
  }
});

usersRouter.get(
  "/",
  basicAuthMiddleware,
  adminOnlyMiddleware,
  async (req, res, next) => {
    try {
      const user = await UsersModel.find();
      res.send(user);
    } catch (error) {
      next(error);
    }
  }
);

usersRouter.post("/:userId/comment", async (req, res, next) => {
  try {
    const findBlog = await BlogsModel.findById(req.body.blogId, {
      _id: 0,
    });
    if (findBlog) {
      const commentToInsert = {
        ...req.body,
        commentDate: new Date(),
      };
      console.log(commentToInsert);

      const modifiedUser = await UsersModel.findByIdAndUpdate(
        req.params.userId,
        { $push: { comment: commentToInsert } },
        { new: true }
      );
      if (modifiedUser) {
        res.send(modifiedUser);
      } else {
        next(
          createHttpError(404, `User with Id ${req.params.userId} not found!`)
        );
      }
    } else {
      next(createHttpError(404, `Book with Id ${req.body.blogId} not found!`));
    }
  } catch (error) {
    next(error);
  }
});

usersRouter.get("/:userId/comment", async (req, res, next) => {
  try {
    const user = await UsersModel.findById(req.params.userId);
    if (user) {
      res.send(user.comment);
    } else {
      res.status(404).send(`User with id ${req.params.userId} not found!`);
    }
  } catch (error) {
    next(error);
  }
});

usersRouter.put("/:userId/comment/:commentId", async (req, res, next) => {
  try {
    const user = await UsersModel.findById(req.params.userId);
    if (user) {
      const index = user.comment.findIndex(
        (comment) => comment._id.toString() === req.params.commentId
      );

      if (index !== -1) {
        user.comment[index] = {
          ...user.comment[index].toObject(),
          ...req.body,
        };

        await user.save();
        res.send(user);
      } else {
        next(
          createHttpError(
            404,
            `Comment with id ${req.params.commentId} not found!`
          )
        );
      }
    } else {
      next(
        createHttpError(404, `User with id ${req.params.userId} not found!`)
      );
    }
  } catch (error) {
    next(error);
  }
});

// me

usersRouter.get("/me", basicAuthMiddleware, async (req, res, next) => {
  try {
    res.send(req.user);
  } catch (error) {
    next(error);
  }
});

usersRouter.get("/me/stories", basicAuthMiddleware, async (req, res, next) => {
  try {
    const posts = await BlogsModel.find({ user: req.user._id.toString() });

    res.status(200).send(posts);
  } catch (error) {
    next(error);
  }
});

usersRouter.put("/me", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const user = await UsersModel.findByIdAndUpdate(req.user._id, req.body, {
      new: true,
    });
    res.send(user);
  } catch (error) {
    next(error);
  }
});

usersRouter.delete("/me", JWTAuthMiddleware, async (req, res, next) => {
  try {
    await UsersModel.findByIdAndDelete(req.user._id);
    res.send();
  } catch (error) {
    next(error);
  }
});

usersRouter.post("/login", async (req, res, next) => {
  try {
    // 1. Obtain credentials from req.body
    const { email, password } = req.body;

    // 2. Verify credentials
    const user = await UsersModel.checkCredentials(email, password);

    if (user) {
      // 3. If credentials are ok we are going to generate an Access Token and send it as a response
      const accessToken = await authenticateUser(user);
      res.send({ accessToken });
    } else {
      // 4. If credentials are not fine --> throw an error (401)
      next(createError(401, "Credentials are not ok!"));
    }
  } catch (error) {
    next(error);
  }
});

export default usersRouter;
