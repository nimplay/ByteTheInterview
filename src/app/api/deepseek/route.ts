import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.DEEPSEEK_API_KEY
})

export async function POST(req: Request) {
  try {
    // Verify API key
    if (!process.env.DEEPSEEK_API_KEY) {
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 401 }
      )
    }

    // Parse request body
    const { question, topic, context } = await req.json()

    if (!question || !topic) {
      return NextResponse.json(
        { error: 'Question and topic are required' },
        { status: 400 }
      )
    }

    // Call DeepSeek API
    const completion = await openai.chat.completions.create({
      model: 'deepseek/deepseek-r1:free',
      messages: [
        {
          role: 'system',
          content: `You are a ${topic} expert providing technical interview answers. Provide concise, clear explanations.`
        },
        {
          role: 'user',
          content: `${question}${context ? `\n\nContext: ${context}` : ''}`
        }
      ],
      max_tokens: 500,  // Increased tokens for more complete responses
      temperature: 0.3
    })

    // Verify we got a valid response
    if (!completion.choices?.[0]?.message?.content) {
      throw new Error('The API did not return a valid response')
    }

    return NextResponse.json({
      explanation: completion.choices[0].message.content
    })
  } catch (error) {
    console.error('[DEEPSEEK_API_ERROR]', error)
    return NextResponse.json(
      {
        error: 'Failed to get AI explanation',
        details: error instanceof Error ? error.message : 'Unknown error',
        suggestion: 'Please try again or check your API key'
      },
      { status: 500 }
    )
  }
}
