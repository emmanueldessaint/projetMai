const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const auth = require("../middlewares/auth");
const { createToken } = require("../helpers/jwt");
var router = express.Router();

function generateRandomString(length) {
	let result = '';
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

	for (let i = 0; i < length; i++) {
		const randomIndex = Math.floor(Math.random() * characters.length);
		result += characters.charAt(randomIndex);
	}

	return result;
}

// Créer un nouvel utilisateur
router.post("/create", async (req, res) => {
	try {
		const { name, password } = req.body;

		// Vérifier si l'utilisateur existe déjà
		const existingUser = await User.findOne({ name });
		if (existingUser) {
			return res
				.status(400)
				.json({ message: "Cet utilisateur existe déjà" });
		}

		// Hasher le mot de passe avant de le stocker
		const hashedPassword = await bcrypt.hash(password, 10);
		const tokenUser = generateRandomString(40);
		// Créer un nouvel utilisateur avec le mot de passe hashé
		const newUser = new User({ name, password: hashedPassword, token: tokenUser });
		const savedUser = await newUser.save();
		res.json({ newUser: savedUser });
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: "Erreur serveur" });
	}
});

// LOGIN
router.post("/login", async (req, res) => {
	try {
		const { name, password } = req.body;
		const user = await User.findOne({ name });
		if (!user) throw Error("User not found");

		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) throw Error("Invalid credentials");

		res.status(200).json({ registeredUser: user });
	} catch (err) {
		res.status(400).json({ msg: err.message });
	}
});

router.delete('/delete/:id', async (req, res) => {
	const { id } = req.params;
  
	try {
	  const deletedUser = await User.findByIdAndDelete(id);
  
	  if (deletedUser) {
		res.status(200).json({ message: 'User deleted successfully' });
	  } else {
		res.status(404).json({ message: 'User not found' });
	  }
	} catch (error) {
	  console.error(error);
	  res.status(500).json({ message: 'Server error' });
	}
  });

module.exports = router;
