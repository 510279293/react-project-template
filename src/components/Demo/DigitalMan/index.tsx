import { ConfigProvider, Input, Tabs } from 'antd';
import { useEffect } from 'react';
import MyCreation from './myCreation';
import WorkSpace from './workSpace';
import { DoppelgangerCreate } from './create';
import VideoMake from './create/video';

const Test = () => {

    const getIsSupported = async () => {
        const result = await HwICSUiSdk.checkBrowserSupport();
        console.log('Is supported:', result);  // true or false
        if (result) {
            HwICSUiSdk.create({
                onceCode: 'aaa',
                taskUrl: 'aaa',
                containerId: 'ics-sdk',
              });
              
        }
    }

    useEffect(() => {
        getIsSupported();
    }, []);
    return (<>
        <div id="ics-sdk" style={{width: '100vw', height: '100vh'}}></div>
    </>)
}

const items = [
    {
        label: <span style={{color: 'gray'}}>工作台</span>,
        key: '1',
        children: <WorkSpace />
    },
    {
        label: <span style={{color: 'gray'}}>我的创作</span>,
        key: '2',
        children: <MyCreation />
    },
    {
        label: <span style={{color: 'gray'}}>任务中心</span>,
        key: '3',
        children: ''
    },
]

const theme = {
    token: {
        colorBgContainer: 'rgba(255, 255, 255, .06)',
        colorTextPlaceholder: '#999',
        colorBorder: 'rgba(255, 255, 255, .06)',
        colorBorderSecondary: 'transparent',
        colorText: 'rgba(255, 255, 255, .6)',
    },
    components: {
        Form: {
            labelColor: '#fff'
        },
        Dragger: {
            
        },
        Input: {
            activeBg: 'rgba(255, 255, 255, .06)',
        }
    }
}

const Human = () => {
    return (<div style={{background: '#181818', minHeight: '100vh', color: '#fff'}}>
        {/* <Tabs
            tabPosition="left"
            items={items}
            style={{ height: '100vh'}}
            tabBarStyle={{color: 'gray', background: '#212428',}}
        /> */}
        <ConfigProvider theme={theme}>
            {/* <DoppelgangerCreate /> */}
            <VideoMake />
        </ConfigProvider>
        
    </div>)
}

export default Human