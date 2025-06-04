// utils/upload.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Define custom storage logic
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const userId = req.body.userId || 'anonymous';
    const date = new Date().toISOString().split('T')[0]; // e.g., 2025-06-04
    const dir = path.join(__dirname, '..', 'uploads', userId, date);

    // Ensure directory exists
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  }
});

// Multer upload middleware for multiple files
const uploadMultiple = multer({ storage }).array('files', 10); // Accepts up to 10 files

module.exports = uploadMultiple;
