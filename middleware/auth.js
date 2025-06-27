const jwt = require("jsonwebtoken");

const authenticateUser = (request, response, next) => {
  const {
    cookies: { token },
  } = request;

  /**
   * Replaced cookie token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODU4NTg3ZGRiZjg5ZjdkZDQ3ZGM2ZmEiLCJpc0FkbWluIjpmYWxzZSwiaWF0IjoxNzUwODM2NzgyLCJleHAiOjE3NTA4NDAzODJ9.ICq0gkYx_TUqZBhNxiRQgbdXQ6sq4dOY9LnQHseZbwY" for domain localhost, path /, expire 0
   * < Set-Cookie: token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODU4NTg3ZGRiZjg5ZjdkZDQ3ZGM2ZmEiLCJpc0FkbWluIjpmYWxzZSwiaWF0IjoxNzUwODM2NzgyLCJleHAiOjE3NTA4NDAzODJ9.ICq0gkYx_TUqZBhNxiRQgbdXQ6sq4dOY9LnQHseZbwY; Path=/; HttpOnly
   * eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODU4NTg3ZGRiZjg5ZjdkZDQ3ZGM2ZmEiLCJpc0FkbWluIjpmYWxzZSwiaWF0IjoxNzUwODMyOTAwLCJleHAiOjE3NTA4MzY1MDB9.h5sDCHYbwXpzuSKdpxY5qJjHZK2INQdvg-nGkvVVxP4
   */

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
