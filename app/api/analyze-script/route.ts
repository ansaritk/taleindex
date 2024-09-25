import { NextRequest, NextResponse } from 'next/server'
import { Configuration, OpenAIApi } from 'openai'

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})
const openai = new OpenAIApi(configuration)

export async function POST(req: NextRequest) {
  if (!configuration.apiKey) {
    return NextResponse.json({ error: 'OpenAI API key not configured' }, { status: 500 })
  }

  try {
    const formData = await req.formData()
    const brief = formData.get('brief') as File | null
    const script = formData.get('script') as File | null

    if (!brief || !script) {
      return NextResponse.json({ error: 'Both brief and script files are required' }, { status: 400 })
    }

    const briefContent = await brief.text()
    const scriptContent = await script.text()

    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a marketing expert that analyzes marketing briefs and scripts." },
        { role: "user", content: `Analyze the following marketing brief and script. Provide a brief analysis of each, an alignment score out of 10, and recommendations for improvement.

Brief:
${briefContent}

Script:
${scriptContent}

Format your response as follows:
Brief Analysis: [Your analysis here]
Script Analysis: [Your analysis here]
Alignment Score: [Score out of 10]
Recommendations: [Your recommendations here]` }
      ],
    })

    const analysisResult = completion.data.choices[0].message?.content?.trim() || 'Analysis failed'
    const [briefAnalysis, scriptAnalysis, alignmentScore, recommendations] = analysisResult.split('\n\n').map(item => item.split(': ')[1])

    return NextResponse.json({
      briefAnalysis,
      scriptAnalysis,
      alignmentScore,
      recommendations,
    })
  } catch (error: any) {
    console.error('Error:', error)
    return NextResponse.json({ error: error.message || 'An error occurred during analysis' }, { status: 500 })
  }
}
