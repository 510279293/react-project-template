import { Button, Card, Flex, Modal, Space, } from "antd"
import { ModalForm, ProFormSelect, ProFormText, ProFormTextArea, ProTable } from "@ant-design/pro-components"
import { usePlusTableHook } from '@/hooks';
import { productApi } from "@/utils"
import { columns } from "./data";
import { 
    diyDo2Get,
    applyBillDel,
    applyBillPageList,
    applyBillUpdate,
    applyBillDetail,
} from '@/api'
import { useEffect, useMemo, useState } from "react";
import { request} from "@/plugins";
import { useRequest } from "ahooks";
import { ProTablePlus } from "@/components";

const mockDataSourceItem = columns(null).reduce((prev: any, next: any) => Object.assign(prev, {[next?.dataIndex]: next?.initialValue}), {})


// 接口请求的另一种写法，方便 dvm 代码生成 
const getApi = async (params: any) => {
    console.log('查询参数:', params)
    // const { data } = await request.post('/cloudy_manage/demo/sysRole/getPage', params)
    // const { records, total } = data
    return {
        data: new Array(20).fill(0).map((v, idx) => ({...mockDataSourceItem, id: idx})),  // 列表数据
        total: 20,  // 列表总条数
        success: true  // 请求成功，关闭表格 loading 等待
    }
}
const delApi = productApi((params?: any) => request.dvmPost('/cloudy_manage/demo/sysRole/deleteBatch', params)) 
const addApi = productApi((params?: any) => request.post('/cloudy_manage/demo/sysRole/save', params))
const updateApi = productApi((params?: any) => request.post('/cloudy_manage/demo/sysRole/save', params))
const getInfoApi = async (params: any) => {
    const { data } = await request.dvmGet(`/cloudy_manage/demo/sysRole/getById`, params)
    // 返回表单需要的数据
    return data
}

// 获取页面枚举数据
const getInitDataApi = async () => {
    const { data } = await diyDo2Get({dvmControl: 'project/demoManage/sysRole'})
    return data
} 


// 组件区域
const ProTableBase = () => {
    const operate = async (action: any, record: any) => {
        const { id } = record || {}
        switch (action) {
            //【新增，编辑，删除】操作可能存在一下几种情况:
            // case 1: 理想情况下，不需要额外配置 弹窗，以及接口体交参数
            // case 2: 非理想情况下，需要额外配置 弹窗，以及接口体交参数
            case '新增':
                addAction()     // case 1: 极简模式
                // addAction({     // case 2: 自定义模式
                //     visible: true,             // 配置: 弹窗是否打开
                //     title: '新增弹窗的标题',     // 配置: 弹窗的标题
                //     params: {},                // 配置: 弹窗提交时额外的 提交参数
                //     onFinish: async (values: any) => {  // 复写弹窗提交方法（会覆盖掉 addApi 方法）
                //         console.log('新增弹窗的表单数据', values)
                //         addAction({visible: false})
                //     },
                //     request: async (params: any) => {   // 复写 编辑弹窗时 回填表单数据的方法 (会覆盖掉 getInfoApi 方法)
                //         return {}
                //     },
                // }) 
                break;
            case '编辑':  // editAction 方法 同 addAction 方法一致
                editAction({params: {id}})
                break;
            case '删除':  
                delAction({ids: [23, 45].toString(), dvmControcal: 'xxxxxxx'})    // case 1: 极简模式 && dvmPost 形势调用
                // Modal.confirm({  // case 2: 自定义模式
                //     title: '确认要删除该数据吗?',
                //     content: '删除后当前内容将永久删除，不可恢复。',
                //     okText: '确认',
                //     cancelText: '取消',
                //     onOk: async() => {
                //         await delApi?.(params, true, onRefresh)
                //     },
                // });
                break;
        }
    }

    const { data } = useRequest(getInitDataApi)
    const { 
        tableProps, 
        modalProps, 
        addAction, 
        editAction, 
        delAction,
        setModalProps,
        onRefresh
    } = usePlusTableHook({
        delApi,
        updateApi,
        addApi,
        getInfoApi,
        columns: useMemo(() => columns(operate, data), [data])  // 可以将 data 枚举值 透传到 columns 中
    })

    return (<>
        <ProTable
            request={getApi}
            scroll={{x: 2400}}
            toolbar={{
                actions: [
                    <Button type="primary" key="新增申请单" onClick={() => operate?.('新增', null)}>新增申请单</Button>,
                ]
            }}
            rowKey="id"
            {...tableProps}
        />
        <ModalForm<any>
            layout="horizontal"
            labelCol={{span: 4}}
            width={600}
            {...modalProps}
        >
            <ProFormText 
                label="角色名称" 
                name="roleName" 
            />
            <ProFormSelect 
                label="角色类型" 
                name="roleType" 
                options={data?.uiFunctionEnum?.roleTypeList?.map(({caption: label, value}: any) => ({label, value}))} 
                rules={[{required: false, message: '请选择'}]} 
            />
            <ProFormTextArea
                label="备注" 
                name="remarks" 
            />
        </ModalForm>
    </>)
}

// ProTablePlus 升级组件
const ProTablePlusDemo = () => {
    const operate = async (action: any, record: any) => {
        console.log(action, record)
    }
    return (<ProTablePlus 
                request={getApi}
                scroll={{x: 2400}}
                toolbar={{
                    actions: [
                        <Button type="primary" key="新增申请单">新增申请单</Button>,
                    ]
                }}
                addTrigger={<Button type="primary" key="新增申请单">新增申请单</Button>}
                columns={columns(operate, {})}
                rowKey="id"
           />)
}

const ProTableDemo = () => {
    return (<Space direction="vertical" size="middle" style={{ display: 'flex', padding: 20 }}>
        <Card size='small' title="protable 基本演示">
            <ProTableBase />
        </Card>
        <Card size='small' title="ProTablePlus 基本演示">
            <ProTablePlusDemo />
        </Card>
    </Space>)
}

export default ProTableDemo
