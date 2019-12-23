import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from "./types";

export default function xhr(config: AxiosRequestConfig): AxiosPromise {
  return new Promise((resolve, reject) => {
    const { data, url, method = 'get', headers, responseType, timeout } = config
    const request = new XMLHttpRequest()

    request.responseType = responseType ? responseType : ''
    request.timeout = timeout ? timeout : 0

    request.open(method.toUpperCase(), url, true)

    request.onreadystatechange = function handleLoad() {
      if (request.readyState !== 4) return
      if (request.status === 0) return
      const responseHeaders = request.getAllResponseHeaders()
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
      reject(new Error(`timeout of ${timeout} ms`))
    }

    request.onerror = function handleError() {
      reject(new Error('NetWork Error'))
    }


    Object.keys(headers).forEach(name => {
      if (!data && name.toLowerCase() === 'content-type') {
        delete headers[name]
      } else {
        request.setRequestHeader(name, headers[name])
      }
    })
    request.send(data)
    function handleResponse(res: AxiosResponse): void {
      if (res.status >= 200 && res.status < 300) {
        resolve(res)
      } else {
        reject(new Error(`request fail with status code is ${res.status}`))
      }
    }
  })

}
