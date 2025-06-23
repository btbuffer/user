const jwt = require("jsonwebtoken");

const verifyUser = (request, response, next) => {
  const {
    cookies: { token },
  } = request;

  try {
    const { userId } = jwt.verify(token, process.env.SECRET);
    request.user = { userId };
  } catch (err) {
    request.user = undefined;
  }

  next();
};

module.exports = verifyUser;
