import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.DEEPSEEK_API_KEY,
});

export const getDeepSeekResponse = async (
  question: string,
  topic: string,
  context?: string
): Promise<string> => {
  if (!process.env.DEEPSEEK_API_KEY) {
    throw new Error("❌ DeepSeek API key no configurada en .env.local");
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'deepseek/deepseek-r1:free',
      messages: [
        {
          role: "system",
          content: `Eres un experto en ${topic}. Responde de forma concisa para una entrevista técnica.`,
        },
        {
          role: "user",
          content: context
            ? `Pregunta: ${question}\nContexto: ${context}`
            : question,
        },
      ],
      max_tokens: 500,
      temperature: 0.3,
    });

    const response = completion.choices[0]?.message?.content;

    if (!response) {
      throw new Error("La API no devolvió una respuesta válida");
    }

    return response;
  } catch (error) {
    console.error("Error en la API de DeepSeek:", error);
    throw new Error(
      error instanceof Error
        ? error.message
        : "Error al conectar con DeepSeek. Intenta nuevamente."
    );
  }
};
