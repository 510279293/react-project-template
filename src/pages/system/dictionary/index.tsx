import ProTable, { ActionType } from "@ant-design/pro-table";
import { Button, Modal, message } from "antd";
import { useEffect, useRef, useState } from "react"
import { columnsFn, OperateActionType, TableListItem } from "./data";
import { ModalForm, ProFormText, ProFormTextArea, ProFormRadio, ProFormDigit } from '@ant-design/pro-form';
import { sysDictList, sysDictListRight, sysDictAdd,sysDictDelete, sysDictUpdate, sysDictOptionAdd, sysDictOptionUpdate } from '@/api'
import type { ModalFormProps, ProFormInstance } from '@ant-design/pro-form' 
import { usePermissionHook } from "@/hooks";
import { productApi } from "@/utils";
import { WithSearchTree, WithSearchTreeWarp } from "@/components";

const getApi = productApi(sysDictList)
const getRightApi = productApi(sysDictListRight)
const addDictApi = productApi(sysDictAdd)
const updateDictApi = productApi(sysDictUpdate)
const deleteDictApi = productApi(sysDictDelete)
const addDictOptApi = productApi(sysDictOptionAdd)
const updateDictOptApi = productApi(sysDictOptionUpdate)


const transformTreeData = (data: [] = []) => {
    const deps = (data: []) => {
       data.forEach((v: any) => {
           v.title = v.dictName
           v._title = v.dictName
           v.key = v.dictId
           v.children && deps(v.children)
       })
    }
    deps(data as any)
    return data
}

// 添加字典
interface AddDictionaryProps extends ModalFormProps{
    params?: any;
    onSuccess?: () => void | null;
}
export const AddDictionary = ({params, onSuccess, ...rest}: AddDictionaryProps) => {
    const onFinish = async (values: any) => {
        const {parentId, ...rest} = params || {} // 添加params = { dictName, dictId }; 修改params = { dictName, dictId, parentId}
        const whichApi = parentId !== undefined ? updateDictApi : addDictApi
        const { success } = await whichApi({...values, ...params}, false, onSuccess)
        return success
    }
    return (<ModalForm<any> 
            layout="horizontal" 
            modalProps={{
                maskClosable: false, 
                destroyOnClose: true
            }} 
            width={500} 
            labelCol={{span: 4}} 
            onFinish={onFinish} 
            params={params} 
            {...rest}
        >
            <ProFormText width="md" name="app" disabled label="所属应用" rules={[{required: false, message: '请填写'}]} />
            <ProFormTextArea fieldProps={{ rows:1, showCount: true,  maxLength: 30 }} width="md" name="dictName" label="字典名称" rules={[{required: true, message: '请填写字典名称'}]} />
            <ProFormDigit width="md" name="sort" label="排序字段" rules={[{required: false, message: '数值越大排名越前'}]} />
        </ModalForm>)
}

interface AddOptionsProps extends ModalFormProps{
    params?: any;
    onSuccess?: () => void;
}
// 配置/编辑选项 
export const AddOptions = ({params, onSuccess, ...rest}: AddOptionsProps) => {
    const onFinish = async (values: any) => {
        const { optionId } = params || {}
        const whichApi = optionId ? updateDictOptApi : addDictOptApi
        const { success } = await whichApi({...values, ...params}, true, onSuccess)
        return success
    }
    return (<ModalForm<AddOptionsProps> 
            modalProps={{
                maskClosable: false, 
                destroyOnClose: true
            }} 
            layout="horizontal" 
            width={500} 
            labelCol={{span: 4}} 
            onFinish={onFinish} 
            params={params} 
            {...rest}
        >
            <ProFormText width="md" name="dictName" disabled label="字典名称" rules={[{required: false, message: '请填写'}]} />
            <ProFormTextArea 
                fieldProps={{ 
                    rows:1, 
                    // showCount: true,  
                    // maxLength: 20 
                }} 
                width="md" 
                name="optionName" 
                label="选项名称" 
                rules={[{required: true, message: '请填写选项名称'}]} 
            />
            <ProFormRadio.Group width="md" name="status" label="状态" options={[{label: '启用', value: '1'}, {label: '禁用', value: '0'}]} rules={[{required: true, message: '请选择状态'}]} />
            <ProFormDigit width="md" name="sort" label="排序字段" rules={[{required: false, message: '数值越大排名越前'}]} />
        </ModalForm>)
}

