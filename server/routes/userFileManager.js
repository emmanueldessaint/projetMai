const express = require("express");
const router = express.Router();
const multer = require("multer"); // pour gérer le téléchargement de fichiers
const auth = require("../middlewares/auth"); // middleware pour vérifier le token JWT
const Picture = require("../models/Picture"); // modèle Mongoose pour les images

// Configuration de Multer pour gérer le téléchargement de fichiers
// const storage = multer.diskStorage({
// 	destination: (req, file, cb) => {
// 		cb(null, "uploads/");
// 	},
// 	filename: (req, file, cb) => {
// 		const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
// 		cb(null, uniqueSuffix + "-" + file.originalname);
// 	},
// });
// const upload = multer({ storage });

const upload = multer({ dest: 'client/public/uploads/' });

// Route pour télécharger une image
router.get("/download/:id", auth, async (req, res) => {
	try {
		const image = await Picture.findById(req.params.id);
		if (!image) {
			return res.status(404).json({ message: "Image not found" });
		}
		res.sendFile(image.filename, { root: "uploads/" });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Server error" });
	}
});

// Route pour récupérer toutes les images d'un utilisateur
router.get("/all", async (req, res) => {
	try {
		const images = await Picture.find({ isPrivate: false });
		res.json(images);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Server error' });
	}
});

router.get("/all/:token", async (req, res) => {
	console.log(req.params.token)
	try {
		const images = await Picture.find({ userToken: req.params.token });
		res.json(images);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Server error' });
	}
});

// Route pour poster une image
router.post('/upload', upload.single('image'), async (req, res) => {
	try {
		const { filename, originalname, mimetype, size } = req.file;
		const { token, private } = req.body;

		const newImage = new Picture({
			filename,
			originalName: originalname,
			mimetype,
			size,
			userToken: token,
			isPrivate: private,
		});

		const savedImage = await newImage.save();
		res.json(savedImage);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Server error' });
	}
});

router.delete('/delete/:filename', upload.single('image'), async (req, res) => {
	const { filename } = req.params;
	
	try {
		const deletedImage = await Picture.deleteOne({ filename });

		if (deletedImage) {
			res.json({ message: 'Image deleted successfully' });
		} else {
			res.status(404).json({ message: 'Image not found' });
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Server error' });
	}
});

router.put('/modify/:filename', upload.single('image'), async (req, res) => {
	const { filename } = req.params;

  try {
    const image = await Picture.findOne({ filename });

    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }

    image.isPrivate = !image.isPrivate;
    await image.save();

    res.json({ message: 'Image updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Route pour mettre à jour une image
router.put("/:id", auth, async (req, res) => {
	try {
		const image = await Picture.findById(req.params.id);
		if (!image) {
			return res.status(404).json({ message: "Image not found" });
		}
		if (image.user.toString() !== req.user.id) {
			return res.status(401).json({ message: "Not authorized" });
		}
		image.originalName = req.body.originalName;
		const savedImage = await image.save();
		res.json(savedImage);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Server error" });
	}
});

// Route pour supprimer une image
router.delete("/:id", auth, async (req, res) => {
	try {
		const image = await Picture.findById(req.params.id);
		if (!image) {
			return res.status(404).json({ message: "Image not found" });
		}
		if (image.user.toString() !== req.user.id) {
			return res.status(401).json({ message: "Not authorized" });
		}
		await image.remove();
		res.json({ message: "Image deleted" });
	} catch (error) {
		console.log(error);
	}
});

module.exports = router;
