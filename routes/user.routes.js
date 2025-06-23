const { Router } = require("express");
const verifyUser = require("../middleware/auth");

const {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  loginUser,
  homeTest,
} = require("../controller/user.controller");
const router = Router();

router.get("/user/cookies", homeTest);
router.post("/api/users", createUser);
router.post("/api/users/auth", loginUser);
router.get("/api/users", verifyUser, getUsers);
router.put("/api/users/:id", updateUser);
router.delete("/api/users/:id", deleteUser);

module.exports = router;
