import { NextResponse } from 'next/server'
import { getDeepSeekResponse } from '@/lib/services/deepseek'
import { DeepSeekRequest } from '@/lib/types/api-types'

export const runtime = 'edge' // Opcional: para Edge Runtime

export async function POST(req: Request) {
  try {
    const { question, topic } = (await req.json()) as DeepSeekRequest

    if (!question || !topic) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const explanation = await getDeepSeekResponse(question, topic)

    return NextResponse.json({ explanation })
  } catch (error) {
    console.error('[DEEPSEEK_API_ERROR]', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
