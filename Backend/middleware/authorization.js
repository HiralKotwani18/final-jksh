const { sendErrorResponse } = require("../utils/response");

module.exports = (roles) => {
  return async (req, res, next) => {
    try {
      console.log(req.user)
      if (!roles.includes(req.user.role)) {
        throw new Error("You are not authorized to perform this operation");
      }
      const session = await SessionModel.findById(req.user?.sessionId);
      if (!session) {
        sendErrorResponse(res, "You are not authorized to perform this operation", 401);
      }
      next();
    } catch (error) {
      sendErrorResponse(res, error.message, 403);
    }
  };
};
