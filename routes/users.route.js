const { connectChat, register, login } = require("../controllers/users.controller");
const { verifyCode } = require("../controllers/verification.controller");

const router = require("express").Router();

router.post("/connect", connectChat);
router.post("/register", register);
router.post("/login", login);
router.post("/verify", verifyCode);

module.exports = router;