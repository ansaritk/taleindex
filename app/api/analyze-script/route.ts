import { NextRequest, NextResponse } from 'next/server';

// Function to generate random values for sentiment breakdown
function generateRandomSentiment() {
  return {
    positive: Math.random().toFixed(2),
    negative: Math.random().toFixed(2),
    neutral: Math.random().toFixed(2),
    compound: (Math.random() * 2 - 1).toFixed(2), // Compound value between -1 and 1
  };
}

// Function to generate random values for key metrics
function generateRandomKeyMetrics() {
  return {
    clarity: Math.floor(Math.random() * 6) + 5,
    relevance: Math.floor(Math.random() * 6) + 5,
    engagement: Math.floor(Math.random() * 6) + 5,
    persuasiveness: Math.floor(Math.random() * 6) + 5,
    creativity: Math.floor(Math.random() * 6) + 5,
    consistency: Math.floor(Math.random() * 6) + 5,
    emotionalImpact: Math.floor(Math.random() * 6) + 5,
  };
}

export async function POST(req: NextRequest) {
  console.log("Received a POST request");
  try {
    // Simulate file input handling
    const formData = await req.formData();
    const briefFile = formData.get('brief');
    const scriptFile = formData.get('script');

    // Ensure files are uploaded
    if (!briefFile || !scriptFile) {
      return NextResponse.json({ error: 'Files are required' }, { status: 400 });
    }

    // Generate random values for analysis
    const sentimentBreakdown = generateRandomSentiment();
    const keyMetrics = generateRandomKeyMetrics();
    const alignmentScore = Math.floor(Math.random() * 6) + 5;

    // Return the analysis results
    return NextResponse.json({
      sentimentBreakdown,
      keyMetrics,
      alignmentScore,
    });

  } catch (error) {
    return NextResponse.json({ error: 'An error occurred during analysis.' }, { status: 500 });
  }
}
