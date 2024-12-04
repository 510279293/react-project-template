import ProTable, { ActionType, ProTableProps } from "@ant-design/pro-table";
import { Button, Modal, Splitter, message } from "antd";
import { useEffect, useMemo, useRef, useState } from "react"
import { columnsFn, OperateActionType, TableListItem } from "./data";
import { ModalForm, ProFormText, ProFormTextArea, ProFormRadio, ProFormDigit } from '@ant-design/pro-form';
import { sysDictList, sysDictListRight, sysDictAdd,sysDictDelete, sysDictUpdate, sysDictOptionAdd, sysDictOptionUpdate, sysDictOptionDel } from '@/api'
import { usePermissionHook } from "@/hooks";
import { handleCommonTreeData, productApi } from "@/utils";
import { ProTableModalForm, WithSearchTreeModalForm } from "@/components";

// const getApi = productApi(sysDictList)
const getRightApi = productApi(sysDictListRight)
const addDictApi = productApi(sysDictAdd)
const updateDictApi = productApi(sysDictUpdate)
const delDictApi = productApi(sysDictDelete)
const addApi = productApi(sysDictOptionAdd)
const updateApi = productApi(sysDictOptionUpdate)
const delApi = productApi(sysDictOptionDel)

function Dictionary ({...rest}) {
    const { hasPermission } = usePermissionHook()

    const getTreeDataApi = async () => {
        const { data } = await sysDictList({})
        const { newTreeData: treeData } = handleCommonTreeData(data||[], ({dictName, dictId, ...rest}) => ({title: dictName, key: dictId, dictName, dictId, ...rest}))
        return treeData
    }

    const calcShowIcons = () => {
        const add = hasPermission(-1) ? 'add' : undefined
        const update = hasPermission(-1) ? 'update' : undefined
        return [add, update].filter(Boolean)
    }

    const onSave = async (action: OperateActionType, record?: any, values?: any) => {
        const { dictId } = record || {}
        switch(action) {
            case 'add': {
                const { success } = await addDictApi({ parentId: dictId, ...values })
                return success
            }
            case 'update': {
                const { success } = await updateDictApi({ dictId, ...values })
                return success
            }
        }
    }

    return (<WithSearchTreeModalForm
                title="数据字典"
                showIcons={calcShowIcons()}
                request={getTreeDataApi}
                modalProps={{
                    request: async(action: any, payload: any) => {
                        const { dictName } = payload || {}
                        return {
                            parentName: dictName,
                            dictName: action === 'add' ? undefined : dictName,
                        }
                    }
                }}
                onSave={onSave}
                {...rest}
            >
                <ProFormText width="md" name="parentName" disabled label="所属应用" rules={[{required: false, message: '请填写'}]} />
                <ProFormTextArea fieldProps={{ rows:1, showCount: true,  maxLength: 30 }} width="md" name="dictName" label="字典名称" rules={[{required: true, message: '请填写字典名称'}]} />
            </WithSearchTreeModalForm>)
}


async function request(params: any, sorter: any, filter: any) {
    const { data } = await getRightApi({...params}, false)
    const { total = 0, values = []}  = data || {}
    return {
        data: values,
        success: true,
        total
    }
}

function DictionaryOptions ({...rest}: ProTableProps<any, any>) {

    // const calcDisabled = () => !params?.dictId
    const modalRequest = async (action: any, payload: any) => {
        console.log('-----payload', payload)
        const {
            dictName,
            optionName,
            status,
            sort,
        } = payload || {}

        return {
            dictName: rest.params?.dictName || dictName,
            optionName,
            status,
            sort,
        }
    }
    const onSave = async (action: any, record: any, values: any) => {
        const { optionId } = record || {}
        switch (action) {
            case 'add': {
                const { success } = await addApi({ ...rest?.params, ...values })
                return success
            }
            case 'update': {
                const { success } = await updateApi({ optionId, ...values })
                return success
            }
        }
    }


    return (<ProTableModalForm 
                rowKey="optionId"
                columns={columnsFn as any}
                request={request}
                toolbar={{
                    actions: ({operate}) => [
                        <Button key="btn6" type="primary" onClick={() => operate?.('add', null)}>配置选项</Button>
                    ],
                }}
                onSave={onSave}
                modalProps={{
                    request: modalRequest
                }}
                {...rest}
                rowSelection={false}
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
            </ProTableModalForm>)
}

function DictionaryPage() {
    const [currentDictionary, setCurrentDictionary] = useState<{dictId?: string, dictName?: string}>({})
    const onSelect = ([currentId]: any, { node }: any) => {
        const { dictId, dictName } = node || {}
        const newCurrentDictionary = currentId ? { dictId, dictName } : {}
        setCurrentDictionary(newCurrentDictionary)
    }
    const DictionaryMemo = useMemo(() => <Dictionary onSelect={onSelect} />, [])
    const DictionaryOptionsMemo = useMemo(() => <DictionaryOptions params={currentDictionary} />, [currentDictionary])
    return (<Splitter className="junc-splitter">
        <Splitter.Panel defaultSize="30%" min="20%" max="70%">
            {DictionaryMemo}
        </Splitter.Panel>
        <Splitter.Panel>
            {DictionaryOptionsMemo}
        </Splitter.Panel>
    </Splitter>)
}

export default DictionaryPage
