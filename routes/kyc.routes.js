const { Router } = require("express");

const { createKyc, getKyc } = require("../controller/kyc.controller");

const router = Router();
router.post("/api/kycs", createKyc);
router.get("/api/kycs/:kycID", getKyc);

module.exports = router;
