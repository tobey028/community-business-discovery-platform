const Favorite = require('../models/Favorite');
const Business = require('../models/Business');

// Add business to favorites
exports.addFavorite = async (req, res, next) => {
  try {
    const { businessId } = req.params;

    // Check if business exists
    const business = await Business.findById(businessId);
    if (!business) {
      return res.status(404).json({
        success: false,
        message: 'Business not found'
      });
    }

    // Check if already favorited
    const existingFavorite = await Favorite.findOne({
      user: req.user._id,
      business: businessId
    });

    if (existingFavorite) {
      return res.status(400).json({
        success: false,
        message: 'Business already in favorites'
      });
    }

    const favorite = await Favorite.create({
      user: req.user._id,
      business: businessId
    });

    res.status(201).json({
      success: true,
      data: favorite
    });
  } catch (error) {
    next(error);
  }
};

// Remove business from favorites
exports.removeFavorite = async (req, res, next) => {
  try {
    const { businessId } = req.params;

    const favorite = await Favorite.findOneAndDelete({
      user: req.user._id,
      business: businessId
    });

    if (!favorite) {
      return res.status(404).json({
        success: false,
        message: 'Favorite not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Business removed from favorites'
    });
  } catch (error) {
    next(error);
  }
};

// Get user's favorites
exports.getFavorites = async (req, res, next) => {
  try {
    const favorites = await Favorite.find({ user: req.user._id })
      .populate({
        path: 'business',
        populate: {
          path: 'owner',
          select: 'name email'
        }
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: favorites.length,
      data: favorites
    });
  } catch (error) {
    next(error);
  }
};

// Check if business is favorited
exports.checkFavorite = async (req, res, next) => {
  try {
    const { businessId } = req.params;

    const favorite = await Favorite.findOne({
      user: req.user._id,
      business: businessId
    });

    res.status(200).json({
      success: true,
      isFavorited: !!favorite
    });
  } catch (error) {
    next(error);
  }
};
