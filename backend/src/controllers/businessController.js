const Business = require('../models/Business');
const fs = require('fs').promises;
const path = require('path');

// @desc    Create a new business
// @route   POST /api/businesses
// @access  Private (Business Owner only)
exports.createBusiness = async (req, res, next) => {
  try {
    const { name, description, category, location, contact, services } = req.body;

    // Parse services if it's a string (from form-data)
    let parsedServices = services;
    if (typeof services === 'string') {
      parsedServices = JSON.parse(services);
    }

    // Parse location and contact if they're strings
    let parsedLocation = location;
    let parsedContact = contact;
    if (typeof location === 'string') {
      parsedLocation = JSON.parse(location);
    }
    if (typeof contact === 'string') {
      parsedContact = JSON.parse(contact);
    }

    // Check if business owner already has a business
    const existingBusiness = await Business.findOne({ owner: req.user._id });
    if (existingBusiness) {
      return res.status(400).json({
        success: false,
        message: 'You already have a business profile. Please update or delete it first.'
      });
    }

    const businessData = {
      owner: req.user._id,
      name,
      description,
      category,
      location: parsedLocation,
      contact: parsedContact,
      services: parsedServices || []
    };

    // Add logo if uploaded
    if (req.file) {
      businessData.logo = `/uploads/logos/${req.file.filename}`;
    }

    const business = await Business.create(businessData);

    res.status(201).json({
      success: true,
      data: business
    });
  } catch (error) {
    // Delete uploaded file if business creation fails
    if (req.file) {
      await fs.unlink(req.file.path).catch(console.error);
    }
    next(error);
  }
};

// @desc    Get all businesses with filters and pagination
// @route   GET /api/businesses
// @access  Public
exports.getBusinesses = async (req, res, next) => {
  try {
    const { category, city, keyword, sortBy, page = 1, limit = 10 } = req.query;

    // Build query
    const query = {};

    if (category) {
      query.category = category;
    }

    if (city) {
      query['location.city'] = new RegExp(city, 'i');
    }

    if (keyword) {
      query.$or = [
        { name: new RegExp(keyword, 'i') },
        { description: new RegExp(keyword, 'i') },
        { 'services.name': new RegExp(keyword, 'i') }
      ];
    }

    // Sort options
    let sort = {};
    if (sortBy === 'newest') {
      sort = { createdAt: -1 };
    } else if (sortBy === 'popular') {
      sort = { views: -1 };
    } else {
      sort = { createdAt: -1 }; // default
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const businesses = await Business.find(query)
      .populate('owner', 'name email')
      .sort(sort)
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Business.countDocuments(query);

    res.status(200).json({
      success: true,
      count: businesses.length,
      total,
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      data: businesses
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single business by ID
// @route   GET /api/businesses/:id
// @access  Public
exports.getBusinessById = async (req, res, next) => {
  try {
    const business = await Business.findById(req.params.id)
      .populate('owner', 'name email');

    if (!business) {
      return res.status(404).json({
        success: false,
        message: 'Business not found'
      });
    }

    // Increment views
    business.views += 1;
    await business.save();

    res.status(200).json({
      success: true,
      data: business
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update business
// @route   PUT /api/businesses/:id
// @access  Private (Owner only)
exports.updateBusiness = async (req, res, next) => {
  try {
    let business = await Business.findById(req.params.id);

    if (!business) {
      return res.status(404).json({
        success: false,
        message: 'Business not found'
      });
    }

    // Check ownership
    if (business.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this business'
      });
    }

    // Parse JSON fields if they come as strings
    const updateData = { ...req.body };
    if (typeof updateData.location === 'string') {
      updateData.location = JSON.parse(updateData.location);
    }
    if (typeof updateData.contact === 'string') {
      updateData.contact = JSON.parse(updateData.contact);
    }
    if (typeof updateData.services === 'string') {
      updateData.services = JSON.parse(updateData.services);
    }

    // Handle logo update
    if (req.file) {
      // Delete old logo if exists
      if (business.logo) {
        const oldLogoPath = path.join(__dirname, '../../', business.logo);
        await fs.unlink(oldLogoPath).catch(console.error);
      }
      updateData.logo = `/uploads/logos/${req.file.filename}`;
    }

    business = await Business.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: business
    });
  } catch (error) {
    // Delete uploaded file if update fails
    if (req.file) {
      await fs.unlink(req.file.path).catch(console.error);
    }
    next(error);
  }
};

// @desc    Delete business
// @route   DELETE /api/businesses/:id
// @access  Private (Owner only)
exports.deleteBusiness = async (req, res, next) => {
  try {
    const business = await Business.findById(req.params.id);

    if (!business) {
      return res.status(404).json({
        success: false,
        message: 'Business not found'
      });
    }

    // Check ownership
    if (business.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this business'
      });
    }

    // Delete logo if exists
    if (business.logo) {
      const logoPath = path.join(__dirname, '../../', business.logo);
      await fs.unlink(logoPath).catch(console.error);
    }

    await business.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Business deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get my business (for business owner)
// @route   GET /api/businesses/my/profile
// @access  Private (Business Owner only)
exports.getMyBusiness = async (req, res, next) => {
  try {
    const business = await Business.findOne({ owner: req.user._id })
      .populate('owner', 'name email');

    if (!business) {
      return res.status(404).json({
        success: false,
        message: 'You have not created a business profile yet'
      });
    }

    res.status(200).json({
      success: true,
      data: business
    });
  } catch (error) {
    next(error);
  }
};
