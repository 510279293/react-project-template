import { addFileServerPrefix, removeFileServerPrefix } from "@/utils"
import { ProFormItem, ProFormItemProps, ProFormUploadButton, ProFormUploadButtonProps } from "@ant-design/pro-components"
import { Preview } from "@junc/rc"
import { DatePicker, Input, Select, SelectProps, Space } from "antd"
import { useState } from "react"
import { CaptchaProps } from "../Captcha"
import { TextCapcha } from ".."

function uploadTransform(files: any[]) {
    return (files||[]).map((file: any) => { 
        if (typeof file === 'string') return removeFileServerPrefix(file)
        if (file.url) return removeFileServerPrefix(file.url)
        if (file.response?.http) return removeFileServerPrefix(file.response.http)
    })
}

function uploadConvertValue(urls: any[]) {
    return (urls||[]).map((url: any, idx) => { return typeof url === 'string' ? ({url: addFileServerPrefix(url), uid: `${idx}-${url}`, name: url, status: 'done'}) : url } )
}

function uploadTransformForDvm(files: any[] | string) {
    if (typeof files === 'string') return removeFileServerPrefix(files)
    return (files||[]).map((file: any) => { 
        if (typeof file === 'string') return removeFileServerPrefix(file)
        if (file.url) return removeFileServerPrefix(file.url)
        if (file.response?.http) return removeFileServerPrefix(file.response.http)
    }).toString()
}

function uploadConvertValueForDvm(urls: any[] | string) {
    if (typeof urls === 'string') return (urls||'').split(',').map((url: string, idx) => ({url: addFileServerPrefix(url), uid: `${idx}-${url}`, name: url, status: 'done'}))
    return urls
}

// 极简上传模式
export const ProFormUploadSimple = ({name, fieldProps, ...restProps}: ProFormUploadButtonProps) => {
    const [urls, setUrls] = useState<any[]>([])
    const [visible, setVisible] = useState(false)
    const [current, setCurrent] = useState(0)
    return (<>
        <ProFormUploadButton
            name={name}
            fieldProps={{
                name: 'fileOptions.file',
                listType: 'text',
                ...fieldProps,
                onPreview: (file) => {
                    const urls = uploadTransform([file]).map(url => addFileServerPrefix(url||''))
                    setUrls(urls)
                    setVisible(true)
                },
            }}
            action={`${import.meta.env.VITE_FILESERVE_ACTION}`}
            // colProps={{span: 8}}
            convertValue={(value: any[]) => uploadConvertValue(value)}
            transform={(value: any) => ({ [name]: uploadTransform(value) })}
            {...restProps}
        />
        <Preview.Group 
            items={urls} 
            preview={{
                visible,
                current,
                // onChange: setCurrent,
                onVisibleChange: setVisible,
                imageRender: (_: any, {current}: any) => {
                    const currentSrc = urls[current]
                    return <Preview src={currentSrc} />
                },
                toolbarRender: () => null,
            }}
        />
    </>)
}

export const ProFormUploadDvm = ({name, ...restProps}: any) => {
    return (<ProFormUploadSimple 
        name={name} 
        {...restProps} 
        transform={(value: any) => ({[name]: uploadTransformForDvm(value)})} 
        convertValue={(value: string) => uploadConvertValueForDvm(value)}
    />)
}


// 组合筛选条件
type ProFormCompactProps = {
    value?: Record<string, any>;
    onChange?: (value: any) => void;
    fieldProps?: any[];
    changeClear?: boolean;  // 第一个值发生变化的话，第二个值要不要清空
    options?: SelectProps['options']
}
const getKeyName = (obj: ProFormCompactProps['value']) => Object.keys(obj||{})[0] 
const getOptionLabel = (options?: any[], targetValue?: React.Key) => (options||[]).find(v => v.value === targetValue)?.label
export const ProFormCompact = ({value, onChange, fieldProps, options, changeClear}: ProFormCompactProps) => {
    const keyName = getKeyName(value)
    const keyValue = value?.[keyName] 
    const [props1, props2] = fieldProps || []

    const calcProps1 = {
        ...(props1||{}),
        value: keyName,
        options
    }

    const calcProps2 = {
        placeholder: `请输入${getOptionLabel(options, keyName)||''}`,
        ...(props2||{}),
        value: keyValue
    }

    const onOwnChange = (value: any, type: 'key' | 'value') => {
        if (type === 'key') {
            const newVal = { [value]: changeClear ? '' : keyValue }
            onChange?.(newVal)
        } else {
            const newVal = { [keyName]: value }
            onChange?.(newVal)
        }
    }
    return (<Space.Compact style={{width: '100%'}}>
        <Select {...calcProps1} onChange={(val) => onOwnChange(val, 'key')} />
        <Input {...calcProps2} onChange={(e) => onOwnChange(e?.target?.value, 'value')} />
    </Space.Compact>)
}


// 文字验证码
export const ProFormTextCaptcha = ({fieldProps, children, ...rest}: ProFormItemProps) => {
    return (
      <ProFormItem {...rest}>
        <TextCapcha {...fieldProps as CaptchaProps}>{children}</TextCapcha>
      </ProFormItem>
    );
  }