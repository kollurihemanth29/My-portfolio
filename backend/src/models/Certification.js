const mongoose = require('mongoose');

const CertificationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a certification title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  provider: {
    type: String,
    required: [true, 'Please add a certification provider'],
    trim: true,
    maxlength: [100, 'Provider cannot be more than 100 characters']
  },
  issueDate: {
    type: Date,
    required: [true, 'Please add the issue date']
  },
  expiryDate: {
    type: Date
  },
  credentialId: {
    type: String,
    trim: true,
    maxlength: [100, 'Credential ID cannot be more than 100 characters']
  },
  credentialUrl: {
    type: String,
    trim: true
  },
  skills: [{
    type: String,
    trim: true
  }],
  description: {
    type: String,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  badge: {
    type: String,
    default: '🏅'
  },
  status: {
    type: String,
    enum: ['active', 'expired', 'pending'],
    default: 'active'
  },
  category: {
    type: String,
    enum: ['Programming', 'Frontend', 'Backend', 'Database', 'Cloud', 'DevOps', 'Mobile', 'Design', 'Security', 'Testing', 'Other'],
    default: 'Programming'
  },
  featured: {
    type: Boolean,
    default: false
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
CertificationSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Create indexes for better performance
CertificationSchema.index({ featured: -1 });
CertificationSchema.index({ category: 1 });
CertificationSchema.index({ status: 1 });
CertificationSchema.index({ provider: 1 });
CertificationSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Certification', CertificationSchema);