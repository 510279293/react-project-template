import { request } from "@/plugins";
import { baseURLMock } from ".";

export const sysRoleList = (params?: any) => request.post(`${baseURLMock}/role/list`, params)
export const sysRoleAdd = (params?: any) => request.post(`${baseURLMock}/role/add`, params)
export const sysRoleDel = (params?: any) => request.post(`${baseURLMock}/role/del`, params)
export const sysRoleUpdate = (params?: any) => request.post(`${baseURLMock}/role/update`, params)
export const sysRoleAuthList = (params?: any) => request.post(`${baseURLMock}/role/queryOperationAuth`, params)

export const sysRoleAuthListByRole = (params?: any) => request.post(`${baseURLMock}/role/queryOperationAuthIdsByRole`, params)

export const sysRoleAuthUpdate = (params?: any) => request.post(`${baseURLMock}/role/editRoleOperationAuth`, params)

export const sysRoleGetDataAuth = (params?: any) => request.post(`${baseURLMock}/role/getDataPermission`, params)

export const sysRoleDataAuthSave = (params?: any) => request.post(`${baseURLMock}/role/saveDataPermission`, params)


// 数据字典
export const sysDictList = (params?: any) => request.post(`${baseURLMock}/dictionary/searchDict`, params)
export const sysDictListRight = (params?: any) => request.post(`${baseURLMock}/dictionary/searchDictRight`, params)
export const sysDictAdd = (params?: any) => request.post(`${baseURLMock}/dictionary/add`, params)
export const sysDictDelete = (params?: any) => request.post(`${baseURLMock}/dictionary/del`, params)
export const sysDictUpdate = (params?: any) => request.post(`${baseURLMock}/dictionary/update`, params)

export const sysDictOptionAdd = (params?: any) => request.post(`${baseURLMock}/dictionary/optionAdd`, params)

export const sysDictOptionUpdate = (params?: any) => request.post(`${baseURLMock}/dictionary/optionUpdate`, params)