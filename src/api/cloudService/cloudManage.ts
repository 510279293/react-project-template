import { request } from "@/plugins"
import { APIPREFIX } from "../common"

// 云管理-资源管理列表
export const cloudManagePageList = (params?: any) => request.post(`${APIPREFIX}/cloudManage/list`, params)

// 云管理-资源管理-同步
export const cloudManageSync = (params?: any) => request.post(`${APIPREFIX}/cloudManage/synchronous`, params)
