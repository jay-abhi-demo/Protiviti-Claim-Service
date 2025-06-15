import express from 'express';
import multer from 'multer';
import fs from 'fs';
import { validateClaimNumber } from "./middleware.js";
import { handleClaimUpload } from "./claim.controller.js";
import { checkauth } from '../auth/middleware.js';
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
        const safeOriginalName = file.originalname.replace(/\s+/g, '_'); // replace spaces with underscores
        const filename = `${file.fieldname}_${safeOriginalName}`;
        cb(null, filename);
    }
});

const upload = multer({ storage }).any();

router.post('/upload', checkauth, validateClaimNumber, upload, handleClaimUpload);

export default router;
