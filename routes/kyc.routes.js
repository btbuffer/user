const { Router } = require("express");

const authenticateUser = require("../middleware/auth");
const { createKyc, getKyc } = require("../controller/kyc.controller");

const router = Router();
router.post("/api/kycs", authenticateUser, createKyc);
router.get("/api/kycs/:kycID", authenticateUser, getKyc);

module.exports = router;
