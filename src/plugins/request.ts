import createRequest from '@junc/request'

const responseInterceptors = (config: any) => [
    (response:any) => Promise.resolve(response.data).then(source => {
        console.log()
        return source
    }),
    (error: any) => {
        console.log('xxxx', error)
        alert('接口出错啦')
        return Promise.reject(error)
    }
]

const baseURL = ''
const baseURLMock = 'https://www.fastmock.site/mock/1c752ca4a971cd17f93f0dc29737e53f/api'

export const request = createRequest({
    baseURL,
    responseInterceptors
})
