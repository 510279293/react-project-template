import { ActionType, ModalForm, ModalFormProps, ProFormSelect, ProFormText, ProTable, ProTableProps } from "@ant-design/pro-components"
import { billTypeOptions, columns } from "./data"
import { 
    applyBillDel,
    applyBillPageList,
    applyBillUpdate,
    applyBillDetail
} from '@/api'
import { useRef, useState } from "react"
import { Button, Modal } from "antd"
import { productApi } from "@/utils"

// 列表接口请求: get
const getApi = async (params: any) => {
    const { data } = await applyBillPageList(params)
    const { values, total } = data
    return {
        data: values,  // 列表数据
        total: total,  // 列表总条数
        success: true  // 请求成功，关闭表格 loading 等待
    }
}

// 列表接口请求: 删除数据
const delApi = productApi(applyBillDel)

// 列表接口请求: 新增/编辑
const updateApi = productApi(applyBillUpdate)

// 根据数据id 查询详细信息
const request = async (params: any) => {
    const { data } = await applyBillDetail(params)
    const {
        billType,
        resourceNum
    } = data
    // 返回表单需要的数据
    return { 
        billType,
        resourceNum
    }
}

// 新增/编辑 弹窗
interface AddApplyBillMoalProps extends ModalFormProps{
    onSuccess?: () => void;
}
const AddAddressModal = ({ onSuccess, params, children, ...rest }: AddApplyBillMoalProps) => {
    const onFinish = async (values: any) => {
        await updateApi({...values, ...params}, true, onSuccess)
    }
    return (<ModalForm<any>
        layout="horizontal"
        labelCol={{span: 4}}
        width={600}
        onFinish={onFinish}
        params={params}
        {...rest}
        >
        {children}
    </ModalForm>)
}


const useModalHook = (callBack: AddApplyBillMoalProps['onSuccess']) => {
    const [modalProps, setModalProps] = useState<AddApplyBillMoalProps>({
        visible: false, 
        title: '新增申请单', 
        params: {}, 
        request: undefined,
        modalProps: { destroyOnClose: true, onCancel: () => closeModal() } as any,
        onSuccess: () => onSuccess?.()
    })

    // 关闭弹窗
    const closeModal = () => setModalProps({...modalProps, visible: false})
    // 成功回调
    const onSuccess = () => { closeModal(); callBack?.() }
    // 新增操作
    const addAction = (params?: any) => setModalProps({...modalProps, visible: true, title: '新建地址', params: {}, request: undefined, ...params})
    // 编辑操作
    const editAction = (params?: any) => setModalProps({...modalProps, visible: true, title: '编辑地址', request, ...params})
    return {
        modalProps,
        setModalProps,
        addAction,
        editAction,
        onSuccess
    }
}


type OperateType = '新增' | '编辑' | '删除'
const useHooks = () => {
    const actionRef = useRef<ActionType>(null); 
    const onRefresh = () => actionRef.current?.reload() // ProTable 表格刷新函数
    const {
        modalProps,
        setModalProps,
        addAction,
        editAction,
    } = useModalHook(onRefresh)

    const createAction = () => {
        // 删除操作
        const delAction = (params: any) => Modal.confirm({
            title: '确认要删除该数据吗?',
            content: '删除后当前内容将永久删除，不可恢复。',
            okText: '确认',
            cancelText: '取消',
            onOk: async() => {
                await delApi(params, true, onRefresh)
            },
        });

        return {
            addAction,
            editAction,
            delAction,
        }
    }

    const createOperate = () => {
        const {
            addAction,
            editAction,
            delAction
        } = createAction()
        return (action: OperateType, record?: any) => {
            const { id } = record||{}
            const params = { id }
            switch (action) {
                case '新增':
                    addAction()
                    break;
                case '编辑':
                    editAction({params})
                    break;
                case '删除':
                    delAction({});
                    break;
            }
        }
    }
    
    return {
        actionRef,
        createOperate,
        onRefresh,
        modalProps,
        setModalProps
    }
}

const Address = () => {
    const {
        actionRef,
        createOperate,
        modalProps,
    } = useHooks()

    const operate = createOperate()

    return (<div style={{padding: 20}}>
        <ProTable
            columns={columns(operate)}
            request={getApi}
            actionRef={actionRef}
            toolbar={{
                actions: [
                    <Button type="primary" key="新建地址" onClick={() => operate?.('新增', null)}>新建地址</Button>
                ]
            }}
            rowKey="id"
            pagination={{defaultPageSize: 10, showSizeChanger: true}}
            search={false}
        />
        <AddAddressModal {...modalProps}>
            <ProFormText label="收件人" placeholder="收件人名称" name="who" rules={[{required: true, message: '请填写'}]} />
            <ProFormText label="联系电话" placeholder="收件人电话" name="phone" rules={[{required: true, message: '请填写'}]} />
            <ProFormSelect label="收件人地址" name="billType" options={billTypeOptions} rules={[{required: true, message: '请选择'}]} />
            <ProFormText label="邮编" name="postCode" />
        </AddAddressModal>
    </div>)
}

export default Address