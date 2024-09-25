import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize the OpenAI client with your API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  console.log("Received a POST request");

  try {
    // Ensure the content-type is multipart/form-data
    if (!req.headers.get('content-type')?.includes('multipart/form-data')) {
      console.error("Invalid content type");
      return NextResponse.json({ error: 'Content-Type must be multipart/form-data' }, { status: 400 });
    }

    const formData = await req.formData();
    const briefFile = formData.get('brief');
    const scriptFile = formData.get('script');

    // Handle file uploads using Buffer since File is not available in Node.js
    if (!briefFile || !scriptFile || !(briefFile instanceof Blob) || !(scriptFile instanceof Blob)) {
      console.error("Missing or invalid files");
      return NextResponse.json({ error: 'Files are required and must be valid' }, { status: 400 });
    }

    // Convert files to text or buffers
    const briefBuffer = Buffer.from(await briefFile.arrayBuffer());
    const scriptBuffer = Buffer.from(await scriptFile.arrayBuffer());

    const briefText = briefBuffer.toString('utf-8');
    const scriptText = scriptBuffer.toString('utf-8');

    console.log("Brief Text:", briefText);
    console.log("Script Text:", scriptText);

    // Call OpenAI API for analysis
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are an AI that analyzes marketing briefs and scripts.' },
        { role: 'user', content: `Brief: ${briefText}` },
        { role: 'user', content: `Script: ${scriptText}` },
      ],
    });

    const analysis = response.choices[0].message.content;

    // Return analysis and additional info
    return NextResponse.json({
      briefAnalysis: `Brief Analysis: ${analysis}`,
      scriptAnalysis: `Script Analysis: ${analysis}`,
      alignmentScore: Math.floor(Math.random() * 10) + 1, // Mock alignment score
      recommendations: 'Here are some recommendations based on the analysis.',
    });

  } catch (error) {
    console.error("Error during analysis:", error);
    return NextResponse.json({ error: 'An error occurred during analysis.', details: error.message }, { status: 500 });
  }
}
