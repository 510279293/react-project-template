import { ProTableProps } from "@ant-design/pro-table";
import { Button, Splitter } from "antd";
import { useMemo, useState } from "react"
import { columnsFn, OperateActionType } from "./data";
import { ProFormText, ProFormTextArea, ProFormRadio, ProFormSelect, ProFormDatePicker, ProFormTreeSelect } from '@ant-design/pro-form';
import { sysOrgStaffPageList, sysOrgDeptAdd, sysOrgDeptUpdate, sysOrgDeptDel, sysOrgStaffAdd, sysOrgStaffUpdate, sysOrgStaffDel } from '@/api'
import { usePermissionHook } from "@/hooks";
import { handleCommonTreeData, productApi } from "@/utils";
import { ProTableModalForm, WithSearchTreeModalForm } from "@/components";
import { emailReg, phoneReg, userNameReg } from "@junc/rc/dist/RegExp";
import { useSelector } from "react-redux";
import { StateType } from "@/store";

const userListApi = productApi(sysOrgStaffPageList)
const deptAddApi = productApi(sysOrgDeptAdd)
const deptUpdateApi = productApi(sysOrgDeptUpdate)
const deptDelApi = productApi(sysOrgDeptDel)
const userAddApi = productApi(sysOrgStaffAdd)
const userUpdateApi = productApi(sysOrgStaffUpdate)
const userDelApi = productApi(sysOrgStaffDel)
// 左边部门树
function DeptTree ({...rest}) {
    const [action, setAction] = useState<any>('') 
    const { hasPermission } = usePermissionHook()
    const orgTree = useSelector((state: StateType) => state.orgTree)  // 获取组织架构树
    const { filterTreeData: treeData } = handleCommonTreeData(orgTree||[], (v) => !v.whetherUser) // 部门树
    const { newTreeData } = handleCommonTreeData(orgTree||[], (v) => ({...v, disabled: !v.whetherUser})) // 负责人数据

    const calcShowIcons = () => {
        const add = hasPermission(-1) ? 'add' : undefined
        const update = hasPermission(-1) ? 'update' : undefined
        const del = hasPermission(-1) ? 'del' : undefined
        return [add, update, del].filter(Boolean)
    }

    const onSave = async (action: OperateActionType, record?: any, values?: any) => {
        const { id } = record || {}
        switch (action) {
            case 'add': {
                const { success } = await deptAddApi(values)
                return success
            }
            case 'update': {
                const { success } = await deptUpdateApi({...values, id})
                return success
            }
            case 'del': {
                const { success } = await deptDelApi({...values, id})
                return success
            }
        }
    }

    return (<WithSearchTreeModalForm 
                title="组织架构"
                treeData={treeData}
                onSave={onSave}
                showIcons={calcShowIcons()}
                modalProps={{
                    request: async(action: any, payload: any) => {
                        setAction(action)
                        const { name } = payload || {}
                        return {
                            name: action === 'update' ? name : undefined
                        }
                    }
                }}
                {...rest}
            >
                <ProFormTextArea fieldProps={{ rows:1, showCount: true,  maxLength: 20 }} name="name" label="部门名称" rules={[{required: true, message: '请填写部门名称'}]} />
                {action === 'update' ? <ProFormTreeSelect fieldProps={{treeData: newTreeData, showSearch: true, treeNodeFilterProp: 'title',allowClear:true}}  name="directorId" label="负责人" rules={[{required: true, message: '请选择负责人'}]} /> : null}
                {action === 'update' ? <ProFormSelect params={{dictId: 268}}  name="position" label="职位" rules={[{required: true, message: '请选择职位'}]} /> : null}
            </WithSearchTreeModalForm>)
}

const getListApi = async (params: any, sorter: any, filter: any) => {
    const { data } = await userListApi(params, false)
    const { values, total } = data || {}
    return {
        data: values,
        success: true,
        total
    }
}

