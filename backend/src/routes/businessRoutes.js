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
router.get('/:id', getBusinessById);

// Protected routes - Business Owner only
router.post('/', protect, businessOwnerOnly, upload.single('logo'), createBusiness);
router.get('/my/profile', protect, businessOwnerOnly, getMyBusiness);
router.put('/:id', protect, businessOwnerOnly, upload.single('logo'), updateBusiness);
router.delete('/:id', protect, businessOwnerOnly, deleteBusiness);

module.exports = router;
