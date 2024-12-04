import { asyncSetUserInfo } from "@/store/action";
import { asyncSetOrgTree } from "@/store/action/common";
import { getToken } from "@/utils";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

export const useInitHook = () => {
    const dispatch = useDispatch<any>();
    const isLogin = getToken() // 判断是否登录
    useEffect(() => {
        if (isLogin) {
            dispatch(asyncSetUserInfo()) // 获取用户信息
            dispatch(asyncSetOrgTree())  // 获取组织架构树
        }
    }, [isLogin])
}
