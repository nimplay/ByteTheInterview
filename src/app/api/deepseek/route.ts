import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.DEEPSEEK_API_KEY
})

export async function POST(req: Request) {
  try {
    // Verificar la API key
    if (!process.env.DEEPSEEK_API_KEY) {
      return NextResponse.json(
        { error: 'API key no configurada' },
        { status: 401 }
      )
    }

    // Parsear el cuerpo de la solicitud
    const { question, topic, context } = await req.json()

    if (!question || !topic) {
      return NextResponse.json(
        { error: 'Question and topic are required' },
        { status: 400 }
      )
    }

    // Llamar a la API de DeepSeek
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
      max_tokens: 500,  // Aumentamos los tokens para respuestas más completas
      temperature: 0.3
    })

    // Verificar que tenemos una respuesta válida
    if (!completion.choices?.[0]?.message?.content) {
      throw new Error('La API no devolvió una respuesta válida')
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
