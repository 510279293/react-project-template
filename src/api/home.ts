import { request } from "@/plugins";
import { stringify } from "qs";
import FormData from "form-data";

// 请求转换为from-data格式
export function fromData(data:any) {
    const form = new FormData()
    Object.keys(data).forEach((element:any) => {
      form.append(element, data[element])
    })
    return form
}

const APIURL = `/cloud_manage`

const BASEURL = APIURL
export const login = (data: any) => request.post(`${BASEURL}/portal/manage/login`, fromData({username: 'zqs123456', password: 'zqs123456'}))
export const aaa = () => request.post('/axios.post', {data: {a: 1, b: 2}})
