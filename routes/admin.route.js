const { getDashboard, changeRole } = require("../controllers/admin.controller");

const router = require("express").Router();

router.get("/dashboard", getDashboard);
router.post("/change-role", changeRole);

module.exports = router;