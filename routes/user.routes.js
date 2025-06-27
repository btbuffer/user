const { Router } = require("express");
// const authenticateUser = require("../middleware/auth");

const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  loginUser,
} = require("../controller/user.controller");
const router = Router();

router.post("/api/users/register", createUser);
router.post("/api/users/auth", loginUser);
router.get("/api/users", getUsers);
router.get("/api/users/:userId", getUser);
router.put("/api/users/:id", updateUser);
router.delete("/api/users/:id", deleteUser);

module.exports = router;
