import { asyncSetUserInfo } from "@/store/action";
import { asyncSetProductTree } from "@/store/action/common";
import { getToken } from "@/utils";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

export const useInitHook = () => {
    const dispatch = useDispatch<any>();
    const isLogin = getToken() // 判断是否登录
    useEffect(() => {
        if (isLogin) {
            dispatch(asyncSetUserInfo())
            dispatch(asyncSetProductTree())
        }
    }, [isLogin])
}
