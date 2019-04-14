const fs = require("fs");
const jwt = require("jsonwebtoken");
const path = require("path");

// use 'utf8' to get string instead of byte array  (4096 bit key)
var privateKEY = fs.readFileSync(path.join(__dirname, "../misc/private.key"), "utf8");

module.exports = {
    /**
     * signs the token with given config,
     * subject is the email of the token user
     */
	sign: (payload, options) => {
		var signOptions = {
			issuer: "andr.nvk@gmail.com",
			subject: options.subject,
			audience: "http://localhost:5555/",
			expiresIn: "1h",
		};
		return jwt.sign(payload, privateKEY, signOptions);
    },
    /**
     * verifies if the given token is valid
     */
	verify: (token, options) => {
		var verifyOptions = {
			issuer: "andr.nvk@gmail.com",
			subject: options.subject,
			audience: "http://localhost:5555/",
			expiresIn: "1h",
        };
		try {
			return jwt.verify(token, privateKEY, verifyOptions);
		} catch (err) {
			return false;
		}
    },
    /**
     * decodes the given token so the data is visible
     */
	decode: (token) => {
		return jwt.decode(token, { complete: true });
	},
};
