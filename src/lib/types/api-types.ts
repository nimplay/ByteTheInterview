export interface DeepSeekRequest {
  question: string
  topic: string
  context?: string
}

export interface DeepSeekResponse {
  explanation: string
}
