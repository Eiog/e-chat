/* eslint-disable no-console */

import type {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios'
import axios from 'axios'
import axiosTauriFetchAdapter from 'axios-tauri-fetch-adapter'

const BASE_PREFIX = window.isTauri ? import.meta.env.VITE_API_BASE_URL : import.meta.env.VITE_API_BASE_PREFIX
export const axiosInstance: AxiosInstance = axios.create({
  baseURL: BASE_PREFIX,
  timeout: 1000 * 30,
  headers: {
    'Content-Type': 'application/json',
  },
  adapter: window.isTauri ? axiosTauriFetchAdapter : undefined,
})

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const { token } = storeToRefs(useAppStore())
    if (token) {
      config.headers.setAuthorization(`Bearer ${token.value}`)
    }
    return config
  },
  (error: AxiosError) => {
    console.error('request-error', error)
    return Promise.reject(error)
  },
)

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log('response', response)
    return response.data
  },
  (error: AxiosError) => {
    console.error('response-error', error)
    window.$message.error(error.message)
    return Promise.reject(error)
  },
)

export function get<RES = any, REQ = object>(path: string, data?: REQ, config?: AxiosRequestConfig): Promise<RES> {
  return axiosInstance(path, {
    method: 'get',
    params: data,
    ...config,
  })
}
export function post<RES extends string | object>(path: string, data?: Record<string, any>, config?: AxiosRequestConfig): Promise<RES> {
  return axiosInstance(path, {
    method: 'post',
    data,
    ...config,
  })
}
