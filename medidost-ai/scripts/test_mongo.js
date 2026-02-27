require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');

async function test() {
    console.log('Testing MongoDB connection...');
    try {
        const client = new MongoClient(process.env.MONGODB_URI);
        await client.connect();
        const db = client.db('medidost');
        const count = await db.collection('users').countDocuments();
        console.log('✅ Connection Successful!');
        console.log(`👤 Found ${count} users registered.`);
        await client.close();
    } catch (err) {
        console.error('❌ Connection failed:', err.message);
    }
}
test();
