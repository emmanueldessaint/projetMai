const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Création et envoi du token JWT
const createToken = (user) => {
	// Création du payload du JWT
	const payload = {
		user: {
			id: user._id,
		},
	};

	// Création du token JWT avec une clé secrète
	const token = jwt.sign(payload, process.env.JWT_SECRET, {
		expiresIn: "1h", // Durée d'expiration du token
	});

	return token
};

module.exports = { createToken };
