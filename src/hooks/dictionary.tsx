import { getAccountList, getMonitorProductList } from "@/api/cloudService/cloudMonitor";
import { getAllProvider } from "@/api/common";

// 常用数据字典
// 获取厂商列表
export async function getProviderOptions(params: any){
    const { data } = await getAllProvider(params)
    return data?.map((v: any) => ({}))
}

// 获取帐号列表
export async function getAccountOptions(params: any) {
    const { data } = await getAccountList(params)
    return data?.map((v: any) => ({label: v.accountName, value: v.accountId}))
}

// 获取产品列表
export async function getProcudtOptions(params: any) {
    const { data } = await getMonitorProductList(params)
    return data?.map((v: any) => ({label: v.name, value: v.id, type: v.type}))
}

export const useDictionary = () => {
    return {
        getProviderOptions,
        getAccountOptions,
        getProcudtOptions
    }
}
