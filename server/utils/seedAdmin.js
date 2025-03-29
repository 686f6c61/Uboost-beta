const User = require('../models/user');
const bcrypt = require('bcryptjs');

/**
 * Creates an admin user if none exists in the database
 */
const seedAdmin = async () => {
  try {
    // Check if any admin user exists
    const adminExists = await User.findOne({ role: 'admin' });
    
    if (adminExists) {
      console.log('Admin user already exists');
      return;
    }
    
    // Create default admin user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('Admin@123', salt);
    
    const admin = await User.create({
      firstName: 'UBoost',
      lastName: 'Admin',
      email: 'uboost@00b.tech',
      password: hashedPassword,
      city: 'Madrid',
      country: 'Spain',
      role: 'admin',
      status: 'approved'
    });
    
    console.log(`Default admin user created: ${admin.email}`);
  } catch (err) {
    console.error('Error creating admin user:', err.message);
  }
};

module.exports = seedAdmin;
