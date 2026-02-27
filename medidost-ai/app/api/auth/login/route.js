import clientPromise from '@/lib/mongodb';
import bcrypt from 'bcryptjs';

export async function POST(request) {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return Response.json({ error: 'Missing credentials' }, { status: 400 });
        }

        const client = await clientPromise;
        if (!client) {
            return Response.json({ error: 'Database not connected' }, { status: 500 });
        }

        const db = client.db('medidost');
        const users = db.collection('users');

        // Check user
        const user = await users.findOne({ email });
        if (!user) {
            return Response.json({ error: 'Invalid email or password' }, { status: 401 });
        }

        // Compare password
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return Response.json({ error: 'Invalid email or password' }, { status: 401 });
        }

        // Simplified for Hackathon - return user details to set in frontend
        return Response.json({
            success: true,
            user: { id: user._id, name: user.name, email: user.email }
        }, { status: 200 });

    } catch (error) {
        console.error('Login error:', error);
        return Response.json({ error: 'Internal server error' }, { status: 500 });
    }
}
