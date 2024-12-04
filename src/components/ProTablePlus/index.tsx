import { useModalHook, usePermissionHook, useProTableHook } from "@/hooks";
import { BetaSchemaForm, ListToolBarProps, ModalForm, ModalFormProps, ProColumns, ProFormColumnsType, ProTable, ProTableProps } from "@ant-design/pro-components";
import { Modal } from "antd";
import { Key, ReactNode, useRef, useState } from "react";

interface Columns<DataSource, ValueType = any> extends ProColumns<DataSource, ValueType> {
    hideInAdd?: boolean;
}
interface ProTablePlusProps<DataSource, U, ValueType = any> extends Omit<ProTableProps<DataSource, U, ValueType>, 'columns'> {
    columns?: Columns<DataSource,ValueType>[];
    addTrigger?: ReactNode;
    // actions?: 
    // SchemaForm
}

type ActionType = 'add' | 'update' | 'del' | any;
type OperateType = (action: ActionType, record?: any) => Promise<any>;

interface ToolbarProps extends Omit<ListToolBarProps, 'actions'> {
    actions?: ReactNode | (({operate, hasPermission, selectedRowKeys}: {operate: OperateType, hasPermission: (code?: any) => boolean, selectedRowKeys: Key[]}) => React.ReactNode[]);
}
// interface 
export interface ProTableModalFormProps extends Omit<ProTableProps<any, any, any>, 'columns'| 'toolbar'> {
    columns: ProFormColumnsType<any, any>[] | (({operate, hasPermission}: {operate: OperateType, hasPermission: (code?: any) => boolean}) => ProFormColumnsType<any, any>[]);
    toolbar?: ToolbarProps;
    onSave?: (action: ActionType, record?: any, values?: any) => void;
    children?: React.ReactNode;
    modalProps?: ModalFormProps;
}

export function ProTableModalForm({columns, children, onSave, toolbar, ...rest}: ProTableModalFormProps) {
    const { hasPermission } = usePermissionHook()
    const {
        actionRef,
        rowSelection,
        selectedRowKeys
    } = useProTableHook({})

    const {
        modalProps,
        onSuccess,
        createAction
    } = useModalHook({
        callBack: actionRef.current?.reload
    })

    const operate = async (action: ActionType, record?: any) => {
        const { params, request } = rest?.modalProps || {}
        const payload = Object.assign(record||{}, params||{})
        switch(action) {
            case 'add': {
                return createAction(action, {
                    ...rest?.modalProps,
                    params: {},
                    request: request ? () => request?.(action, payload) : undefined,
                    onFinish: async(values?: any) => {
                        const success = await onSave?.(action, payload, values)
                        success && onSuccess?.()
                    }
                })
            }
            case 'update': {
                return createAction(action, {
                    ...rest?.modalProps,
                    params: Object.assign(record||{}, params||{}),
                    request: request ? () => request?.(action, payload) : undefined,
                    onFinish: async(values?: any) => {
                        const success = await onSave?.(action, payload, values)
                        success && onSuccess?.()
                    }
                })
            }
            case 'del':
                return Modal.confirm({
                    title: '确认要删除该数据吗?',
                    content: '删除后当前内容将永久删除，不可恢复。',
                    okText: '确认',
                    cancelText: '取消',
                    onOk: async () => {
                        const success = await onSave?.(action, payload, {selectedRowKeys})
                        if (success) {
                            onSuccess?.()
                            return Promise.resolve()
                        }
                        return Promise.reject()
                    }
                });
            default:
                return onSave?.(action, payload)
        }
    }

    const createColumns = () => typeof columns === 'function' ? columns?.({operate, hasPermission}) : columns
    const toolbarActions = () => (typeof toolbar?.actions === 'function') ? ((toolbar||{}).actions as any)?.({operate, hasPermission, selectedRowKeys}) : toolbar?.actions

    return (<>
       <ProTable 
            columns={createColumns() as ProColumns<any, any>[]}
            toolbar={{
                ...toolbar,
                actions: toolbarActions(),
            }}
            actionRef={actionRef}
            rowSelection={rowSelection}
            {...rest}
       />
       <ModalForm<any> 
            layout="horizontal" 
            width={500} 
            labelCol={{span: 4}} 
            {...rest?.modalProps}
            {...modalProps}
        >
            {children}
        </ModalForm>
    </>)
}




function ProTablePlus({addTrigger, columns, ...rest}: ProTablePlusProps<any, any, any>) {
    const [open, setOpen] = useState(false)
    const {
        modalProps,
        onSuccess,
        createAction
    } = useModalHook({})

    const addColumns = columns?.filter(column => column.hideInAdd !== true).map(column => ({...column, width: 'md'}))
    return (<>
       <ProTable
            columns={columns}
            {...rest}
       />
       <BetaSchemaForm<any>
            open={open}
            onFinish={async (values) => {
                console.log(values);
            }}
            layoutType="ModalForm"
            layout="horizontal"
            labelCol={{span: 4}}
            wrapperCol={{span: 16}}
            columns={addColumns as any}
            {...modalProps as any}
        />
    </>)
}


export default ProTablePlus