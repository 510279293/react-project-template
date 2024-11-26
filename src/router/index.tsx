import { BrowserRouter, Outlet, Route, RouterProvider, Routes, createBrowserRouter, matchPath, useLoaderData, useRoutes } from "react-router-dom";
import { Permission, Error, Layout, Lazy } from "@/components"; 
import { MenuItem, dynamicRoutes, staticRoutes } from "./config";
import { flattenTree, isEmptyArray } from "@/utils";
import { useRequest } from "ahooks";
import React, { Suspense, lazy, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { StateType } from "@/store";
import { Login } from "@/pages";

// const Auth = () => (<Permission><Layout><Outlet /></Layout></Permission>)
const Auth2 = () => (<Layout><Permission><Outlet /></Permission></Layout>)

// 
const routes: any = [
    ...staticRoutes,
    {
        path: "/",
        element: <Auth2 />,
        errorElement: <Error />,
        children: [
            ...dynamicRoutes
        ],
    },
]

export const getRouters = (userRoutes?: any[]) => {
    return [
        ...staticRoutes,
        {
            path: "/",
            element: <Auth2 />,
            errorElement: <Error />,
            // children: [ ...dynamicRoutes ],
            children: handleDynamicRoutes(userRoutes || dynamicRoutes || [])
        },
    ]
}

const handleDynamicRoutes = (routes: MenuItem[]): any => {
    return (routes||[]).map((route) => {
        const { children, path } = route
        return {
            ...route, 
            path, 
            element: <Lazy path={`../../pages${path}`} />, 
            children: children ? handleDynamicRoutes(children) : undefined
        }
    })
}


export const AppRouterProvider = () => {
    const router = createBrowserRouter(routes)
    return <RouterProvider router={router} />

    // const { routes: userRoutes } = useSelector((state: StateType) => state.userInfo)  // 获取用户所拥有的 路由
    // const routes: any = getRouters()
    
    // const router = createBrowserRouter(routes)
    
    // return !userRoutes ? <div>loading...</div> : (<RouterProvider router={router} />)
}

// 可能会用到的方法
export const useRouterHook = () => {
    const allRoutes = flattenTree([...staticRoutes, ...dynamicRoutes])  // 路由扁平化
    const getAllParamRoutes = () => allRoutes.filter(v => /\/:/g.test(v.path))  // 获取所有路由中的 params 路由,例如: [/test/:name, /test/:name/:id]
    const calcMenuSelectedKeys = (pathname: string) => {
        const allMatchs = getAllParamRoutes().filter(({path}: MenuItem) => matchPath(path, pathname))
        return isEmptyArray(allMatchs) ? [pathname] : allMatchs.map(v => v.path)
    }
    const getTargetMenuByPath = (pathname: string) => {   // 通过 path 寻找目标路由
        const targetPath = calcMenuSelectedKeys(pathname)
        return allRoutes.find(v => v.path === targetPath[0])
    }
    const getRedirectPath = (routers: any[], rule: (v: any) => boolean) => {  // 获取当前路由重定向路由
        const allRoutes = flattenTree(routers)
        return allRoutes.find(rule)
    }
    
    return {
        allRoutes,
        getAllParamRoutes,
        calcMenuSelectedKeys,
        getTargetMenuByPath,
        getRedirectPath,
        getFirstRoute
    }
}

// 递归查找 第一个路由
function getFirstRoute(route: MenuItem){
    let target = route
    while(target.children) {
        target = target.children[0]
    }
    return target
}
