import { ProFormUploadSimple, ProTableModalForm } from "@/components"
import { ProFormRadio, ProFormText, ProTableProps } from "@ant-design/pro-components"
import { columnsFn } from "./data"
import { Button } from "antd"
import { productApi } from "@/utils"
import { manageUserAdd, manageUserDel, manageUserPageList, manageUserUpdate } from "@/api"
import { phoneReg } from "@junc/rc/dist/RegExp"

const pageListApi = productApi(manageUserPageList)
const addApi = productApi(manageUserAdd)
const delApi = productApi(manageUserDel)
const updateApi = productApi(manageUserUpdate)

async function request(params: any, sorter: any, filter: any) {
    const { data } = await pageListApi({...params}, false)
    const { total = 0, values = []}  = data || {}
    return {
        data: values,
        success: true,
        total
    }
}

function UserManage ({...rest}: ProTableProps<any, any>) {
    const modalRequest = async (action: any, payload: any) => {
        const {
            nickName,
            phone,
            status,
        } = payload || {}

        return {
            nickName,
            phone,
            status,
        }
    }
    const onSave = async (action: any, record: any, values: any) => {
        const { id } = record || {}
        switch (action) {
            case 'add': {
                const { success } = await addApi({ ...rest?.params, ...values })
                return success
            }
            case 'update': {
                const { success } = await updateApi({ id, ...values })
                return success
            }
            case 'del': {
                const ids = id ? [id] : values?.selectedRowKeys
                const { success } = await delApi({ ids })
                return success
            }
        }
    }


    return (<ProTableModalForm 
                rowKey="id"
                columns={columnsFn as any}
                request={request}
                toolbar={{
                    actions: ({operate, selectedRowKeys}) => [
                        <Button key="btn1" type="primary" onClick={() => operate?.('add', null)}>添加用户</Button>,
                        <Button key="btn2" type="primary" disabled={!selectedRowKeys.length} onClick={() => operate?.('del', null)}>删除</Button>
                    ],
                }}
                onSave={onSave}
                modalProps={{
                    request: modalRequest
                }}
                {...rest}
            >
                <ProFormUploadSimple width="md" name="avatar" label="头像" />
                <ProFormText width="md" name="nickName" label="昵称" rules={[{required: false, message: '请填写昵称'}]} />
                <ProFormText width="md" name="phone" fieldProps={{maxLength: 11}}  label="手机号" rules={[{required: true, message: '请填写手机号'}, { pattern: phoneReg, message: '请填写正确手机号格式' }]} />
                <ProFormRadio.Group width="md" name="status" label="帐号状态" options={[{label: '启用', value: '1'}, {label: '禁用', value: '0'}]} rules={[{required: true, message: '请选择状态'}]} />
            </ProTableModalForm>)
}


export default UserManage