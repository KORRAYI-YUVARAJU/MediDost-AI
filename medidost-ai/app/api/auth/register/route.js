import clientPromise from '@/lib/mongodb';
import bcrypt from 'bcryptjs';

export async function POST(request) {
    try {
        const { name, email, password } = await request.json();

        if (!name || !email || !password) {
            return Response.json({ error: 'Missing fields' }, { status: 400 });
        }

        const client = await clientPromise;
        if (!client) {
            return Response.json({ error: 'Database not connected' }, { status: 500 });
        }

        const db = client.db('medidost');
        const users = db.collection('users');

        // Check if user exists
        const existingUser = await users.findOne({ email });
        if (existingUser) {
            return Response.json({ error: 'User already exists' }, { status: 400 });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Save user
        const result = await users.insertOne({
            name,
            email,
            password: hashedPassword,
            createdAt: new Date(),
        });

        return Response.json({ success: true, userId: result.insertedId }, { status: 201 });
    } catch (error) {
        console.error('Registration error:', error);
        return Response.json({ error: 'Internal server error' }, { status: 500 });
    }
}
