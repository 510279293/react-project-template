import { message } from "antd"
import { isBrowser } from "."

const fileServer = import.meta.env.VITE_BASE_FILESERVE + '/'

// 添加文件服务器域名前缀
export function addFileServerPrefix(url: string) {
    return (url||'').includes(fileServer) ? url : (fileServer + url)
}

// 删除文件服务器域名前缀
export function removeFileServerPrefix(url: string) {
    return (url||'').includes(fileServer) ? url.replaceAll(fileServer, '') : url
}

// 文件下载
export const downLoad = (url: string) => isBrowser() && window.open(url) 

// 处理 dvm 枚举数据 to options
export const dvmOptions = (data: any, field: string) => data?.uiFunctionEnum?.[field]?.map(({caption: label, value}: any) => ({label, value}))

export const productApi = (fn: any) => {
  return async (param: any, showMsg = true, successCB?: any) => {
      const { current: pageCurrent, ...rests } = param
      // 如果参数不是对象  会被转换为对象  所以添加判断
      const { msg, success, data, ...rest } = await fn(pageCurrent ? {pageCurrent, ...rests} : param)
      const type = success ? 'success' : 'error'
      showMsg && success && message[type](msg)
      success && successCB && successCB(data)
      return { type, success, msg, data, ...rest }
  }
}

export function toFormData(data: any) {
    if (data === null) return null;
    return Object.keys(data).reduce((formData, item) => {
      if (item === 'fileList') { //特殊判断如果内容为files数组，就让里面值不用走JSON.stringify
        data[item] && data[item].forEach((curr: { originFileObj: string | Blob }) => {
            formData.append('file', curr.originFileObj);
          });
      } else {
        formData.append(item, data[item]);
      }
      return formData;
    }, new FormData());
}

// 处理公共树结构
export const handleCommonTreeData = (treeData: any, handleItem: (v: any) => object) => {
  const allLeafArr: any[] = []
  const flatArr: any[] = []
  const newTreeData: any = []
  const deps = (data: any[], newTreeData: any[]) => (data||[]).forEach((v, i) => {
      const { children } = v
      v = (handleItem && handleItem(v)) || v
      flatArr.push(v)
      newTreeData[i] = v
      newTreeData[i].children = children
      if (children && children.length) {
          deps(children||[], v.children)
      } else {
          allLeafArr.push(v)
      }
  })
  deps(treeData, newTreeData)
  return {
      treeData,
      newTreeData,
      flatArr,
      allLeafArr
  }
}
