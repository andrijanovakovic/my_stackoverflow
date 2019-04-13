const jwt = require("jsonwebtoken");

// jwt secret
const jwt_secret_key = process.env.JWT_SECRET_KEY;

module.exports = (req, res, next) => {
	try {
		// will verify and decode and return decoded values
		const token = req.headers.authorization.split(" ")[1];
		const decoded_token = jwt.verify(token, jwt_secret_key);
		req.user_data = decoded_token;
		next();
	} catch (error) {
		return res.status(401).json({
			success: false,
			reason: "Auth failed!",
		});
	}
};
