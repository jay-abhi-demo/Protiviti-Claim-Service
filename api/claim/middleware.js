// middlewares/validateClaimNumber.js
export function validateClaimNumber(req, res, next) {
    const claimNumber = req.query.claim_number;
  
    if (!claimNumber || typeof claimNumber !== 'string' || !claimNumber.trim()) {
      return res.status(400).json({ error: 'claim_number is required before uploading files' });
    }
  
    next(); // Proceed to multer
  }
  