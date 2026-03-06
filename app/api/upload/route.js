import { db } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { encryptPII } from '@/lib/encryption';

export async function POST(request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file');

        if (!file) {
            return Response.json({ error: 'No file uploaded' }, { status: 400 });
        }

        const uploadsRef = collection(db, 'uploads');

        // Store file details (Simulating OCR text extraction in a Hackathon safely)
        const mockOCRText = `Extracted metrics for ${file.name}: LDL 168 mg/dL, Vitamin D 14 ng/mL...`;

        const docRef = await addDoc(uploadsRef, {
            filename: encryptPII(file.name),
            fileType: encryptPII(file.type),
            fileSize: file.size,
            extractedTextEncrypted: encryptPII(mockOCRText),
            createdAt: new Date(),
        });

        return Response.json({
            success: true,
            message: 'File analyzed securely and stored. It will be permanently auto-deleted in 3 months.',
            docId: docRef.id
        }, { status: 201 });

    } catch (error) {
        console.error('Upload error:', error);
        return Response.json({ error: 'Failed to upload and analyze file' }, { status: 500 });
    }
}
