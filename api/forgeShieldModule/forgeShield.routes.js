const express = require("express");
const router = express.Router();
const uploadMultiple = require('../../utils/upload');

const {
  forgeShieldDocument
} = require("./forgeShield.controller");

router.post("/forgeShield", uploadMultiple, forgeShieldDocument);
module.exports = router;
