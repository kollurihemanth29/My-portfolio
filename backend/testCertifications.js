// Test certification controller
const mongoose = require('mongoose');
require('dotenv').config();

const testCertificationController = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Test loading the controller
    const certController = require('./src/controllers/certificationController');
    console.log('✅ Certification controller loaded');
    console.log('Available methods:', Object.keys(certController));

    // Test loading the Certification model
    const Certification = require('./src/models/Certification');
    console.log('✅ Certification model loaded');

    // Test fetching certifications
    const certifications = await Certification.find();
    console.log(`✅ Found ${certifications.length} certifications in database`);

    // Test featured certifications
    const featuredCerts = await Certification.find({ featured: true });
    console.log(`✅ Found ${featuredCerts.length} featured certifications`);

    featuredCerts.forEach(cert => {
      console.log(`- ${cert.title} (${cert.provider})`);
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.stack) {
      console.error('Stack:', error.stack);
    }
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

testCertificationController();