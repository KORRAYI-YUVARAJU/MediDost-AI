import clientPromise from '@/lib/mongodb';
import { encryptPII } from '@/lib/encryption';

export async function POST(request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file');

        if (!file) {
            return Response.json({ error: 'No file uploaded' }, { status: 400 });
        }

        const client = await clientPromise;
        if (!client) {
            return Response.json({ error: 'Database not connected' }, { status: 500 });
        }

        const db = client.db('medidost');
        const uploads = db.collection('uploads');

        // Ensure TTL Index exists: 90 days = 7776000 seconds
        await uploads.createIndex(
            { "createdAt": 1 },
            { expireAfterSeconds: 7776000 }
        );

        // Store file details (Simulating OCR text extraction in a Hackathon safely)
        const mockOCRText = `Extracted metrics for ${file.name}: LDL 168 mg/dL, Vitamin D 14 ng/mL...`;

        const result = await uploads.insertOne({
            filename: encryptPII(file.name),
            fileType: encryptPII(file.type),
            fileSize: file.size,
            extractedTextEncrypted: encryptPII(mockOCRText),
            createdAt: new Date(), // TTL index relies on this field
        });

        return Response.json({
            success: true,
            message: 'File analyzed securely and stored. It will be permanently auto-deleted in 3 months.',
            docId: result.insertedId
        }, { status: 201 });

    } catch (error) {
        console.error('Upload error:', error);
        return Response.json({ error: 'Failed to upload and analyze file' }, { status: 500 });
    }
}
