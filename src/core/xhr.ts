import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from "../types";
import { createError } from "../helpers/error";
import { parseHeaders } from "../helpers/headers";

export default function xhr(config: AxiosRequestConfig): AxiosPromise {
  return new Promise((resolve, reject) => {
    const { data, url, method = 'get', headers,
      responseType, timeout, cancelToken } = config

    const request = new XMLHttpRequest()
    request.responseType = responseType ? responseType : ''
    request.timeout = timeout ? timeout : 0

    request.open(method.toUpperCase(), url!, true)

    request.onreadystatechange = function handleLoad() {
      if (request.readyState !== 4) return
      if (request.status === 0) return
      const responseHeaders = parseHeaders(request.getAllResponseHeaders())
      const responseData = responseType !== 'text' ? request.response : request.responseText
      const response: AxiosResponse = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config,
        request
      }
      handleResponse(response)
    }

    request.ontimeout = function handleTimeout() {
      reject(createError(`time out of ${request.timeout}`, config, 'ECONNABORTED', request))
    }

    request.onerror = function handleError() {
      reject(createError('Network Error', config, null, request))
    }
    Object.keys(headers).forEach(name => {
      if (data === null && name.toLowerCase() === 'content-type') {
        delete headers[name]
      } else {
        request.setRequestHeader(name, headers[name])
      }
    })

    if (cancelToken) {
      cancelToken.promise.then(reason => {
        request.abort()
        reject(reason)
      })
    }
    request.send(data)
    function handleResponse(res: AxiosResponse): void {
      if (res.status >= 200 && res.status < 300) {
        resolve(res)
      } else {
        reject(createError(`request fail status code is ${request.status}`, config, null, request, res))
      }
    }
  })

}
