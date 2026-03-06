import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, addDoc, limit } from 'firebase/firestore';
import bcrypt from 'bcryptjs';

export async function POST(request) {
    try {
        const { name, email, password } = await request.json();

        if (!name || !email || !password) {
            return Response.json({ error: 'Missing fields' }, { status: 400 });
        }

        const usersRef = collection(db, 'users');

        // Check if user exists
        const q = query(usersRef, where('email', '==', email), limit(1));
        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
            return Response.json({ error: 'User already exists' }, { status: 400 });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Save user to Firestore
        const docRef = await addDoc(usersRef, {
            name,
            email,
            password: hashedPassword,
            createdAt: new Date(),
        });

        return Response.json({ success: true, userId: docRef.id }, { status: 201 });
    } catch (error) {
        console.error('Registration error:', error);
        return Response.json({ error: 'Internal server error' }, { status: 500 });
    }
}
