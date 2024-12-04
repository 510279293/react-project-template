import config from '@/project.config'

const { TOKENKEY } = config
/**
 * @description: 树状结构扁平化
 * @param {any[]} treeData 数据源
 * @param {string} childrenName 树结构的 children 名
 * @return { any[] } 返回的目标数据
*/
type FlattenTreeFn = (treeData: any[], childrenName?: string) => any[];
export const flattenTree: FlattenTreeFn = (treeData: any[], childrenName = 'children') => treeData.reduce((acc, node) => acc.concat(node, ...flattenTree(node[childrenName] || [], childrenName)), [])

export const isEmptyArray = (arr: any[]) => arr.length === 0

// 判断是否为浏览器环境(服务端渲染会用到)
export const isBrowser = () => !!(typeof window !== 'undefined' && window.document && window.document.createElement);

export const getStorage = (key: string) => isBrowser() && localStorage.getItem(key)

export const setStorage = (key: string, value: any) => isBrowser() && localStorage.setItem(key, value)
  
export const removeStorage = (key: string) => isBrowser() && localStorage.removeItem(key)

export const getToken = () => getStorage(TOKENKEY)

export const setToken = (value: any) => setStorage(TOKENKEY, `Bearer `+value)

export const removeToken = () => removeStorage(TOKENKEY)

/**
 * @description: 转换路由: /index/:index2/index3/:id/name   => ['/index', '/index/:index2', '/index/:index2/index3', '/index/:index2/index3/:id']
 * @param {string} path
 * @return {string[]}
 */
export function getPathStage(path: string) {
    const arr: string[] = []
    let key = ''
    path.replace(/\/(:|\w)+(?=|\/)/g, item => (arr.push(key += item), item))
    return arr
}
