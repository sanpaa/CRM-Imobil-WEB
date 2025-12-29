const express = require('express');
const multer = require('multer');
const path = require('path');

const router = express.Router();

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    // Aceita apenas imagens
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Apenas imagens são permitidas'));
    }
  }
});

router.post(
  '/',
  (req, res, next) => {
    upload.array('images', 10)(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === 'UNEXPECTED_FIELD') {
          return res.status(400).json({ 
            error: 'Campo inválido. Use "images" para enviar arquivos' 
          });
        }
        return res.status(400).json({ error: err.message });
      } else if (err) {
        return res.status(500).json({ error: err.message });
      }
      next();
    });
  },
  (req, res) => {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'Nenhuma imagem enviada' });
    }

    const imageUrls = req.files.map(
      file => `/uploads/${file.filename}`
    );

    res.json({ imageUrls });
  }
);

module.exports = router;