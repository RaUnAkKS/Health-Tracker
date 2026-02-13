require('dotenv').config();
const mongoose = require('mongoose');

const testDB = async () => {
    console.log('⏳ Testing MongoDB Connection...');
    console.log(`URI: ${process.env.MONGODB_URI.split('@')[1]}`); // Log only domain part for security

    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ MongoDB Connected Successfully!');
        console.log(`Host: ${mongoose.connection.host}`);
        console.log(`Database: ${mongoose.connection.name}`);

        // List collections to ensure we have read/write access
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('Collections:', collections.map(c => c.name));

        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error('❌ MongoDB Connection Failed:', error.message);
        console.log('💡 TIP: Check "Network Access" in MongoDB Atlas. Content blocked? Add 0.0.0.0/0 to whitelist.');
        process.exit(1);
    }
};

testDB();
