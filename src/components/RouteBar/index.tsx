// 路由记录站

import { useRouterHook } from "@/router";
import { setCacheKey } from "@/store/action";
import { Tabs } from "antd";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

type HistoryItem = {
    pathname?: string,
    search?: string,
    hash?: string,
    label: string,
    key: string,
    timestamp?: number
}

function useRouteBarHook() {
    const dispatch = useDispatch()
    const location = useLocation()
    const { getTargetMenuByPath } = useRouterHook()
    const [historyList, setHistoryList] = useState<HistoryItem[]>([])
    const { pathname, search, hash } = location
    const fullPath = `${pathname}${search}${hash}`
    const historyKeys = historyList.map(v => v.key)
    const createItem = (pathname: string) => {
        const { name } = getTargetMenuByPath(pathname)
        return ({
            pathname,
            hash,
            search,
            label: name,
            key: fullPath,
            timestamp: Date.now()
        })
    }

    const addHistoryList = () => {  // 添加历史记录站
        if (!historyKeys?.includes(fullPath)) {
            setHistoryList([...historyList, createItem(pathname)])
        }
    }

    const delHistoryList = (targetKey: string) => { // 删除指定历史记录站, 并返回一个新的 跳转路由
        const len = historyList.length
        if (len < 2) return  // 就剩一个了不让删了
        const newHistoryList = historyList.filter(v => v.key !== targetKey)
        setHistoryList([...newHistoryList])
        if (targetKey === fullPath) {  // 如果删除的是当前路由，计算下一个跳转路由
            return newHistoryList[newHistoryList.length - 1] // 找出下一个跳转路由
        }
    }

    useEffect(() => {
        !['/'].includes(pathname) && addHistoryList()
    }, [location])

    useEffect(() => {
        dispatch(setCacheKey(historyKeys))
    }, [historyKeys])


    return {
        fullPath,
        historyList,
        addHistoryList,
        delHistoryList
    }
}

function RouteBar() {
    const navigate = useNavigate()
    const { fullPath, historyList, delHistoryList } = useRouteBarHook()
    
    return (<Tabs 
                items={historyList} 
                activeKey={fullPath} 
                onChange={navigate}
                onEdit={(targetKey) => {
                    const next = delHistoryList(targetKey as string)
                    next?.key && navigate(next?.key as string)
                }}
                type="editable-card" 
                hideAdd
                tabBarStyle={{marginBottom: 0}}
            />)
}

export default RouteBar