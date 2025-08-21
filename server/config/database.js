const mongoose = require('mongoose');

const connectDB = async () => {
  console.log('🔄 Attempting to connect to MongoDB...');
  console.log(`📍 Database URI: ${process.env.MONGODB_URI}`);
  
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ MongoDB Connected Successfully!');
    console.log(`🌐 Host: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
    console.log(`🔌 Port: ${conn.connection.port}`);
    console.log(`📈 Connection State: ${conn.connection.readyState === 1 ? 'Connected' : 'Disconnected'}`);
    
    // Listen for connection events
    mongoose.connection.on('disconnected', () => {
      console.log('❌ MongoDB Disconnected');
    });

    mongoose.connection.on('error', (err) => {
      console.error('💥 MongoDB Connection Error:', err);
    });

    mongoose.connection.on('reconnected', () => {
      console.log('🔄 MongoDB Reconnected');
    });

  } catch (error) {
    console.error('💥 Failed to connect to MongoDB:');
    console.error(`   Error: ${error.message}`);
    console.error(`   Code: ${error.code}`);
    console.error(`   Host: ${error.hostname}`);
    console.error(`   Port: ${error.port}`);
    console.log('\n🔧 Troubleshooting Tips:');
    console.log('   1. Make sure MongoDB is running');
    console.log('   2. Check if the MongoDB URI is correct');
    console.log('   3. Verify MongoDB is accessible on the specified port');
    console.log('   4. Check firewall settings');
    process.exit(1);
  }
};

module.exports = connectDB; 