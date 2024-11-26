import { applyMiddleware, createStore } from "redux"
import { thunk } from "redux-thunk";
import reducer from "./reducer"
import { Key } from "react";
import { SelectProps, TreeDataNode, TreeProps } from "antd";

// 用户信息
export type UserInfo = {
    userName?: string;      // 用户名
    nickName?: string;      // 用户昵称
    avatar?: string;        // 用户头像
    roles?: string[];        // 用户角色
    permissions?: string[];  // 用户权限
    routes?: any[];          // 用户所具有的权限路由信息
}

// 产品树
// type ProductItem = {
//     title?: string;
//     key?: Key;
//     type?: any;
//     label?: string;
//     value?: Key;
//     children?: ProductItem[]
// }

type ProductItem = TreeDataNode

type ProviderList = SelectProps['options']

export type StateType = {
    userInfo: UserInfo; // 用户信息
    productTree: ProductItem[]; // 产品树
    providerList: ProviderList; // 厂商
}

const initialState: StateType = {
    userInfo: {},
    productTree: [],
    providerList: []
}

const createStoreWithMiddleware = applyMiddleware(thunk)(createStore)
export default createStoreWithMiddleware(reducer, initialState)
