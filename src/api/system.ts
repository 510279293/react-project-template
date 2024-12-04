import { request } from "@/plugins";
import { baseURLMock } from ".";

// 角色 相关接口
export const sysRoleList = (params?: any) => request.post(`${baseURLMock}/role/list`, params)
export const sysRoleAdd = (params?: any) => request.post(`${baseURLMock}/role/add`, params)
export const sysRoleDel = (params?: any) => request.post(`${baseURLMock}/role/del`, params)
export const sysRoleUpdate = (params?: any) => request.post(`${baseURLMock}/role/update`, params)
export const sysRoleAuthList = (params?: any) => request.post(`${baseURLMock}/role/queryOperationAuth`, params)

export const sysRoleAuthListByRole = (params?: any) => request.post(`${baseURLMock}/role/queryOperationAuthIdsByRole`, params)

export const sysRoleAuthUpdate = (params?: any) => request.post(`${baseURLMock}/role/editRoleOperationAuth`, params)

export const sysRoleGetDataAuth = (params?: any) => request.post(`${baseURLMock}/role/getDataPermission`, params)

export const sysRoleDataAuthSave = (params?: any) => request.post(`${baseURLMock}/role/saveDataPermission`, params)


// 数据字典 相关 接口
export const sysDictList = (params?: any) => request.post(`${baseURLMock}/dictionary/searchDict`, params)
export const sysDictListRight = (params?: any) => request.post(`${baseURLMock}/dictionary/searchDictRight`, params)
export const sysDictAdd = (params?: any) => request.post(`${baseURLMock}/dictionary/add`, params)
export const sysDictDelete = (params?: any) => request.post(`${baseURLMock}/dictionary/del`, params)
export const sysDictUpdate = (params?: any) => request.post(`${baseURLMock}/dictionary/update`, params)

export const sysDictOptionAdd = (params?: any) => request.post(`${baseURLMock}/dictionary/optionAdd`, params)
export const sysDictOptionUpdate = (params?: any) => request.post(`${baseURLMock}/dictionary/optionUpdate`, params)
export const sysDictOptionDel = (params?: any) => request.post(`${baseURLMock}/dictionary/optionDel`, params)


// 组织架构 相关 接口
export const sysOrgTree = (params?: any) => request.post(`${baseURLMock}/org/tree`, params)
export const sysOrgDeptAdd = (params?: any) => request.post(`${baseURLMock}/org/deptAdd`, params)
export const sysOrgDeptDel = (params?: any) => request.post(`${baseURLMock}/org/deptDel`, params)
export const sysOrgDeptUpdate = (params?: any) => request.post(`${baseURLMock}/org/deptUpdate`, params)
export const sysOrgStaffPageList = (params?: any) => request.post(`${baseURLMock}/org/staffPageList`, params)
export const sysOrgStaffAdd = (params?: any) => request.post(`${baseURLMock}/org/staffAdd`, params)
export const sysOrgStaffDel = (params?: any) => request.post(`${baseURLMock}/org/staffDel`, params)
export const sysOrgStaffUpdate = (params?: any) => request.post(`${baseURLMock}/org/staffUpdate`, params)
export const sysOrgStaffStatusUpdate = (params?: any) => request.post(`${baseURLMock}/org/staffStatusUpdate`, params)
export const sysOrgStaffResetPwd = (params?: any) => request.post(`${baseURLMock}/org/staffResetPwd`, params)
export const sysOrgStaffInfo = (params?: any) => request.post(`${baseURLMock}/org/staffInfo`, params)