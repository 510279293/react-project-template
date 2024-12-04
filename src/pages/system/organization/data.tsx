import { Popover } from "antd";
import { ProColumns } from "@ant-design/pro-table"; 
import { ProTableModalFormProps } from "@/components/ProTablePlus";
export type TableListItem = {
    key: number;
    attention: number | string;
    customerName: string;
    customerTags: string;
    customerLevel: string;
    customerOrigin: string;
    customerArea: string;
    id:string;
    lastLoginTime: string;
    userInfoStatus: object;
    customerStatus: string;
    customerRecord: string;
    customerBelong: string;
    createTime: string;
    lastUpdateTime: string;
    notFollowDays: string;
    address: string;
};
export type OperateActionType = '新建员工' | '批量删除' | '编辑员工' | '离职复职' | '禁用启用' | 'add' | 'del' | 'update'
export const columnsFn: ProTableModalFormProps['columns'] = ({operate, hasPermission}) => {
    // const [,,request] = useRoleListHooks({}, false)
    return [
        {
            title: '登录名',
            dataIndex: 'userName',
            // fixed: 'left',
            order: 100,
            fieldProps: {placeholder: '请输入登录名、姓名、手机号'},
            search: {
                transform: (value: any) => {
                  return {
                    inputText: value,
                  };
                },
            },
        },
        {
            title: '姓名',
            dataIndex: 'name',
            hideInSearch: true,
            order: 2,
        },
        {
            title: '性别',
            dataIndex: 'gender',
            hideInSearch: true,
            order: 6,
            valueEnum: {
              0: { text: '男', status: '' },
              1: { text: '女', status: '' },
            },
            search: {
              transform: (value: any) => {
                return {
                  status: value,
                };
              },
            },
        },
        {
            title: '手机号',
            dataIndex: 'mobilePhoneNumber',
            hideInSearch: true,
            order: 6,
        },
        {
            title: '所属部门',
            dataIndex: 'dept',
            hideInSearch: true,
            order: 6,
        },
        {
            title: '所属角色',
            dataIndex: 'role',
            order: 7,
            valueType: 'select',
            // request,
            search: {
                transform: (value: any) => {
                  return {
                    roleId: value,
                  };
                },
            },
        },
        {
          title: '状态',
          dataIndex: 'userInfoStatus',
          order: 6,
          valueEnum: {
            0: { text: '在职', status: '' },
            1: { text: '离职', status: '' },
            2: { text: '禁用', status: '' },
          },
          search: {
            transform: (value: any) => {
              return {
                status: value,
              };
            },
          },
        },
        {
          title: '最近登录时间',
          dataIndex: 'lastLoginTime',
          order: 2,
          valueType: 'dateRange',
          hideInSearch: true,
          render: (text,record) => `${record.lastLoginTime || '-'}`
        },
        {
          title: '最近登录地点',
          dataIndex: 'address',
          order: 2,
          hideInSearch: true,
          render: (text,record) => `${record.address || '-'}`
        },
        {
            title: '操作',
            key: 'option',
            valueType: 'option',
            width: 100,
            fixed: 'right',
            render: (text, record) => [
                hasPermission(-1) ? <a key="edit" onClick={() => operate?.('update', record)}>编辑</a> : null,
                (hasPermission(-1) || hasPermission(1004)) ? <Popover placement="bottomRight" content={
                    (<div style={{ width: '30px' }}>
                    {hasPermission(-1) ? (Number(record.userInfoStatus) !== 1) && <p><a key="del" onClick={() => operate?.('禁用启用', record)}>{Number(record.userInfoStatus) === 2 ? '启用' : '禁用'}</a></p> : null}
                    {hasPermission(-1) ? <p><a key="del" onClick={() => operate?.('离职复职', record)}>{Number(record.userInfoStatus) === 1 ? '复职' : '离职'}</a></p> : null}
                    {hasPermission(-1) ? <p><a key="del" onClick={() => operate?.('del', record)}>删除</a></p> : null}
                    </div>)
                } key='more' title="" ><a key="more">更多</a></Popover> : null,
            ],
        },
    ]
}
