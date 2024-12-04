import { applyMiddleware, createStore } from "redux"
import { thunk } from "redux-thunk";
import reducer from "./reducer"
import { TreeProps } from "antd";

// 用户信息
export type UserInfo = {
    userName?: string;      // 用户名
    nickName?: string;      // 用户昵称
    avatar?: string;        // 用户头像
    roles?: string[];        // 用户角色
    permissions?: string[];  // 用户权限
    routes?: any[];          // 用户所具有的权限路由信息
}

export type StateType = {
    userInfo: UserInfo; // 用户信息
    orgTree: TreeProps['treeData']; // 组织架构树
    cacheKey?: string[]; // 缓存页面
}

const initialState: StateType = {
    userInfo: {},
    orgTree: [],
    cacheKey: []
}

const createStoreWithMiddleware = applyMiddleware(thunk)(createStore)
export default createStoreWithMiddleware(reducer, initialState)
