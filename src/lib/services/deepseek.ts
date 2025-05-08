import { DeepSeekRequest, DeepSeekResponse } from '@/lib/types/api-types'

export const getDeepSeekResponse = async (
  question: string,
  topic: string
): Promise<string> => {
  // En producción, reemplazar con llamada real a la API
  if (process.env.NODE_ENV === 'development') {
    // Mock para desarrollo
    return `Esta sería la respuesta de DeepSeek para la pregunta sobre ${topic}: "${question}". En producción se conectaría a la API real.`
  }

  const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [
        {
          role: 'system',
          content: `Eres un experto en ${topic}. Responde de manera concisa (máx 300 caracteres) para entrevistas técnicas.`
        },
        {
          role: 'user',
          content: question
        }
      ],
      max_tokens: 150,
      temperature: 0.7
    })
  })

  if (!response.ok) {
    throw new Error('Failed to fetch DeepSeek response')
  }

  const data: DeepSeekResponse = await response.json()
  return data.choices[0].message.content
}