function Dictionary () {
    const [treeData, setTreeData] = useState([])
    const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true)
    const [expandedKeys, setExpandedKeys] = useState<string[]>([])
    const [currentTreeDataItem, setCurrentTreeDataItem] = useState<any>(null)

    const [addDictionaryProps, setAddDictionaryProps] = useState<AddDictionaryProps>({visible: false, title: '添加字典', request: undefined, onSuccess: undefined})
    const [addOptionsProps, setAddOptionsProps] = useState<AddOptionsProps>({visible: false, title: '添加属性', request: undefined, onSuccess: undefined})

    const addDictionaryFormRef = useRef<ProFormInstance>()
    const addOptionsDormRef = useRef<ProFormInstance>()
    const { hasPermission } = usePermissionHook()

    const ref = useRef<ActionType>(null);
    const dataSourceRef = useRef<any[]>([])

    const operate = (type: OperateActionType, record?: TableListItem | null) => {
        const { dictId } = currentTreeDataItem || {}
        const { optionId, dictName, optionName = '', status = 0 } = record || {}
        // addOptionsDormRef.current?.setFieldsValue({dictName, optionName, status})
        if(['配置选项'].includes(type)) {
            if (dictId === undefined) {
                message.warning('请先选择一个字典');
                return
            }
            // addOptionsDormRef.current?.setFieldsValue({dictName: currentTreeDataItem?.dictName})
            setAddOptionsProps({
                ...addOptionsProps,
                title: '配置选项',
                visible: true,
                params: { dictId },
                request: async (params: any) => {
                    return {
                        dictName: currentTreeDataItem?.dictName,
                        optionName,
                        status
                    }
                },
                onSuccess: () => {
                    ref.current?.reload()
                    setAddOptionsProps({...addOptionsProps, visible: false})
                }
            })
        } else if (type === '编辑') {
            setAddOptionsProps({
                ...addOptionsProps,
                title: '编辑',
                visible: true,
                params: { dictId, optionId },
                request: async (params: any) => {
                    return {
                        dictName,
                        optionName,
                        status
                    }
                },
                onSuccess: () => {
                    ref.current?.reload()
                    setAddOptionsProps({...addOptionsProps, visible: false})
                }
            })
        }
    }
    const columns = columnsFn(operate, hasPermission)
    const treeSearch = ({filterData, expandedKeys }: any) => {
        setTreeData(filterData)
        setExpandedKeys(expandedKeys)
    }
    const onExpand = (expandedKeys: any) => {
        setExpandedKeys(expandedKeys)
        setAutoExpandParent(false)
    }

    const getTreeDataApi = async (param: any) => {
        await getApi(param, false, (data: any[]) => {
            setTreeData(transformTreeData(data as any))
        })
    }

    const getTableDataApi = async (params: any, sorter: any, filter: any) => {
        const { data } = await getRightApi({...params, whetherDown: true, dictId: currentTreeDataItem?.dictId}, false)
        const { total = 0, values = []}  = data || {}
        dataSourceRef.current = values
        return {
            data: values,
            success: true,
            total
        }
    }

    const titleOperate = (nodeData: any, type: string) => {
        // dictId = 0 时添加一级字典类型   其余正常传id
        const { dictId = 0, dictName, parentId = undefined } = nodeData || {}
        if (type === 'add') {
            // addDictionaryFormRef.current?.setFieldsValue({app: dictName || "一级分类", dictName: ''})
            setAddDictionaryProps({
                ...addDictionaryProps,
                title: '添加字典',
                visible: true,
                params: {dictId},
                request: async (params: any) => {
                    return {
                        app: dictName || "一级分类", 
                        dictName: ''
                    }
                },
                onSuccess: () => {
                    setAddDictionaryProps({...addDictionaryProps, visible: false})
                    getTreeDataApi({})
                }
            })
         } else if (type === 'update') {
            // addDictionaryFormRef.current?.setFieldsValue({app: dictName, dictName})
            setAddDictionaryProps({
                ...addDictionaryProps,
                title: '修改字典',
                visible: true,
                params: {parentId, dictId},
                request: async (params: any) => {
                    return {
                        app: dictName, 
                        dictName
                    }
                },
                onSuccess: () => {
                    setAddDictionaryProps({...addDictionaryProps, visible: false})
                    getTreeDataApi({})
                }
            })
         } else if (type === 'titleClick') {
            //再次点击字典选项时置空  
            (nodeData?.dictId === currentTreeDataItem?.dictId) ? setCurrentTreeDataItem(null) : setCurrentTreeDataItem(nodeData)
         } else if (type === 'del') {
             Modal.confirm({
                 title: '确认要删除该数据吗?',
                 content: '删除后当前内容将永久删除，不可恢复。',
                 okText: '确认',
                 cancelText: '取消',
                 onOk: async (val: any) => {
                    await deleteDictApi({id: dictId}, true, () => {
                        setAddDictionaryProps({...addDictionaryProps, visible: false})
                        getTreeDataApi({})
                    })
                 },
            });
         }
    }
    const calcShowIcons = () => {
        const add = hasPermission(-1) ? 'add' : undefined
        const update = hasPermission(-1) ? 'update' : undefined
        return [add, update].filter(Boolean)
    }

    useEffect(() => {
        getTreeDataApi({})
    }, [])

    useEffect(() => {
        ref?.current?.reload()
    }, [currentTreeDataItem])

    return <div style={{display: 'flex', width: '100%'}}>
            <div style={{width: '265px', marginRight: '16px'}}>
                <WithSearchTreeWarp title="数据字典" Icon={hasPermission(-1) ? false : ' '} onOperate={() => titleOperate(null, 'add')}>
                    <WithSearchTree 
                       style={{marginTop: '12px'}} 
                       treeData={treeData} 
                       blockNode 
                       expandedKeys={expandedKeys} 
                       showIcons={calcShowIcons() as any[]} 
                       autoExpandParent={autoExpandParent} 
                       onExpand={onExpand} 
                       onSearch={treeSearch} 
                       titleOperate={titleOperate} 
                    />
                </WithSearchTreeWarp>
            </div>
            <ProTable<TableListItem>
                style={{flex: 1}}
                columns={columns}
                request={getTableDataApi}
                options={{reload: false, density: false, setting: false}}
                toolbar={{
                    actions: [
                        hasPermission(-1) ? <Button key="primary" type="primary" onClick={() => operate('配置选项')}>配置选项</Button> : null,
                    ],
                }}
                search={{
                    optionRender: (searchConfig, formProps, dom) => [ ...dom.reverse() ]
                }}
                rowKey="optionId"
                pagination={{defaultPageSize: 10}}
                actionRef={ref as any}
            />
            <AddDictionary {...addDictionaryProps} formRef={addDictionaryFormRef} modalProps={{onCancel: () => setAddDictionaryProps({...addDictionaryProps, visible: false}), maskClosable: false}} />
            <AddOptions {...addOptionsProps} formRef={addOptionsDormRef} modalProps={{onCancel: () => setAddOptionsProps({...addOptionsProps, visible: false}), maskClosable: false}} />
   </div>
}

export default Dictionary