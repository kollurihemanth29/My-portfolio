const mongoose = require('mongoose');

const PortfolioSchema = new mongoose.Schema({
  // Personal Information
  personalInfo: {
    name: {
      type: String,
      required: [true, 'Please add your name'],
      trim: true,
      maxlength: [100, 'Name cannot be more than 100 characters']
    },
    title: {
      type: String,
      required: [true, 'Please add your professional title'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters']
    },
    email: {
      type: String,
      required: [true, 'Please add your email'],
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email'
      ]
    },
    phone: {
      type: String,
      trim: true
    },
    location: {
      type: String,
      trim: true
    },
    bio: {
      type: String,
      maxlength: [1000, 'Bio cannot be more than 1000 characters']
    },
    profileImage: {
      type: String,
      default: '/api/placeholder/300/300'
    }
  },

  // Social Links
  socialLinks: {
    github: {
      type: String,
      trim: true
    },
    linkedin: {
      type: String,
      trim: true
    },
    twitter: {
      type: String,
      trim: true
    },
    portfolio: {
      type: String,
      trim: true
    },
    resume: {
      type: String,
      trim: true
    }
  },

  // Experience
  experience: [{
    title: {
      type: String,
      required: true,
      trim: true
    },
    company: {
      type: String,
      required: true,
      trim: true
    },
    location: {
      type: String,
      trim: true
    },
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date
    },
    current: {
      type: Boolean,
      default: false
    },
    description: {
      type: String,
      maxlength: [500, 'Description cannot be more than 500 characters']
    },
    technologies: [{
      type: String,
      trim: true
    }]
  }],

  // Education
  education: [{
    degree: {
      type: String,
      required: true,
      trim: true
    },
    institution: {
      type: String,
      required: true,
      trim: true
    },
    location: {
      type: String,
      trim: true
    },
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date
    },
    current: {
      type: Boolean,
      default: false
    },
    gpa: {
      type: Number,
      min: 0,
      max: 10
    },
    description: {
      type: String,
      maxlength: [300, 'Description cannot be more than 300 characters']
    }
  }],

  // Settings
  settings: {
    isPublic: {
      type: Boolean,
      default: true
    },
    theme: {
      type: String,
      enum: ['light', 'dark', 'auto'],
      default: 'light'
    },
    showEmail: {
      type: Boolean,
      default: true
    },
    showPhone: {
      type: Boolean,
      default: true
    }
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
PortfolioSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Create indexes for better performance
PortfolioSchema.index({ 'personalInfo.email': 1 });
PortfolioSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Portfolio', PortfolioSchema);