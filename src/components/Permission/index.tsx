import { usePermissionHook } from "@/hooks";
import Layout from "../Layout";
import KeepAliveOutlet from "../KeepAlive";

const NoPermission = () => {
    return (<div>sorry, 你没有权限</div>)
}

export function Permission({children}: any){
    const { hasPermission } = usePermissionHook()
    return hasPermission() ? children : <NoPermission />
}

// const Auth = () => (<Permission><Layout><Outlet /></Layout></Permission>)
const Auth = () => (<Layout><Permission><KeepAliveOutlet /></Permission></Layout>)

export default Auth