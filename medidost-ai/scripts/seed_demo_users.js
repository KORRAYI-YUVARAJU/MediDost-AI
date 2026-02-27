require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

const URI = process.env.MONGODB_URI;

if (!URI) {
    console.error('No MONGODB_URI found in .env.local');
    process.exit(1);
}

const DEMO_USERS = [
    {
        name: 'Dr. Sarah Jenkins',
        email: 'sarah@demo.com',
        password: 'DemoPass123!'
    },
    {
        name: 'Rahul Sharma',
        email: 'rahul@demo.com',
        password: 'DemoPass123!'
    },
    {
        name: 'Guest User',
        email: 'guest@demo.com',
        password: 'DemoPass123!'
    }
];

async function seed() {
    const client = new MongoClient(URI);
    try {
        await client.connect();
        const db = client.db('medidost');
        const users = db.collection('users');

        let addedCount = 0;

        for (const u of DEMO_USERS) {
            const existing = await users.findOne({ email: u.email });
            if (!existing) {
                const hashedPassword = await bcrypt.hash(u.password, 10);
                await users.insertOne({
                    name: u.name,
                    email: u.email,
                    password: hashedPassword,
                    createdAt: new Date(),
                    isDemoAccount: true
                });
                addedCount++;
                console.log(`Created: ${u.email}`);
            } else {
                console.log(`Skipped (already exists): ${u.email}`);
            }
        }

        console.log(`\n✅ Seed complete! Added ${addedCount} demo users.`);

    } catch (err) {
        console.error('Seeding error:', err);
    } finally {
        await client.close();
    }
}

seed();
