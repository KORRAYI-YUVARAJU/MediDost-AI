import crypto from 'crypto';

// Use a secure 256-bit key from env, or a fallback for local development.
// In actual production, you MUST define ENCRYPTION_SECRET in your .env.
const rawKey = process.env.ENCRYPTION_SECRET || '13c9fb60573e32e5abfbdee2558667a42b10a2f4ab6cf2a33ebbb7dd884bc523';
const ENCRYPTION_KEY = Buffer.from(rawKey, 'hex');
const IV_LENGTH = 16;

export function encryptPII(text) {
    if (!text) return text;
    try {
        const iv = crypto.randomBytes(IV_LENGTH);
        const cipher = crypto.createCipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
        let encrypted = cipher.update(text, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        return iv.toString('hex') + ':' + encrypted;
    } catch (e) {
        console.error('Encryption Failed:', e);
        return text;
    }
}

export function decryptPII(text) {
    if (!text) return text;
    try {
        const textParts = text.split(':');
        const iv = Buffer.from(textParts.shift(), 'hex');
        const encryptedText = Buffer.from(textParts.join(':'), 'hex');
        const decipher = crypto.createDecipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
        let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    } catch (e) {
        return text; // fallback to raw string if it wasn't encrypted
    }
}
