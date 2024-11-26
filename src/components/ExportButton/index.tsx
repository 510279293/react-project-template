import { Button, ButtonProps, Modal } from "antd"
import React, { useState } from "react"
import { isFunction } from "lodash"
import { downLoad, productApi } from "@/utils";
import { request } from "@/plugins";

interface ExportButtonProps extends ButtonProps{
    action?: string;
    method?: 'GET' | 'POST' | 'DELETE' | 'PUT';
    param?: Record<string, any> | ((param?: any) => Record<string, any>);
    onSuccess?: () => void;
}

export const useExportHook = ({action, method, onSuccess}: ExportButtonProps) => {
    const [loding, setLoading] = useState<boolean>(false)
    const methods = method ? { method } : { method: 'POST' }
    const api = productApi((data?: object) => request.request({ url: action, data, ...methods }))
    const exportApi = async (param: any) => {
        setLoading(true)
        await api(isFunction(param) ? param() : param, false, (data: any) => {
            downLoad(`${import.meta.env.VITE_BASE_FILESERVE}/${data}`)
            onSuccess?.()
        })
        setLoading(false)
    }
    return {
        loding,
        exportApi,
    }
}

const ExportButton = ({action, param, onSuccess, children, ...rest}: ExportButtonProps) => {
    const { loding, exportApi } = useExportHook({action, onSuccess})
    return <Button loading={loding} onClick={() => exportApi(param||{})} {...rest}>{children || '批量导出'}</Button>
}

export default ExportButton