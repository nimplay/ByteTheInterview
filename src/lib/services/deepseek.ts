import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.DEEPSEEK_API_KEY,
  defaultHeaders: {
    "HTTP-Referer": "https://bytetheinterview.netlify.app/",
    "X-Title": "ByteTheInterview"
  },
  timeout: 30000 // 30 segundos
});

export const getDeepSeekResponse = async (
  question: string,
  topic: string,
  context?: string
): Promise<string> => {
  if (!process.env.DEEPSEEK_API_KEY) {
    throw new Error("❌ DeepSeek API key not configured");
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'deepseek/deepseek-chat', // Cambiado de deepseek-r1:free
      messages: [
        {
          role: "system",
          content: `You are an expert in ${topic}. Provide concise answers for a technical interview.`,
        },
        {
          role: "user",
          content: context
            ? `Question: ${question}\nContext: ${context}`
            : question,
        },
      ],
      max_tokens: 500,
      temperature: 0.3,
    });

    const response = completion.choices[0]?.message?.content;

    if (!response) {
      throw new Error("The API did not return a valid response");
    }

    return response;
  } catch (error) {
    console.error("DeepSeek API error:", error);
    throw new Error(
      error instanceof Error
        ? error.message
        : "Error connecting to DeepSeek. Please try again."
    );
  }
};
