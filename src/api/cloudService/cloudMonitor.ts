import { request } from "@/plugins"
import { APIPREFIX } from "../common"

// 云监控-概览
export const alarm = (params?: any) => request.post(`${APIPREFIX}/cloudMonitor/alarm`, params)

// 云监控-告警历史
export const alarmLog = (params?: any) => request.post(`${APIPREFIX}/cloudMonitor/alarmLog`, params)

// 云监控-告警历史
export const saveOrUpdateAlarm = (params?: any) => request.post(`${APIPREFIX}/cloudMonitor/saveOrUpdateAlarm`, params)

// 云监控-告警配置-删除
export const delAlarmConfiguration = (params?: any) => request.post(`${APIPREFIX}/cloudMonitor/delAlarmConfiguration`, params)

// 云监控-基础监控
export const basicMonitoring = (params?: any) => request.post(`${APIPREFIX}/cloudMonitor/basicMonitoring`, params)

// 云监控-获取产品列表
export const getMonitorProductList = (params?: any) => request.post(`${APIPREFIX}/cloudMonitor/productList`, params)

// 云监控-获取监控产品实例
export const getMonitorInstance = (params?: any) => request.get(`${APIPREFIX}/monitor_product/monitorProduct/getMonitorProductByProductId`, { params })

// 云监控-告警配置-新增/编辑
export const monitorConfigSave = (params?: any) => request.post(`${APIPREFIX}/cloudMonitor/saveOrUpdateAlarmConfiguration`, params)

// 云监控-告警历史
export const monitorHistory = (params?: any) => request.post(`${APIPREFIX}/cloudMonitor/alarmLog`, params)

// 云监控-账号列表
export const getAccountList = (params?: any) => request.post(`${APIPREFIX}/cloudMonitor/accountList`, params)