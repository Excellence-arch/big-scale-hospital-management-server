const { saveChat, getAllChats } = require("../controllers/chat.controller");
const { connectChat, register, login, getDashboard } = require("../controllers/users.controller");
const { verifyCode } = require("../controllers/verification.controller");

const router = require("express").Router();

router.post("/connect", connectChat);
router.post("/register", register);
router.post("/login", login);
router.post("/verify", verifyCode);
router.get("/get-dashboard", getDashboard)
router.post("/chat", saveChat);
router.get("/get-chats", getAllChats);

module.exports = router;