const { connectChat, register, login } = require("../controllers/users.controller");

const router = require("express").Router();

router.post("/connect", connectChat);
router.post("/register", register);
router.post("/login", login);

module.exports = router;