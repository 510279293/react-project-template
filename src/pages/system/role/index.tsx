import { useEffect, useRef, useState } from "react"
import { Button, Tabs, Tree, Input, Radio, Space, Modal, RadioChangeEvent, message, Spin } from "antd"
import { WithSearchTreeWarp, Icon } from "@/components"
import { ModalForm, ProFormTextArea, ProFormInstance } from '@ant-design/pro-form';
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

import { usePermissionHook } from "@/hooks";
import type { ModalFormProps } from '@ant-design/pro-form' 
import { productApi } from "@/utils";
import { isFunction } from "lodash";

type OperateActionType = '添加' | '编辑' | '删除' | '修改' | '全部展开' | '全部收起' | '全选' | '取消全选' | '行点击'

type OnSaveActionType = '操作权限' | '数据权限'

type RoleListItem = {
    roleId: string | number;
    roleName: string;
}
type RoleListActions = '修改' | '删除'
type RoleListProps = {
    activeClassName?: (v: RoleListItem) => string | string;
    list: RoleListItem[];
    showIcons?: (RoleListActions | string | undefined)[]
    operate?: (type: OperateActionType, record?: any) => void
}

const { TabPane } = Tabs
const { Search } = Input

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

const AddRole = (props: ModalFormProps) => {
    return (<ModalForm<any> modalProps={{maskClosable: false}} layout="horizontal" width={500} labelCol={{span: 4}} {...props}>
            <ProFormTextArea fieldProps={{ rows:1, showCount: true,  maxLength: 10 }} width="md" name="roleName" label="角色名称" rules={[{required: true, message: '请填写角色名称'}]} />
        </ModalForm>)
}

const RoleList: (props: RoleListProps) => any = ({list = [], activeClassName, showIcons, operate}: RoleListProps) => {
    const onClick = (e: Event, type: OperateActionType, v: RoleListItem) => {
        e.stopPropagation()
        operate && operate(type, v)
    }
    const calcActiveClassName = (v: any) => isFunction(activeClassName) ? activeClassName(v) : activeClassName
    
    return list.map((v: RoleListItem) => 
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #eee', cursor: 'pointer'}} key={v.roleId} onClick={(e) => onClick(e as unknown as Event, '行点击', v)}>
            <span><Icon type="icon-guanliyuan" /> {v.roleName} </span>
           { v.roleName !== '超级管理员' && <div>
                {showIcons?.includes('修改') ? <Icon type="icon-web-icon-" className="role-list-item-icon" onClick={(e) => onClick(e as unknown as Event, '修改', v)} /> : null}
                {showIcons?.includes('删除') ? <Icon type="icon-shanchu" className="role-list-item-icon" onClick={(e) => onClick(e as unknown as Event, '删除', v)} /> : null}
            </div>}
        </div>)
}

