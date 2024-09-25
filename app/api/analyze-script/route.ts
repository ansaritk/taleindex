import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize the OpenAI client with your API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,  // Ensure your API key is stored in an environment variable
});

export async function POST(req: NextRequest) {
  try {
    // Parse the incoming form data from the request
    const formData = await req.formData();
    const briefFile = formData.get('brief');
    const scriptFile = formData.get('script');

    // Check if the form data contains files and they are instances of File
    if (!(briefFile instanceof File) || !(scriptFile instanceof File)) {
      return NextResponse.json({ error: 'Files are required' }, { status: 400 });
    }

    // Read the file contents
    const briefText = await briefFile.text();
    const scriptText = await scriptFile.text();

    // Call OpenAI's API to analyze the marketing brief and script
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a marketing analysis assistant.' },
        { role: 'user', content: `Analyze the following marketing brief:\n\n${briefText}` },
        { role: 'user', content: `Analyze the following marketing script:\n\n${scriptText}` },
      ],
    });

    // Extract the results from the response
    const analysisResult = completion.choices[0].message?.content || 'No analysis result';

    // Dummy alignment score and recommendations (replace with actual logic if needed)
    const alignmentScore = Math.floor(Math.random() * 10) + 1;  // Random score between 1 and 10
    const recommendations = 'Here are some recommendations based on the analysis...';

    // Send the response back with the analysis result, score, and recommendations
    return NextResponse.json({
      briefAnalysis: `Brief Analysis: ${analysisResult}`,
      scriptAnalysis: `Script Analysis: ${analysisResult}`,
      alignmentScore: alignmentScore,
      recommendations: recommendations,
    });

  } catch (error) {
    console.error('Error during the analysis process:', error);
    return NextResponse.json({ error: 'An error occurred while processing your request.' }, { status: 500 });
  }
}
