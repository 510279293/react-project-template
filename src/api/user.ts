import { request } from "@/plugins";
import { stringify } from "qs";
import { APIPREFIX, headers } from "./common";
// import { stringify } from "qs";

export const userInfo = (params?: any) => request.post(`${APIPREFIX}/userInfo`, params)

export const userGetTemplates = (params?: any) => request.dvmPost(`/cloudy_manage/web/creater/getTemplateDownloadUrl`, params)

// 用户名登录
export const accountLogin = (params?: any) => request({url: `${APIPREFIX}/login`, method: 'POST', headers, data: stringify(params)})

// 用户手机号登录
export const phoneLogin = (params?: any) => request.post(`${APIPREFIX}/login`, params)

// 用户手机号登录
export const register = (params?: any) => request.post(`${APIPREFIX}/register`, params)

// 获取图片验证码
export const getTextCapcha = (params?: any) => request.get(`${APIPREFIX}/charCaptcha`, {params} )

// 校验图片验证码
export const checkTextCapcha = (params?: any) => request.post(`${APIPREFIX}/verifyCharCaptcha`, params)
