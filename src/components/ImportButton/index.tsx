import { message, Modal, Row } from "antd"
import React, { useRef, useState } from "react"
import { useSelector } from "react-redux"
import type { ModalFormProps, ProFormInstance } from '@ant-design/pro-form' 
import ProForm, { ModalForm,  ProFormUploadDragger, } from '@ant-design/pro-form';
import { productApi, getToken, toFormData } from "@/utils"
import { request } from "@/plugins"
import config from '../../../project.config'
import FormData from "form-data";
import { useRequest } from "ahooks";
import { userGetTemplates } from "@/api";

const { TOKENKEY } = config

interface BatchImportProps extends ModalFormProps{
    action?: string;
    params?: Record<string, any>;
    param?: Record<string, any>;
    onSuccess?: () => void;
    templateUrl?: string;
    templateCode?: string;
    children?: any;
}

const useImportHook = ({action, param, onSuccess}: BatchImportProps) => {
    const formRef = useRef<ProFormInstance>()
    const [fileList, setFileLst] = useState<any[]>([])
    const customRequest = ({file}: any) => setFileLst([file])
    const onRemove = () => setFileLst([])
    const onFinish = async (values: any) => {
        const formData = toFormData({...values, ...(param||{})})
        const api = productApi((data?: object) => request.request({ url: action, method: 'POST', data }))
        const { success, data } = await api(formData, false, onSuccess)
        const { info, msg, file } = data || {}
        if (success) {
            Modal.confirm({
                title: '处理成功',
                centered: true,
                content: <div><p>{info||msg}</p>{ file ? <p>错误文件下载地址:<a download={file} href={file}>{file}</a></p> : null}</div>,
                okText: '确认',
                cancelText: '取消',
            });
        } else {
            // message.error(msg)
        }
        return success
    }
    const modalProps = {
        formRef,
        onFinish
    }
    return {
        formRef,
        fileList,
        customRequest,
        onRemove,
        onFinish,
        modalProps
    }
}

const ImportButton = ({children, onSuccess, params, param, action, templateUrl, templateCode, ...rest}: BatchImportProps) => {
    const {
        fileList,
        customRequest,
        onRemove,
        modalProps
    } = useImportHook({action, param, onSuccess})

    const { data } = useRequest(() => userGetTemplates({type: 2, templateCode}), { manual: !templateCode })
    const { data: url } = (data || {}) as any

    return (<ModalForm<BatchImportProps> 
        modalProps={{maskClosable: false}} 
        layout="horizontal" 
        width={600} 
        labelCol={{span: 4}} 
        {...modalProps}
        {...rest}>
            {children}
            <ProFormUploadDragger 
                max={1} 
                label="文件导入" 
                name="fileList"
                fieldProps={{ 
                    name: 'file', 
                    customRequest, 
                    onRemove, 
                    fileList, 
                    headers: {[TOKENKEY]: getToken()} as any
                }} 
                rules={[{required: true, message: '文件导入'}]}
                extra={(templateUrl||templateCode) ? <Row justify="end"><a download href={templateUrl||`${import.meta.env.VITE_BASE_FILESERVE}/${url}`}>模板下载</a></Row> : null}
            />
         
    </ModalForm>)
}

export default ImportButton