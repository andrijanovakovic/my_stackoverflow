/**
 * this middleware checks if there is a token in the request headers
 */

const jwt = require("../middleware/jwt");

module.exports = (req, res, next) => {
	// get token from request headers
	const token = req.headers.authorization.split(" ")[1];

	// decode token to get token user email
	const token_data = jwt.decode(token);

	// try to verify token
	const jwt_verify_result = jwt.verify(token, { subject: token_data.payload.email });

	// if verification failed
	if (jwt_verify_result === false) {
		return res.status(401).json({
			success: false,
			reason: "Auth failed!",
		});
	}

	// set user_data to result of verify
	req.user_data = jwt_verify_result;

	// proceed
	next();
};
