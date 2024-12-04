import createRequest from '@junc/request'
import config from '@/project.config'
import { getToken, removeToken } from '@/utils'
import { message } from 'antd'
import { stringify } from 'qs'

const { TOKENKEY } = config

function transformParams(config: any) {
    TOKENKEY && Object.assign(config.headers, {[TOKENKEY]: getToken()})
    if (config?.data &&  typeof config.data === 'object' && 'current' in config.data) {
        config.data.pageNum = config.data.current
    }
    return config
}

// 响应拦截器
const responseInterceptors = (_config: any) => [
    (response:any) => Promise.resolve(response.data).then(source => {
        const { code, msg } = source
        if (code !== 200) message.error(msg)
        // todo: token 失效处理
        if (code < 0 || [6004, 6001].includes(code)) {
            removeToken()
            return window.location.href = '/login'
        }
        return source
    }),
    (error: any) => {
        console.log('接口响应错误', error)
        message.error(error.message)
        return Promise.reject(error)
    }
]

// 请求拦截器
const requestInterceptors = (_config: any) => [
    (config:any) => {
        const newConfig = transformParams(config)
        return newConfig
    },
    (error: any) => {
        console.log('接口请求错误', error)
        return Promise.reject(error)
    }
]

// const baseURL = ''
// const baseURLMock = 'https://mock.mengxuegu.com/mock/65d46fbb351bbd02cf339b8e/api'

export const request = createRequest({
    tokenKey: TOKENKEY,
    // baseURL: baseURLMock,
    requestInterceptors,
    responseInterceptors,
})

request.dvmPost = (url: string, params: any) => request.request({url:`${url}?${stringify(params)}`, method: 'POST'})
request.dvmGet = (url: string, params: any) => request.get(url, { params })