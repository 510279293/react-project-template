import { ProColumns } from "@ant-design/pro-components";

export const billTypeOptions = [
    {label: '资源申请', value: 1},
    {label: '资源变更', value: 2},
    {label: '资源删除', value: 3}
]

export const columns: (operate: any) => ProColumns<any>[] = (operate) => [
    {
        title: '收件人',
        dataIndex: 'applyer',
    },
    {
        title: '联系电话',
        dataIndex: 'billType',
        valueType: 'select',
        request: async () => {
            return billTypeOptions
        }
    },
    {
        title: '收件人地址',
        dataIndex: 'resourceNum',
    },
    {
        title: '邮编',
        dataIndex: 'applyCode',
    },
    {
        title: '是否默认地址',
        dataIndex: 'createTime',
    },
    {
        title: '操作',
        dataIndex: 'option',
        valueType: 'option',
        width: 120,
        fixed: 'right',
        render: (_text: any, record: any) => [
            <a onClick={() => operate?.('编辑', record)}>编辑</a>,
            <a onClick={() => operate?.('删除', record)}>删除</a>
        ]
    },
]