export default function Role () {
    const [addRoleProps, setAddRoleProps] = useState<ModalFormProps>({title: '新增角色', visible: false, onFinish: undefined})
    const [roleList, setRoleList] = useState<RoleListItem[]>([])
    const [treeData, setTreeData] = useState<any[]>([])
    const [expandedKeys, setExpandedKeys] = useState<string[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    
    const [checkedKeys, setCheckedKeys] = useState<{checked: any[]; halfChecked: any[]}>({checked: [], halfChecked: []})
    // 组织架构树选中后存储的key list
    const [workTreeCheckedKeys, setWorkTreeCheckedKeys] = useState<string[]>([])
    const [currentRoleId, setCurrentRoleId] = useState<string>()
    const [dataAuthValue, setDataAuthValue] = useState<number>(0)
    // const [deptTreeData] = useDeptDataHooks({type: 1}, true)
    const deptTreeData: any[] = []
    const { hasPermission } = usePermissionHook()

    const formRef = useRef<ProFormInstance>()

    const roleSearch = (val: string) => {
        getRoleListApi({roleName: val})
    }
    const getRoleListApi = async (param: any) => {
        await getRoleApi(param, false, (data: RoleListItem[]) => {
            setRoleList(data||[])
        })
    }
    const getRoleAuthAllListApi = async (param: any) => {
        await getRoleAuthAllApi(param, false, (data: any[]) => {
            setTreeData(data)
        })
    }

    const onExpand = (expandedKeys: any[], {expanded: bool, node}: any) => {
        const { id } = node
        const newExpandedKeys = bool ? [...expandedKeys, id] : expandedKeys.filter(v => v !== id)
        setExpandedKeys(newExpandedKeys)
    }

    const onTreeCheck = (checkedKeys: any[], {checked: bool, checkedNodes, node, event, halfCheckedKeys}: any) => {
        setCheckedKeys({ checked: checkedKeys, halfChecked: halfCheckedKeys })
    }
    const onSave = async (type: OnSaveActionType) => {
        if (!currentRoleId) {
            message.error('请先选择一个角色');
            return
        } 
        if (type === '操作权限') {
          await getRoleAuthSaveApi({roleId: currentRoleId, auths: [...checkedKeys.checked, ...checkedKeys.halfChecked]}, true)
        } else if(type === '数据权限') {
          await saveRoleDataAuthApi({roleId: currentRoleId, dataScope: dataAuthValue, deptId: dataAuthValue === 2 ? workTreeCheckedKeys : []}, true)
        }
    }

    const operate = async (type: OperateActionType, record?: any) => {
        const { roleId, roleName } = record || {}
        if(['删除'].includes(type)) {
            Modal.confirm({
                title: '确认要删除该数据吗?',
                content: '删除后当前内容将永久删除，不可恢复。',
                okText: '确认',
                cancelText: '取消',
                onOk: async() => {
                    await delRoleApi({roleId, roleName}, true, () => {
                        getRoleListApi({roleName: ''})
                    })
                },
            });
        } else if (type === '添加') {
            formRef.current?.setFieldsValue({roleName: ''})
            setAddRoleProps({
                ...addRoleProps,
                title: '添加角色',
                visible: true,
                onFinish: async (values: any) => {
                    await addRoleApi(values, true, () => {
                        getRoleListApi({roleName: ''})
                        setAddRoleProps({...addRoleProps, visible: false})
                    })
                }
            })
        } else if (type === '修改') {
            formRef.current?.setFieldsValue({roleName})
            setAddRoleProps({
                ...addRoleProps,
                title: '修改角色',
                visible: true,
                onFinish: async (values: any) => {
                    await updateRoleApi({...values, roleId}, true, () => {
                        getRoleListApi({roleName: ''})
                        setAddRoleProps({...addRoleProps, visible: false})
                    })
                }
            })
        } else if (type === '全部展开') {
            const { halfChecked } = getExpandedKeys(treeData)
            setExpandedKeys(halfChecked)
        } else if (type === '全部收起') {
            setExpandedKeys([])
        } else if (type === '全选') {
            const { checked, halfChecked } = getExpandedKeys(treeData)
            setCheckedKeys({ checked, halfChecked})
        } else if (type === '取消全选') {
            setCheckedKeys({checked: [], halfChecked: []})
        } else if (type === '行点击') {
            setLoading(true)
            setCurrentRoleId(roleId)
            await getRoleAuthByIdApi({roleId}, false, (data: any[]) => { 
                const { checked, halfChecked } = getExpandedKeys(treeData)
                const calcChecked: any[] = []
                const calcHalfChecked: any[] = []
                const uniqueData = [...new Set([...(data||[])])]
                uniqueData.forEach( id => {
                    checked.includes(id) ? calcChecked.push(id) : calcHalfChecked.push(id)
                })
                setCheckedKeys({checked: calcChecked, halfChecked: calcHalfChecked})
                setLoading(false)
            })
            await getRoleDataAuthApi({roleId}, false, ({dataScope,data, deptId}: any) => {
                setWorkTreeCheckedKeys(deptId)
                setDataAuthValue(dataScope)
            })
        }
    }

    useEffect(() => {
        getRoleListApi({roleName: ''})
        getRoleAuthAllListApi({})
    }, [])
    
    const calcShowIcons = () => {
        const update = hasPermission(1010) ? '修改' : undefined
        const del = hasPermission(1011) ? '删除' : undefined
        return [update, del].filter(Boolean)
    }
    return <div className="system-roles" style={{display: 'flex'}}>
            <div style={{width: '265px', marginRight: '16px'}}>
                <WithSearchTreeWarp title="角色权限" Icon={hasPermission(1009) ? false : ' '} onOperate={() => operate('添加', null)}>
                    <Search placeholder="请输入关键字" style={{width: '100%', marginBottom: '12px'}} onChange={(e) => roleSearch(e.target.value)} enterButton />
                    <div>
                        <RoleList list={roleList} showIcons={calcShowIcons()} operate={operate} activeClassName={(v: RoleListItem) => v.roleId === currentRoleId ? 'activeClassName' : '' } />
                    </div>
                </WithSearchTreeWarp>
            </div>
            <Tabs defaultActiveKey="1" style={{background:'#fff', flex: 1}} tabBarStyle={{paddingLeft: 20}}>
                <TabPane tab="操作权限" key="1">
                    <div style={{boxSizing: 'border-box', padding: '0 20px'}}>
                        {
                            hasPermission(1013) ? <><div style={{marginBottom: 16}}>
                                <Button style={{marginRight: 10}} onClick={() => operate && operate('全部展开')}>全部展开</Button>
                                <Button style={{marginRight: 10}} onClick={() => operate && operate('全部收起')}>全部收起</Button>
                                <Button style={{marginRight: 10}} onClick={() => operate && operate('全选')}>全选</Button>
                                <Button onClick={() => operate && operate('取消全选')}>取消全选</Button>
                            </div>
                            <Spin spinning={loading}>
                                <Tree 
                                    fieldNames={{title: 'name', key: 'id', children: 'children'}} 
                                    height={360} 
                                    expandedKeys={expandedKeys} 
                                    onExpand={onExpand} 
                                    checkedKeys={{...checkedKeys}}
                                    onCheck={onTreeCheck as any} 
                                    treeData={treeData} 
                                    checkable 
                                    // checkStrictly={true}
                                    style={{border: '1px solid #E8E8E8',height: '400px', borderRadius: 4, boxSizing: 'border-box', padding: 16}} 
                                />
                            </Spin>
                            <div style={{display: 'flex', justifyContent: 'space-between', margin: '20px 0'}}>
                            <span>已选 {[...checkedKeys.checked, ...checkedKeys.halfChecked].length}</span> 
                            {hasPermission(2108) ? <Button type="primary" onClick={() => onSave && onSave('操作权限')}>保存</Button> : null}
                            </div></> : null
                        }
                    </div>
                </TabPane>
                <TabPane tab="数据权限" key="2">
                    <div style={{boxSizing: 'border-box', padding: '0 20px'}}>
                        <p style={{color: 'rgba(0, 0, 0, 0.45)', marginBottom: 16}}>设置该角色可以操作的数据范围（包括：读取、修改、删除、转移）</p>
                        <div style={{border: '1px solid #E8E8E8', borderRadius: 4, boxSizing: 'border-box', padding: 16}}>
                            <Radio.Group value={dataAuthValue} onChange={(e: RadioChangeEvent) => setDataAuthValue(e.target?.value)}>
                                <Space direction="vertical">
                                    <Radio value={0}>本人</Radio>
                                    <Radio value={3}>本部门</Radio>
                                    <Radio value={4}>本部门及下级部门</Radio>
                                    <Radio value={1}>全部</Radio>
                                    <Radio value={2}>自定义</Radio>
                                </Space>
                            </Radio.Group>
                            <Space direction="vertical" style={{marginLeft: 120, color: 'rgba(0, 0, 0, 0.45)'}}>
                                    <div>只能操作自己的数据</div>
                                    <div>能操作自己和自己所属部门的数据</div>
                                    <div>能操作自己和自己所属部门及其子部门的数据</div>
                                    <div>能操作全公司的数据</div>
                                    <div>自定义，自定义选择操作多个部门的数据</div>
                            </Space>
                            { [2].includes(dataAuthValue) ? <Tree style={{ marginTop:'20px' }} height={250} treeData={deptTreeData} checkable checkedKeys={workTreeCheckedKeys} onCheck={setWorkTreeCheckedKeys as any} /> : null }
                        </div>
                        <div style={{display: 'flex', justifyContent: 'end', margin: '20px 0'}}>
                            { hasPermission(2109) ? <Button type="primary" onClick={() => onSave && onSave('数据权限')}>保存</Button> : null }
                        </div>
                    </div>
                </TabPane>
           </Tabs>
           <AddRole formRef={formRef} {...addRoleProps} modalProps={{onCancel: () => setAddRoleProps({...addRoleProps, visible:false}), maskClosable: false}} />
    </div>
}

