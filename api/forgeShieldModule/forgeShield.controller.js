
const asyncHandler = require("../../middleware/async");
const multer = require('multer');
const path = require('path');
const fs = require('fs');


exports.forgeShieldDocument = asyncHandler(async (req, res, next) => {
  const { userId } = req.body;
  const filePaths = req.files.map(file => file.path);

  console.log('filePats', filePaths)

  res.status(201).json({
    success: true,
    message: 'File uploaded successfully'
  });
});

