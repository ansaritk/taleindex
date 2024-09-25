import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize the OpenAI client with your API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,  // Ensure the API key is set in your environment
});

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const briefFile = formData.get('brief');
    const scriptFile = formData.get('script');

    if (!(briefFile instanceof File) || !(scriptFile instanceof File)) {
      return NextResponse.json({ error: 'Files are required' }, { status: 400 });
    }

    const briefText = await briefFile.text();
    const scriptText = await scriptFile.text();

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are an AI that analyzes marketing briefs and scripts.' },
        { role: 'user', content: `Brief: ${briefText}` },
        { role: 'user', content: `Script: ${scriptText}` },
      ],
    });

    const analysis = response.choices[0].message.content;

    return NextResponse.json({
      briefAnalysis: `Brief Analysis: ${analysis}`,
      scriptAnalysis: `Script Analysis: ${analysis}`,
      alignmentScore: Math.floor(Math.random() * 10) + 1,
      recommendations: 'Here are some recommendations based on the analysis.',
    });

  } catch (error) {
    return NextResponse.json({ error: 'An error occurred during analysis.' }, { status: 500 });
  }
}
