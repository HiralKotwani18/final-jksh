const jwt = require("jsonwebtoken");
const environment = require("../utils/environment");
const { sendErrorResponse } = require("../utils/response");

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || "";
    const token =
      (authHeader && authHeader.split(" ")[1]) || req.cookies["token"] || "";
    if (token) {
      let decoded = jwt.decode(token);
      jwt.verify(token, environment.jwt.secret, async (err, user) => {
        req.user = decoded;
        next();
      });
    } else {
      next();
    }
  } catch (error) {
    sendErrorResponse(res, "Unauthorized Access", 401);
  }
};
