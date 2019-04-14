/**
 * main entry file for feri_my_stackoverflow
 */

// load environment file based on NODE_ENV
console.log(`Loading '${process.env.NODE_ENV}' environment variables...`);
require("custom-env").env(process.env.NODE_ENV);

if (!process.env.NODE_ENV) throw "NODE_ENV missing";
if (!process.env.DATABASE_URL) throw "DATABASE_URL missing";
if (!process.env.BCRYPT_SALT_ROUNDS) throw "BCRYPT_SALT_ROUNDS missing";

const express = require("express"); // express framework
const path = require("path"); // node path module
const logger = require("morgan"); // morgan express request logger
const mongoose = require("mongoose"); // mongoose odm for mongodb
const compression = require("compression"); //compresses http response
const helmet = require("helmet"); // provides basic security
const bodyParser = require("body-parser"); // request body parser

// import routing
const apiRouter = require("./routes/api");

// instantitate our app
const app = express();

// set logger
app.use(logger("dev"));

// parses body of the request
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// serve static files from ./public folder
app.use(express.static(path.join(__dirname, "public")));

// db
mongoose.connect(process.env.DATABASE_URL, {
	useNewUrlParser: true,
	useCreateIndex: true,
});

// compress routes
app.use(compression());

// security
app.use(helmet());

// setup routing
app.use("/api", apiRouter);

// default production handler for sending our compiled client
if (process.env.NODE_ENV === "production") {
	app.use(express.static("client/build"));
	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
	});
}

// error handler
app.use(function(err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get("env") === "development" ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render("error");
});

module.exports = app;
