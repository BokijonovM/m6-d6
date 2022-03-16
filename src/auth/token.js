import createError from "http-errors";
import { verifyJWTToken } from "./tools.js";

export const JWTAuthMiddleware = async (req, res, next) => {
  // 1. Check if Authorization header is in the request, if it is not --> 401

  if (!req.headers.authorization) {
    next(
      createError(401, "Please provide bearer token in authorization header!")
    );
  } else {
    try {
      // 2. Extract token from Authorization header
      const token = req.headers.authorization.replace("Bearer ", "");

      // 3. Verify the token (verify expiration date and check signature integrity), if everything is fine we should get back the payload ({_id, role})
      const payload = await verifyJWTToken(token);

      // 4. If token is ok --> next
      req.user = {
        _id: payload._id,
        role: payload.role,
      };
      next();
    } catch (error) {
      // 5. In case of errors thrown by the jsonwebtoken module --> 401
      console.log(error);
      next(createError(401, "Token not valid!"));
    }
  }
};
