const { Router } = require("express");
const userRouters = require("./user.routes");
const postRouters = require("./post.routes");

const router = Router();
router.use(userRouters);
router.use(postRouters);

module.exports = router;
