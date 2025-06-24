const jwt = require("jsonwebtoken");

const authenticateUser = (request, response, next) => {
  const {
    cookies: { token },
  } = request;

  try {
    const { userId, isAdmin } = jwt.verify(token, process.env.SECRET);
    request.user = { userId, isAdmin };
  } catch (err) {
    request.user = undefined;
  }

  // Check if a user is authenticated to perform this action.
  // Otherwise, respond with 401 status code: unauthorized,
  // i.e., client not authenticated.
  if (!request.user)
    return response.status(401).send({ msg: "Authentication required." });

  next();
};

module.exports = authenticateUser;
