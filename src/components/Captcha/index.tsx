import { getTextCapcha, checkTextCapcha } from "@/api"
import { useRequest } from "ahooks"
import { useState } from "react"
import { RedoOutlined } from '@ant-design/icons';
import { Popover, Tooltip } from "antd";

const handlePoints = (points: any[]) => points.map(point => JSON.stringify(point)).join('')

export type CaptchaProps = {
    value?: any;
    width?: number;
    height?: number;
    params?: any;
    children?: any;
    topTips?: any;
    onSuccess?: () => boolean;
    onChange?: (value: any) => void;
}
export default function Captcha ({width, height, topTips, params, onChange, onSuccess, children}: CaptchaProps){
    const W = width || 270
    const H = height || 150
    const [points, setPoints] = useState<any>([])
    const { data: res, refresh } = useRequest(() => getTextCapcha({width: W, height: H}))
    const { data } = (res || {}) as any
    const onClick = async (e: any) => {
        if (points.length > 3) return
        points.push([e.nativeEvent.offsetX, e.nativeEvent.offsetY])
        setPoints([ ...points ])
        if (points.length === 4) {
            const { success, msg, data: key } = await checkTextCapcha({key: data.key, originXY: points, xy: btoa(handlePoints(points)), ...params }) as any
            if (!success) {
                onRefresh()
            }
            onChange?.(key)
            success && onSuccess?.()
        }
    }
    const removePoint = (i: any) => {
        points.length = i
        setPoints([...points])
    }
    const onRefresh = () => {
        refresh()
        setPoints([])
        onChange?.(null)
    }

    const CaptchaImg = () => (<div style={{position: 'relative', display: 'inline-block'}}>
        <Tooltip title={data?.describe}>
            <img 
                src={data?.captcha} 
                onClick={onClick}
                style={{width: W, height: H}}
            />
        </Tooltip>
        <RedoOutlined onClick={onRefresh} style={{position: 'absolute', right: 10, top: 10, fontSize: 20}} />
        { points.map((point: any[], i: number) => <span key={i} style={{
                position: 'absolute', 
                width: 30, 
                height: 30, 
                lineHeight: '30px', 
                background: '#14E1CD', 
                border: '2px solid #fff', 
                textAlign: 'center', 
                color: '#fff', 
                left: point[0] - 15, 
                top: point[1] - 15,
                borderRadius: '30px'
            }}
            onClick={() => removePoint(i)}
            >{i+1}</span>) }
        
    </div>)

    const Content = topTips ? <><div style={{color: 'red'}}>{data?.describe}</div><CaptchaImg /></> : <CaptchaImg />
    if (children) {
        return <Popover content={ Content }> { typeof children === 'function' ? children({data}) : children} </Popover>
    }
    return Content
}
