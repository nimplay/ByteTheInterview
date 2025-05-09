/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.DEEPSEEK_API_KEY,
  defaultHeaders: {
    "HTTP-Referer": "https://bytetheinterview.netlify.app/",
    "X-Title": "ByteTheInterview"
  },
  timeout: 30000 // 30 segundos
})

export async function POST(req: Request) {
  
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  }


  if (req.method === 'OPTIONS') {
    return new NextResponse(null, { headers })
  }

  try {
    if (!process.env.DEEPSEEK_API_KEY) {
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 401, headers }
      )
    }

    const { question, topic, context } = await req.json()

    if (!question || !topic) {
      return NextResponse.json(
        { error: 'Question and topic are required' },
        { status: 400, headers }
      )
    }

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 30000)


    const completion = await openai.chat.completions.create({
      model: 'deepseek/deepseek-chat-v3-0324',
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
      max_tokens: 500,
      temperature: 0.3
    }, { signal: controller.signal })

    clearTimeout(timeout)

    if (!completion.choices?.[0]?.message?.content) {
      throw new Error('Empty response from API')
    }

    return NextResponse.json({
      explanation: completion.choices[0].message.content
    }, { headers })
  } catch (error: any) {
    console.error('[DEEPSEEK_API_ERROR]', error)

    const status = error.name === 'AbortError' ? 504 : 500
    const errorMessage = error.name === 'AbortError'
      ? 'Request timeout'
      : error.message || 'API service error'

    return NextResponse.json(
      {
        error: 'AI service unavailable',
        details: errorMessage,
        suggestion: 'Please try again later'
      },
      { status, headers }
    )
  }
}
