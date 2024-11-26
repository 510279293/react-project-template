import { request } from "@/plugins";
import { stringify } from "qs";
// import { stringify } from "qs";
const baseURLMock = 'https://mock.mengxuegu.com/mock/6686120e52478524c838bd6d/v1'
const BASEURL = baseURLMock

export const getVideoTempList = (params?: any) => request.get(`${BASEURL}/digital-human-video-scripts`, { params })

export const getVideoTempDetail = (params?: any) => request.get(`${BASEURL}/digital-human-video-scripts-detail`, { params })

export const getVideoRoleAssets = (params?: any) => request.get(`${BASEURL}/digital-assets`, { params })
