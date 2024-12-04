import { ActionType, ModalFormProps, ProTableProps, } from "@ant-design/pro-components"
import { useRef, useState } from "react"
import { Modal, Table } from "antd"
import useAntdResizableHeader, { OptionsType } from "use-antd-resizable-header"

type TableActionType = 'add' | 'update' | 'del' | any
function createResizableHeaderColumnsState(columnsState?: OptionsType['columnsState']): OptionsType['columnsState'] {
    if (columnsState) return columnsState
    const { pathname, search } = location
    const persistenceKey = pathname + search
    return {
        persistenceKey,
        persistenceType: 'sessionStorage',
    }
}

// 新增/编辑 弹窗
interface MoalProps extends ModalFormProps{
    onSuccess?: () => void;
}

type useModalHookProps = {
    updateApi?: any;
    addApi?: any;
    delApi?: any;
    getInfoApi?: any;
    callBack?: () => void;
}
export const useModalHook = ({ callBack, addApi, updateApi, delApi, getInfoApi }: useModalHookProps) => {
    const [modalProps, setModalProps] = useState<MoalProps>({
        visible: false, 
        title: '新增', 
        params: {}, 
        request: undefined,
        modalProps: { destroyOnClose: true, onCancel: () => closeModal() } as any,
        onFinish: undefined
    })

    // 成功回调
    const onSuccess = () => { closeModal(); callBack?.() }

    // 关闭弹窗
    const closeModal = () => setModalProps({...modalProps, visible: false})

    // 新增操作
    const addAction = (params?: any) => setModalProps({
        ...modalProps, 
        visible: true, 
        title: '新增', 
        request: undefined, 
        onFinish: addApi ? (values: any) => addApi?.({...values, ...params?.params}, true, onSuccess) : undefined,
        ...params
    })
    // 编辑操作
    const editAction = (params?: any) => setModalProps({
        ...modalProps, 
        visible: true, 
        title: '编辑', 
        request: getInfoApi ? getInfoApi : undefined,
        onFinish: updateApi ? (values: any) => updateApi?.({...values, ...params?.params}, true, onSuccess) : undefined,
        ...params
    })

    // 删除操作
    const delAction = (params: any) => Modal.confirm({
        title: '确认要删除该数据吗?',
        content: '删除后当前内容将永久删除，不可恢复。',
        okText: '确认',
        cancelText: '取消',
        onOk: async() => {
            await delApi?.(params, true, onSuccess)
        },
    });

    const createAction = (action: TableActionType, params?: any) => {
        switch (action) {
            case 'add':
                return addAction(params)
            case 'update':
                return editAction(params)
            case 'del':
                return delAction(params)
            default:
        }
    }

    return {
        modalProps,
        setModalProps,
        addAction,
        editAction,
        delAction,
        onSuccess,
        createAction
    }
}

type useProTableHookProps = {
    // columnsFn: any;
    // operate?: (action: string, record: any) => void;
    // delApi?: (params: any, showMsg: boolean, callBack?: () => void) => void;
    columns?: ProTableProps<any, any>['columns'];
    resizableHeaderColumnsState?: OptionsType['columnsState']
}
export const useProTableHook = ({ columns, resizableHeaderColumnsState }: useProTableHookProps) => {
    const formRef = useRef<any>(null)
    const actionRef = useRef<ActionType>(null); 
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const onRefresh = () => actionRef.current?.reload() // ProTable 表格刷新函数
    const pagination = {defaultPageSize: 10, showSizeChanger: true}
    const rowSelection = {
        selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT], 
        onChange: setSelectedRowKeys
    }

    const { components, resizableColumns } = useAntdResizableHeader({ columns, columnsState: createResizableHeaderColumnsState(resizableHeaderColumnsState), });

    // const delAction = (params: any) => Modal.confirm({
    //     title: '确认要删除该数据吗?',
    //     content: '删除后当前内容将永久删除，不可恢复。',
    //     okText: '确认',
    //     cancelText: '取消',
    //     onOk: async() => {
    //         await delApi?.(params, true, onRefresh)
    //     },
    // });

    const getQueryParams = (otherParams?: Record<string, any>) => {
        return {
            ...formRef.current?.getFieldsFormatValue(),
            ...otherParams
        }
    }
    
    const getDvmExportParams = (otherParams?: Record<string, any>) => {
        const showInTableColumns = resizableColumns?.filter(column => (!column.hideInTable && !['option'].includes(column?.valueType as any)))
        return {
            ...formRef.current?.getFieldsFormatValue(),
            fields: showInTableColumns.map(column => column.dataIndex).toString(),
            captions: showInTableColumns.map(column => column.title).toString(),
            ...otherParams
        }
    }

    return {
        actionRef,
        formRef,
        getQueryParams,
        getDvmExportParams,
        onRefresh,
        // delAction,
        pagination,
        components,
        columns: resizableColumns,
        selectedRowKeys,
        rowSelection
    }
}

/** usePlusTableHook 提供基本表单的 增删改查 可能用到的方法，参数
 * @param {*} getApi      // 表格数据的 获取 方法 
 * @param {*} delApi      // 表格数据的 删除 方法
 * @param {*} addApi      // 表格数据的 新增 方法
 * @param {*} updateApi   // 表格数据的 更新 方法
 * @param {*} getInfoApi  // 获取变革数据 详情的 方法
 * @param {*} columns     // 表格数据 列 配置
 * @param {*} resizableHeaderColumnsState  // 表格表头宽度拖拽 存储 配置
 * @returns 
 */

type usePlusTableHookProps = {
    delApi?: any;
    updateApi?: any;
    addApi?: any;
    getInfoApi?: any;
    // operate: (action: string, record: any) => void;
    columns: any;
    resizableHeaderColumnsState?: OptionsType['columnsState']
}
export const usePlusTableHook = ({
    delApi,
    updateApi,
    addApi,
    getInfoApi,
    columns,
    resizableHeaderColumnsState,
    // operate,
}: usePlusTableHookProps) => {
    const { 
        actionRef,
        formRef,
        onRefresh, 
        getQueryParams,
        getDvmExportParams,
        pagination, 
        components, 
        columns: resizableColumns,
        rowSelection,
        selectedRowKeys
    } = useProTableHook({
        columns, 
        resizableHeaderColumnsState
    })

    const {
        modalProps,
        setModalProps,
        onSuccess,
        addAction,
        editAction,
        delAction,
        createAction
    } = useModalHook({
        updateApi,
        addApi,
        getInfoApi,
        delApi,
        callBack: onRefresh
    })

    const tableProps = {
        components,
        columns: resizableColumns,
        actionRef,
        formRef,
        pagination,
        rowSelection,
    }
    
    return {
        getQueryParams,
        getDvmExportParams,
        selectedRowKeys,
        tableProps,      // ProTable   组件 props
        modalProps,      // ModalForm  组件 props
        setModalProps,   // 更新 modalProps 的 方法
        onSuccess,       // 数据增删改查 成功后的 回调方法: 关闭弹窗，刷新数据
        addAction,       // 调用新增弹窗，本质就是调用 setModalProps 方法
        editAction,      // 调用编辑弹窗，本质就是调用 setModalProps 方法
        delAction,       // 调用删除弹窗，成功后自动执行 onRefresh 回调
        onRefresh,        // 表格数据的 刷新方法
        createAction
    }
}
