import { AxiosResponse, AxiosRequestConfig } from "../types"

class AxiosError extends Error {
  isAxiosError: Boolean
  config: AxiosRequestConfig
  code?: string | null
  request?: any
  response?: AxiosResponse
  constructor(
    message: string,
    config: AxiosRequestConfig,
    code?: string | null,
    request?: any,
    response?: AxiosResponse
  ) {
    super(message)
    this.isAxiosError = true
    this.config = config
    this.code = code
    this.request = request
    this.response = response
    Object.setPrototypeOf(this, AxiosError.prototype)
  }
}
export function createError(
  message: string,
  config: AxiosRequestConfig,
  code?: string | null,
  request?: any,
  response?: AxiosResponse
) {
  return new AxiosError(message, config, code, request, response)
}