const { Router } = require("express");
const userRouters = require("./user.routes");
const postRouters = require("./post.routes");
const kycRouters = require("./kyc.routes");

const router = Router();
router.use(userRouters);
router.use(postRouters);
router.use(kycRouters);

module.exports = router;
