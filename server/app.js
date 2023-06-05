require("dotenv").config();
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const picturesRouter = require("./routes/userFileManager");
const mongoose = require("mongoose");

const app = express();
const port = 5000;

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());

mongoose
	.connect(process.env.MONGO_URL, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => {
		console.log("Connexion à la base de données réussie.");
	})
	.catch((error) => {
		console.log("Erreur de connexion à la base de données :", error);
	});

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/pictures", picturesRouter);

app.listen(port, () => {
	console.log(`App listening on port ${port}`);
});

module.exports = app;
