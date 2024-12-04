import { useEffect, useMemo, useState } from "react"
import { Button, Tabs, Tree, Radio, Space, Spin } from "antd"
import { WithSearchTreeWarp, WithSearchTree, WithSearchTreeModalForm } from "@/components"
import { ModalForm, ProFormTextArea, } from '@ant-design/pro-form';
import { 
    sysRoleAdd, 
    sysRoleDel, 
    sysRoleUpdate, 
    sysRoleAuthList, 
    sysRoleAuthListByRole, 
    sysRoleAuthUpdate, 
    sysRoleGetDataAuth, 
    sysRoleDataAuthSave,  
    sysRoleList
} from '@/api'

import { useModalHook, usePermissionHook } from "@/hooks";
import type { ModalFormProps } from '@ant-design/pro-form' 
import { handleCommonTreeData, productApi } from "@/utils";
import { useRequest } from "ahooks";
 
type OperateActionType = '添加' | '编辑' | '删除' | '修改' | '全部展开' | '全部收起' | '全选' | '取消全选' | 'add' | 'update' | 'del' | '保存'

// 角色列表
const getRoleApi = productApi(sysRoleList)
const addRoleApi = productApi(sysRoleAdd)
const updateRoleApi = productApi(sysRoleUpdate)
const delRoleApi = productApi(sysRoleDel)
const getRoleAuthAllApi = productApi(sysRoleAuthList)
const getRoleAuthByIdApi = productApi(sysRoleAuthListByRole)
const getRoleAuthSaveApi = productApi(sysRoleAuthUpdate)
const getRoleDataAuthApi = productApi(sysRoleGetDataAuth)
const saveRoleDataAuthApi = productApi(sysRoleDataAuthSave)

const getExpandedKeys = (data: any[]) => {
    const checked: any[] = []
    const halfChecked: any[] = []
    const deps = (data: any[]) => {
        data.forEach(({id, children}, i) => {
            children && children.length ? halfChecked.push(id) : checked.push(id)
            deps(children||[])
        })
    }
    deps(data)
    return { checked, halfChecked}
}


function Role ({...rest}) {
    const { hasPermission } = usePermissionHook()

    const getTreeDataApi = async () => {
        const { data } = await sysRoleList({})
        const { newTreeData: treeData } = handleCommonTreeData(data||[], ({roleName, roleId, ...rest}) => ({title: roleName, key: roleId, roleName, roleId, ...rest}))
        return treeData
    }

    const calcShowIcons = () => {
        // const add = hasPermission(-1) ? 'add' : undefined
        const del = hasPermission(-1) ? 'del' : undefined
        const update = hasPermission(-1) ? 'update' : undefined
        return [update, del].filter(Boolean)
    }

    const onSave = async (action: OperateActionType, record?: any, payload?: any) => {
        const { roleId } = record || {}
        switch (action) {
            case 'add': {
                const { success } = await addRoleApi(payload, true)
                return success
            }
            case 'update': {
                const params = { ...payload, roleId }
                const { success } = await updateRoleApi(params, true)
                return success
            }
        }
    }

    return (<WithSearchTreeModalForm 
        noChildren={true}
        title="角色列表"
        titleIcon
        request={getTreeDataApi}
        onSave={onSave}
        showIcons={calcShowIcons()}
        modalProps={{
            request: async(action, payload: any) => {
                const { roleName } = payload || {}
                return {
                    roleName
                }
            }
        }}
        {...rest}
    >
        <ProFormTextArea fieldProps={{ rows:1, showCount: true,  maxLength: 10 }} width="md" name="roleName" label="角色名称" rules={[{required: true, message: '请填写角色名称'}]} />
    </WithSearchTreeModalForm>)
}



