// 权限 hook
import { useRouterHook } from "@/router"
import { MenuItem } from "@/router/config"
import { StateType } from "@/store"
import { useSelector } from "react-redux"
import { useLocation } from "react-router-dom"

export const usePermissionHook = () => {
    const location = useLocation();
    const { permissions } = useSelector((state: StateType) => state.userInfo)  // 获取用户所拥有的所有 权限 code
    const { getTargetMenuByPath } = useRouterHook()
    const targetRoute = getTargetMenuByPath(location.pathname) || ({})  // 通过 path 获取目标路由的 权限 code
    const { authCode } = targetRoute
    const hasPermission = (code: MenuItem['authCode'] = authCode) => (!Object.prototype.hasOwnProperty.call(targetRoute, 'authCode')) ? true : [ -1, ...(permissions||[])].includes(code)
    return {
        permissions,
        authCode,
        hasPermission
    }
}