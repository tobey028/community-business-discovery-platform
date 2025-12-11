const express = require('express');
const router = express.Router();
const {
  addFavorite,
  removeFavorite,
  getFavorites,
  checkFavorite
} = require('../controllers/favoriteController');
const { protect, regularUserOnly } = require('../middleware/auth');

// All routes require authentication and regular user role
router.use(protect);
router.use(regularUserOnly);

router.get('/', getFavorites);
router.post('/:businessId', addFavorite);
router.delete('/:businessId', removeFavorite);
router.get('/check/:businessId', checkFavorite);

module.exports = router;
