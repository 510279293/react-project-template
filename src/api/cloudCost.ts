import { request } from "@/plugins";
import { APIPREFIX } from './common'

// diydo的共用接口
export const diyDo2Get = (params?: any) => request.post(`${APIPREFIX}/web/creater/diyDo2Get`, params)
// export const getTemplateDownloadUrl = (templateCode, type) => request.post(`${MANAGEURL}/web/dvm/getTemplateDownloadUrl`, {
//   templateCode: templateCode,
//   type: type
// })

// 表格模版的增删改查
export const applyBillPageList = (params?: any) => request.post('/tableGet', params)
export const applyBillUpdate = (params?: any) => request.post('/tableUpdate', params)
export const applyBillDel = (params?: any) => request.post('/tableDel', params)
export const applyBillDetail = (params?: any) => request.post('/getInfoById', params)

export const demoRoleGetPage = (params?: any) => request.post(`${APIPREFIX}/demo/sysRole/getPage`, params)
