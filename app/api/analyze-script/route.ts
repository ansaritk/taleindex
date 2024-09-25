import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize the OpenAI client with your API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,  // Ensure the API key is set in your environment
});

export async function POST(req: NextRequest) {
  console.log("Received a POST request"); // Log to verify the request is being processed
  try {
    // Ensure the content-type is multipart/form-data
    if (!req.headers.get('content-type')?.includes('multipart/form-data')) {
      console.error("Invalid content type");
      return NextResponse.json({ error: 'Content-Type must be multipart/form-data' }, { status: 400 });
    }

    const formData = await req.formData();
    const briefFile = formData.get('brief');
    const scriptFile = formData.get('script');

    if (!(briefFile instanceof File) || !(scriptFile instanceof File)) {
      console.error("Missing or invalid files");
      return NextResponse.json({ error: 'Files are required' }, { status: 400 });
    }

    // Log file details for debugging
    console.log("Brief File:", briefFile);
    console.log("Script File:", scriptFile);

    const briefText = await briefFile.text();
    const scriptText = await scriptFile.text();

    // Log the extracted file content
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

    // Log the response from OpenAI
    console.log("OpenAI Response:", response);

    if (!response.choices || response.choices.length === 0) {
      throw new Error("Invalid response from OpenAI");
    }

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
