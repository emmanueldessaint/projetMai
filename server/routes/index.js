var express = require("express");
var router = express.Router();
const app = express();
const usersRouter = require("./users");
const picturesRouter = require("./userFileManager");
/* GET home page. */
router.get("/", function (req, res, next) {
	res.render("index", { title: "Express" });
});

module.exports = router;
