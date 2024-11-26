import { Tabs } from "antd"

const TextDriver = () => {
    return (<>文本驱动</>)
 }
 
 const VoiceDriver = () => {
    return (<>音频驱动</>)
 }
 
 // 驱动:【文本驱动，音频驱动】
 const items = [
   {
     label: '文本驱动',
     key: '文本驱动',
     children: <TextDriver />
   },
   {
     label: '音频驱动',
     key: '音频驱动',
     children: <VoiceDriver />
   },
 ]
 const Driver = () => {
   return (<Tabs items={items}  />)
 }
 

 export default Driver