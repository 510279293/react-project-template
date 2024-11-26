import { request } from "@/plugins"

export const headers = {'Content-Type': 'application/x-www-form-urlencoded'}
export const APIPREFIX = `/cloudy_manage`

// 获取产品树
export const getAllProductTree = (params?: any) => request.post(`${APIPREFIX}/cloudMonitor/productAndCategoryList`, params)

// 获取厂商列表
export const getAllProvider = (params?: any) => request.post(`${APIPREFIX}/cloudEnviron/providerList`, params)
