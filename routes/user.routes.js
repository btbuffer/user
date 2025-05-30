#!/usr/bin/env node

const { Router } = require("express");
const {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} = require("../controller/user.controller");
const router = Router();

router.post("/user", createUser);
router.get("/user", getUsers);
router.put("/user/:id", updateUser);
router.delete("/user/:id", deleteUser);

module.exports = router;
