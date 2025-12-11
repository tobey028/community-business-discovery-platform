const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  price: {
    type: String,
    trim: true
  }
});

const businessSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Business name is required'],
    trim: true,
    minlength: [2, 'Business name must be at least 2 characters long']
  },
  description: {
    type: String,
    required: [true, 'Business description is required'],
    trim: true,
    minlength: [10, 'Description must be at least 10 characters long']
  },
  category: {
    type: String,
    required: [true, 'Business category is required'],
    enum: [
      'Restaurant',
      'Retail',
      'Healthcare',
      'Education',
      'Technology',
      'Beauty & Spa',
      'Automotive',
      'Real Estate',
      'Entertainment',
      'Professional Services',
      'Other'
    ]
  },
  location: {
    address: {
      type: String,
      required: [true, 'Address is required'],
      trim: true
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true
    },
    state: {
      type: String,
      trim: true
    },
    zipCode: {
      type: String,
      trim: true
    }
  },
  contact: {
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
    },
    website: {
      type: String,
      trim: true
    }
  },
  logo: {
    type: String,
    default: null
  },
  services: [serviceSchema],
  views: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
businessSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Business', businessSchema);
