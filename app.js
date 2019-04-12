/**
 * main entry file for feri_my_stackoverflow
 */

// load environment file based on NODE_ENV
console.log("Loading", process.env.NODE_ENV, "environment...\n.env." + process.env.NODE_ENV);
require("custom-env").env(process.env.NODE_ENV);

const createError = require("http-errors"); // handles errors
const express = require("express"); // express framework
const path = require("path"); // node path module
const cookieParser = require("cookie-parser"); // parses website cookies
const lessMiddleware = require("less-middleware"); // enables us to use less instead of css
const logger = require("morgan"); // morgan express request logger
const mongoose = require("mongoose"); // mongoose odm for mongodb
const compression = require("compression"); //compresses http response
const helmet = require("helmet"); // provides basic security

// import routing
const indexRouter = require("./routes/index");
const apiRouter = require("./routes/api");

// instantitate our app
const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

// set logger
app.use(logger("dev"));

// parses body of the request
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// setup cookie parser
app.use(cookieParser());

// setup less loader
app.use(lessMiddleware(path.join(__dirname, "public")));

// serve static files from ./public folder
app.use(express.static(path.join(__dirname, "public")));

// compress routes
app.use(compression());

// security
app.use(helmet());

// setup routing
app.use("/", indexRouter);
app.use("/api", apiRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	next(createError(404));
});

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
