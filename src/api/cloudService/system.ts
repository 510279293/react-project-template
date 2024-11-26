import { request } from "@/plugins"
import { APIPREFIX } from "../common"

// 根据厂商获取所有地区
export const envGetRegion = (params?: any) => request.post(`${APIPREFIX}/cloudEnviron/getRegion`, params)

// 云环境接入校验
export const envCheck = (params?: any) => request.post(`${APIPREFIX}/cloudEnviron/check`, params)

// 云环境接入
export const envAccess = (params?: any) => request.post(`${APIPREFIX}/cloudEnviron/access`, params)

// 云环境管理-资源池管理列表
export const envPoolPageList = (params?: any) => request.post(`${APIPREFIX}/cloudEnviron/resourcePoolList`, params)

// 云环境管理-删除
export const envPoolDel = (params?: any) => request.post(`${APIPREFIX}/cloudEnviron/delResourcePool`, params)

// 云环境管理-资源池详情
export const envPoolDetailById = (params?: any) => request.get(`${APIPREFIX}/cloudEnviron/detail`, {params})

// 云环境管理-资源池管理-同步
export const envPoolSync = (params?: any) => request.post(`${APIPREFIX}/cloudEnviron/synchronousAccount`, params)

// 云环境管理-用户周报
export const userReport = (params?: any) => request.post(`${APIPREFIX}/cloudManage/userWeekReportList`, params)
