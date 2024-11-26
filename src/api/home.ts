import { request } from "@/plugins";
import { stringify } from "qs";
import { APIPREFIX } from "./common";

export const login = () => request.post(`${APIPREFIX}/portal/manage/login`, stringify({username: 'zqs123456', password: 'zqs123456'}))
export const aaa = () => request.post('/axios.post', {data: {a: 1, b: 2}})
