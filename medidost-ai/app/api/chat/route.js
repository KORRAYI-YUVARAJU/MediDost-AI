import { HfInference } from '@huggingface/inference';
import clientPromise from '@/lib/mongodb';
import { encryptPII } from '@/lib/encryption';

// Initialize the Hugging Face Inference client
const hf = new HfInference(process.env.HF_API_KEY);

const SYSTEM_PROMPT = `You are AI-MediDost, a friendly and knowledgeable medical AI assistant built for Indian users.

Your role:
- Explain medical lab reports, biomarkers, and health metrics in simple, plain language
- Be empathetic, clear, and never use heavy medical jargon
- Provide actionable advice (diet, lifestyle, when to see a doctor)
- Support multiple Indian languages when requested (Hindi, Telugu, Tamil, Bengali, Marathi)
- Always recommend consulting a qualified doctor for diagnosis or treatment
- Keep responses concise but complete (3-6 sentences for simple queries, more for complex ones)
- Use emojis sparingly to make responses friendly

If the user provides biomarker data or report context, use it to give personalised advice.
Never make definitive diagnoses. Always add a brief disclaimer for serious conditions.
Format: Use **bold** for key terms and values. Use bullet points for lists.`;

export async function POST(request) {
    try {
        const requestData = await request.json();
        const { message, history = [], reportContext = null, language = 'English', sessionId = 'anonymous' } = requestData;

        if (!message?.trim()) {
            return Response.json({ error: 'Message is required' }, { status: 400 });
        }

        // Build conversation history for Hugging Face
        const formattedHistory = history.map(msg => ({
            role: msg.from === 'user' ? 'user' : 'assistant',
            content: msg.text,
        }));

        // Build the full message with context
        let fullMessage = message;

        if (reportContext) {
            fullMessage = `[Patient Report Context: ${reportContext}]\n\nUser question: ${message}`;
        }

        if (language !== 'English') {
            fullMessage += `\n\n[Please respond in ${language} language]`;
        }

        const messages = [
            { role: 'system', content: SYSTEM_PROMPT },
            ...formattedHistory,
            { role: 'user', content: fullMessage },
        ];

        // We use the Qwen2.5-72B-Instruct model on HF's free inference API
        // It provides extremely fast and smart medical reasoning and streaming
        const stream = hf.chatCompletionStream({
            model: "Qwen/Qwen2.5-72B-Instruct",
            messages: messages,
            temperature: 0.7,
            max_tokens: 600,
        });

        // Convert the async iterable stream from HF into a native Web ReadableStream
        const encoder = new TextEncoder();
        const readableStream = new ReadableStream({
            async start(controller) {
                let aiResponseBuffer = '';
                try {
                    for await (const chunk of stream) {
                        const content = chunk.choices[0]?.delta?.content || '';
                        if (content) {
                            controller.enqueue(encoder.encode(content));
                            aiResponseBuffer += content;
                        }
                    }
                    controller.close();

                    // ── SAVE TO DATABASE SAFELY IN PII / PRIVACY MANNER ──
                    try {
                        const client = await clientPromise;
                        if (client) {
                            const db = client.db('medidost');
                            const chatCollection = db.collection('chats_pii_safe');

                            await chatCollection.insertOne({
                                sessionId: sessionId,
                                timestamp: new Date(),
                                language: language,
                                // Using securely encrypted text to adhere to user privacy rules
                                userMessageEncrypted: encryptPII(message),
                                aiResponseEncrypted: encryptPII(aiResponseBuffer),
                                contextUsedEncrypted: encryptPII(reportContext || 'none'),
                            });
                        }
                    } catch (dbError) {
                        console.error('Failed to log to PII-safe MongoDB:', dbError);
                    }

                } catch (e) {
                    controller.error(e);
                }
            }
        });

        return new Response(readableStream, {
            headers: {
                'Content-Type': 'text/plain; charset=utf-8',
                'Transfer-Encoding': 'chunked',
            },
        });

    } catch (error) {
        console.error('Hugging Face API error:', error);

        // Graceful fallback over stream
        const fallbackText = "🤖 I'm having trouble connecting to Hugging Face servers right now. Please wait a minute and try again.";
        const encoder = new TextEncoder();
        const readableStream = new ReadableStream({
            start(controller) {
                controller.enqueue(encoder.encode(fallbackText));
                controller.close();
            }
        });
        return new Response(readableStream, {
            headers: { 'Content-Type': 'text/plain; charset=utf-8' },
        });
    }
}
