import { request } from "@/plugins";
import { stringify } from "qs";
import { APIPREFIX, headers } from "./common";
// import { stringify } from "qs";

export const manageUserPageList = (params?: any) => request.post(`${APIPREFIX}/manage/user`, params)

export const manageUserAdd = (params?: any) => request.post(`${APIPREFIX}/manage/userAdd`, params)
export const manageUserDel = (params?: any) => request.post(`${APIPREFIX}/manage/userDel`, params)
export const manageUserUpdate = (params?: any) => request.post(`${APIPREFIX}/manage/userUpdate`, params)