// 右边员工列表
function StaffTable ({columns, ...rest}: ProTableProps<any, any>) {
    const orgTree = useSelector((state: StateType) => state.orgTree)  // 获取组织架构树
    const { filterTreeData: treeData } = handleCommonTreeData(orgTree||[], (v) => !v.whetherUser) // 部门树
    const modalRequest = async (action: any, payload: any) => {
        const {
            userName,
            name,
            gender,
            mobilePhoneNumber,
            userInfoStatus
        } = payload || {}

        return {
            userName,
            name,
            gender,
            mobilePhoneNumber,
            userInfoStatus
        }
    }
    const onSave = async (action: any, record: any, values: any) => {
        const { id } = record || {}
        console.log('action', action)
        switch (action) {
            case 'add': {
                const { success } = await userAddApi({ ...rest?.params, ...values })
                return success
            }
            case 'update': {
                const { success } = await userUpdateApi({ ...rest?.params, ...values, id })
                return success
            }
            case 'del': {
                const { success } = await userDelApi({ id })
                return success
            }
            
        }
    }

    const calcDisabled = () => !rest?.params?.deptId

    return (<ProTableModalForm 
                rowKey="id"
                columns={columnsFn}
                request={getListApi}
                toolbar={{
                    actions: ({operate}) => [
                        <Button key="btn6" type="primary" disabled={calcDisabled()} onClick={() => operate?.('add', null)}>新建员工</Button>
                    ],
                }}
                onSave={onSave}
                modalProps={{
                    request: modalRequest
                }}
                {...rest}
            >
                <ProFormText name="userName" label="登录账号" fieldProps={{maxLength: 20}} rules={[{required: true, }, { pattern: userNameReg , message: '名称只允许包含数字、字母' }]} />
                <ProFormText name="password" width={300} fieldProps={{ placeholder:"密码不可编辑"}} disabled label="登录密码" addonAfter={ <Button type="primary" ghost>复制</Button>} rules={[{required: false, message: '请填写登录密码'}]} />
                <ProFormText name="name" label="姓名" rules={[{required: true, message: '请填写姓名'}, {max: 30, type:'string', message: '30字以内'}]} />
                <ProFormRadio.Group name="gender" label="性别" initialValue={'0'} options={[{label: '男', value: '0'}, {label: '女', value: '1'}]} rules={[{required: true, message: '请选择性别'}]} />
                <ProFormText name="mobilePhoneNumber" fieldProps={{maxLength: 11}}  label="手机号" rules={[{required: true, message: '请填写手机号'}, { pattern: phoneReg, message: '请填写正确手机号格式' }]} />
                <ProFormText name="email" label="邮箱" rules={[{required: false, message: '请填写邮箱'}, { pattern: emailReg , message: '请填写正确邮箱格式' }, {max: 50, type:'string', message: '50字以内'}]} />
                <ProFormTreeSelect name="deptId" label="所属部门" fieldProps={{treeData, showSearch: true, treeNodeFilterProp: 'title',}} rules={[{required: false, message: '请选择所属部门'}]} />
                <ProFormSelect name="roles" label="所属角色" fieldProps={{options: [], mode: 'multiple'}} rules={[{required: false, message: '请选择所属角色'}]} />
                <ProFormDatePicker name="inductTime" label="入职时间" rules={[{required: true, message: '请填写入职时间'}]} />
                <ProFormSelect name="userInfoStatus" label="状态" initialValue={'0'} options={[{label: '在职', value: '0'}, {label: '离职', value: '1'},{label: '禁用', value: '2'}]} rules={[{required: true, message: '请选择状态'}]} />
            </ProTableModalForm>)
}


function Organization() {
    const [currentDept, setCurrentDept] = useState<{deptId?: string, deptName?: string}>({})
    const onSelect = ([currentId]: any, { node }: any) => {
        const { id: deptId, name: deptName } = node || {}
        const newCurrentDept = currentId ? { deptId, deptName } : {}
        setCurrentDept(newCurrentDept)
    }
    const DeptTreeMemo = useMemo(() => <DeptTree onSelect={onSelect} />, [])
    const StaffTableMemo = useMemo(() => <StaffTable params={currentDept} />, [currentDept])

    return (<Splitter className="junc-splitter">
                <Splitter.Panel defaultSize="30%" min="20%" max="70%">
                    {DeptTreeMemo}
                </Splitter.Panel>
                <Splitter.Panel>
                    {StaffTableMemo}
                </Splitter.Panel>
            </Splitter>)
}

export default Organization
