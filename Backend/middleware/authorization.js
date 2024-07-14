const { sendErrorResponse } = require("../utils/response");

module.exports = (roles) => {
  return async (req, res, next) => {
    try {
      console.log(req.user)
      if (!roles.includes(req.user.role)) {
        throw new Error("You are not authorized to perform this operation");
      }
      next();
    } catch (error) {
      sendErrorResponse(res, error.message, 403);
    }
  };
};
