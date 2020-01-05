import { AxiosRequestConfig } from "../types";
import { isPlainObject, deepMerge } from "../helpers/util";

const starts = Object.create(null)

function defaultStart(val1: any, val2: any): any {
  return typeof val2 !== 'undefined' ? val2 : val1
}

function fromVal2Start(val1: any, val2: any): any {
  if (typeof val2 !== 'undefined') return val2
}

function deepMergeStart(val1: any, val2: any): any {
  if (isPlainObject(val2)) {
    return deepMerge(val1, val2)
  }
  if (typeof val2 !== 'undefined') {
    return val2
  }
  if (isPlainObject(val1)) {
    return deepMerge(val1, val2)
  }
  if (typeof val1 !== 'undefined') {
    return val1
  }
}


const startKeysFromVal2 = ['url', 'params', 'data']
const startKeysDeepMerge = ['headers']

startKeysFromVal2.forEach(key => {
  starts[key] = fromVal2Start
})
startKeysDeepMerge.forEach(key => {
  starts[key] = deepMergeStart
})

export function mergeConfig(config1: AxiosRequestConfig, config2?: AxiosRequestConfig): AxiosRequestConfig {
  if (!config2) {
    config2 = {}
  }
  const config = Object.create(null)
  for (let key in config2) {
    mergeField(key)
  }
  for (let key in config1) {
    if (!config2[key]) {
      mergeField(key)
    }
  }
  function mergeField(key: string): void {
    const start = starts[key] || defaultStart
    config[key] = start(config1[key], config2![key])
  }
  return config
}