export interface ErrorObject {
    error: {
      data: {
        error_code: string
        message: string
        status_code: number
        timestamp: string
        path: string
        back_trace: string
      }
    }
  }

  export interface ErrorObjectRegister {
    error: {
      data: string
    }
  }