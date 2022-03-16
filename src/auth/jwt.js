import UsersModel from "../services/user/schema.js";

export async function JwtMiddleware(req, res, next) {
  try {
    if (!req.headers.authorization) {
      const error = new Error("No auth headers");
      error.status = 401;
      next(error);
    } else {
      const token = req.headers.authorization.replace("Bearer ", "");

      console.log(token);

      const decoded = await verifyJwt(token);

      console.log(decoded);
      const user = await UsersModel.findById(decoded.id);

      console.log(user);

      req.user = user;

      next();
    }
  } catch (error) {
    next(error);
  }
}
