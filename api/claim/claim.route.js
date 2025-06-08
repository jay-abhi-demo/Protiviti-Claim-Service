import express from 'express';
import multer from 'multer';
import fs from 'fs';
import { validateClaimNumber } from "./middleware.js";
import { handleClaimUpload } from "./claim.controller.js";

const router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const claimNumber = req.query.claim_number;
        const uploadPath = `./uploads/claim/claim_${claimNumber}`;
        // Create folder if it doesn't exist
        fs.mkdirSync(uploadPath, { recursive: true });
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname); // You could make this more unique if needed
    }
});

const upload = multer({ storage });

router.post('/upload', validateClaimNumber, upload.array('files'), handleClaimUpload);

export default router;
