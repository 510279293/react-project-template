import { usePermissionHook } from "@/hooks";

const NoPermission = () => {
    return (<div>sorry, 你没有权限</div>)
}

export default function Permission({children}: any){
    const { hasPermission } = usePermissionHook()
    return hasPermission() ? children : <NoPermission />
}