type OperateAuthProps = {
    params: any
}
// 操作权限
function OperateAuth({params}: OperateAuthProps) {
    const [loading, setLoading] = useState<boolean>(false)
    const [expandedKeys, setExpandedKeys] = useState<string[]>([])
    const [checkedKeys, setCheckedKeys] = useState<{checked: any[]; halfChecked: any[]}>({checked: [], halfChecked: []})

    const { data } = useRequest(sysRoleAuthList) as any
    const { data: treeData } = data || {}
    const onExpand = (expandedKeys: any[], {expanded: bool, node}: any) => {
        const { id } = node
        const newExpandedKeys = bool ? [...expandedKeys, id] : expandedKeys.filter(v => v !== id)
        setExpandedKeys(newExpandedKeys)
    }

    const onTreeCheck = (checkedKeys: any[], {checked: bool, checkedNodes, node, event, halfCheckedKeys}: any) => {
        setCheckedKeys({ checked: checkedKeys, halfChecked: halfCheckedKeys })
    }

    const operate = (action: OperateActionType, record?: any) => {
        switch (action) {
            case '全选': {
                const { checked, halfChecked } = getExpandedKeys(treeData)
                setCheckedKeys({ checked, halfChecked})
                return
            }
            case '取消全选': 
                return setCheckedKeys({checked: [], halfChecked: []})
            case '全部展开': {
                const { halfChecked } = getExpandedKeys(treeData)
                setExpandedKeys(halfChecked)
                return
            }
            case '全部收起':
                return setExpandedKeys([])
            case '保存':
                return getRoleAuthSaveApi({...params, auths: [...checkedKeys.checked, ...checkedKeys.halfChecked]}, true)
        }
    }

    const calcCheckText = checkedKeys?.checked?.length ? '取消全选' : '全选'
    const calcExpandedText = expandedKeys?.length ? '全部收起' : '全部展开'

    useEffect(() => {
        if (params?.roleId) {
            setLoading(true)
            getRoleAuthByIdApi(params, false, (data: any[]) => { 
                const { checked } = getExpandedKeys(treeData)
                const calcChecked: any[] = []
                const calcHalfChecked: any[] = []
                const uniqueData = [...new Set([...(data||[])])]
                uniqueData.forEach( id => checked.includes(id) ? calcChecked.push(id) : calcHalfChecked.push(id))
                setCheckedKeys({checked: calcChecked, halfChecked: calcHalfChecked})
                setLoading(false)
            })
        }
    }, [params])

    return (<div className="px-4">
        <div className="mb-4">
            <Button style={{marginRight: 10}} onClick={() => operate?.(calcExpandedText)}>{calcExpandedText}</Button>
            <Button style={{marginRight: 10}} onClick={() => operate?.(calcCheckText)}>{calcCheckText}</Button>
        </div>
        <Spin spinning={loading}>
            <Tree 
                fieldNames={{title: 'name', key: 'id', children: 'children'}} 
                height={360} 
                expandedKeys={expandedKeys} 
                onExpand={onExpand} 
                checkedKeys={{...checkedKeys}}
                onCheck={onTreeCheck as any} 
                treeData={treeData||[]} 
                checkable 
                className="rounded p-4 border border-gray-200"
            />
        </Spin>
        <div className="flex justify-between mt-4">
            <span>已选 {[...checkedKeys.checked, ...checkedKeys.halfChecked].length}</span> 
            <Button type="primary" onClick={() => operate?.('保存')}>保存</Button>
        </div>
    </div>)
}

// 数据权限
function DataAuth({ params }: OperateAuthProps) {
    const operate = (action: OperateActionType, record?: any) => {
        switch (action) {
            case '保存':
                return saveRoleDataAuthApi({}, true)
        }
    }

    useEffect(() => {
        if (params?.roleId) {
            getRoleDataAuthApi(params, false, () => {
                // setWorkTreeCheckedKeys(deptId)
                // setDataAuthValue(dataScope)
            })
        }
    }, [params])

    return (<div className="px-4">
        <p className="mb-4 text-gray-400">设置该角色可以操作的数据范围（包括：读取、修改、删除、转移）</p>
        <div className="rounded p-4 border border-gray-200">
            <Radio.Group >
                <Space direction="vertical">
                    <Radio value={0}>本人</Radio>
                    <Radio value={3}>本部门</Radio>
                    <Radio value={4}>本部门及下级部门</Radio>
                    <Radio value={1}>全部</Radio>
                    <Radio value={2}>自定义</Radio>
                </Space>
            </Radio.Group>
            <Space direction="vertical" className="ml-10 text-gray-400">
                    <div>只能操作自己的数据</div>
                    <div>能操作自己和自己所属部门的数据</div>
                    <div>能操作自己和自己所属部门及其子部门的数据</div>
                    <div>能操作全公司的数据</div>
                    <div>自定义，自定义选择操作多个部门的数据</div>
            </Space>
            {/* { [2].includes(dataAuthValue) ? <Tree style={{ marginTop:'20px' }} height={250} treeData={deptTreeData} checkable checkedKeys={workTreeCheckedKeys} onCheck={setWorkTreeCheckedKeys as any} /> : null } */}
        </div>
        <div className="flex justify-end mt-4">
            <Button type="primary" onClick={() => operate?.('保存')}>保存</Button>
        </div>
    </div>)
}


function RoleView({ params }: OperateAuthProps) {
    const items = [
        {
            key: '1',
            label: '操作权限',
            children: <OperateAuth params={params} />,
        },
        {
            key: '2',
            label: '数据权限',
            children: <DataAuth params={params} />,
        },
    ]
    return (<Tabs defaultActiveKey="1" items={items} style={{background:'#fff', flex: 1}} tabBarStyle={{paddingLeft: 20}} />)
}

function RolePage() {
    const [currentRole, setCurrentRole] = useState<{roleId?: string, roleName?: string}>({})
    const onSelect = ([currentId]: any, { node }: any) => {
        const { roleId, roleName } = node || {}
        const newCurrentRole = currentId ? { roleId, roleName } : {}
        setCurrentRole(newCurrentRole)
    }
    const RoleMemo = useMemo(() => <Role onSelect={onSelect} />, [])
    const RoleViewMemo = useMemo(() => <RoleView params={currentRole} />, [currentRole])
    return (<div style={{display: 'flex', width: '100%'}}>
                <div style={{width: '265px', marginRight: '16px'}}>
                    {RoleMemo}
                </div>
                {RoleViewMemo}
            </div>)
}

export default RolePage
