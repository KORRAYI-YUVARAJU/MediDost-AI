import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import bcrypt from 'bcryptjs';

export async function POST(request) {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return Response.json({ error: 'Missing credentials' }, { status: 400 });
        }

        const usersRef = collection(db, 'users');

        // Check user by email
        const q = query(usersRef, where('email', '==', email), limit(1));
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
            return Response.json({ error: 'Invalid email or password' }, { status: 401 });
        }

        const userDoc = snapshot.docs[0];
        const user = userDoc.data();

        // Compare password
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return Response.json({ error: 'Invalid email or password' }, { status: 401 });
        }

        // Return user details to set in frontend
        return Response.json({
            success: true,
            user: { id: userDoc.id, name: user.name, email: user.email }
        }, { status: 200 });

    } catch (error) {
        console.error('Login error:', error);
        return Response.json({ error: 'Internal server error' }, { status: 500 });
    }
}
