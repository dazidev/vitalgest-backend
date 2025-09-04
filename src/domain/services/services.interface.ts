
export interface LoginServiceResponse {
  success: boolean
    data: object
    accessToken: string
    refreshToken: string
}

export interface TokenServiceResponse {
  accessToken: string
  refreshToken: string
}