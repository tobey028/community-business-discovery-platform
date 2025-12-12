const express = require('express');
const router = express.Router();
const {
  createBusiness,
  getBusinesses,
  getBusinessById,
  updateBusiness,
  deleteBusiness,
  getMyBusiness
} = require('../controllers/businessController');
const { protect, businessOwnerOnly } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public routes
router.get('/', getBusinesses);

// Protected routes - Business Owner only (MUST come before /:id routes)
router.get('/my/profile', protect, businessOwnerOnly, getMyBusiness);
router.post('/', protect, businessOwnerOnly, upload.single('logo'), createBusiness);
router.put('/:id', protect, businessOwnerOnly, upload.single('logo'), updateBusiness);
router.delete('/:id', protect, businessOwnerOnly, deleteBusiness);

// Public route for single business (MUST come after /my/profile)
router.get('/:id', getBusinessById);

module.exports = router;
