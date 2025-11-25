const mongoose = require('mongoose');

const SkillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a skill name'],
    trim: true,
    unique: true,
    maxlength: [50, 'Skill name cannot be more than 50 characters']
  },
  category: {
    type: String,
    required: [true, 'Please add a skill category'],
    enum: ['Frontend', 'Backend', 'Database', 'DevOps', 'Mobile', 'Tools', 'Languages', 'Frameworks', 'Libraries', 'Cloud', 'Other'],
    default: 'Other'
  },
  proficiencyLevel: {
    type: Number,
    min: 1,
    max: 10,
    default: 5
  },
  yearsOfExperience: {
    type: Number,
    min: 0,
    default: 0
  },
  icon: {
    type: String,
    default: '💻'
  },
  description: {
    type: String,
    maxlength: [200, 'Description cannot be more than 200 characters']
  },
  featured: {
    type: Boolean,
    default: false
  },
  certifications: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Certification'
  }],
  projects: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  }],
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
SkillSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Create indexes for better performance
SkillSchema.index({ category: 1 });
SkillSchema.index({ featured: -1 });
SkillSchema.index({ proficiencyLevel: -1 });
SkillSchema.index({ name: 1 });

module.exports = mongoose.model('Skill', SkillSchema);