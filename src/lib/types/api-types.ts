export interface DeepSeekRequest {
    question: string
    topic: string
  }

  export interface DeepSeekResponse {
    choices: {
      message: {
        content: string
      }
    }[]
  }
