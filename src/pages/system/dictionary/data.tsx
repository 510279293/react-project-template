import { ProColumns } from "@ant-design/pro-table";

export type TableListItem = {
    createTime: string;
    dictName: string;
    optionId: string;
    optionName: string;
    status: string;
};

export type OperateActionType = '配置选项' | '编辑' 

export const columnsFn: (operate: any, hasPermission?: any) => ProColumns<TableListItem>[] = (operate, hasPermission) => {
    return [
            {
                title: '字典名称',
                dataIndex: 'dictName',
                // fixed: 'left',
                // order: 100,
                hideInSearch: true,
                width: 200,
                // fieldProps: {placeholder: '请输入字典名称'}
            },
            {
                title: '选项名称',
                dataIndex: 'optionName',
                width: 200,
                order: 2,
            },
            {
                title: '状态',
                dataIndex: 'status',
                order: 1,
                width: 100,
                valueEnum: {
                    0: { text: '禁用', },
                    1: { text: '启用', }
                },
                search: {
                    transform: (value) => {
                        return {
                            status: value,
                        };
                    },
                },
            },
            {
                title: '创建时间',
                dataIndex: 'createTime',
                // valueType: 'dateRange',
                hideInSearch: true,
                width: 200,
                fieldProps: { allowEmpty: [true, true]},
                search: {
                    transform: (value) => {
                    return {
                        startTime: value[0],
                        endTime: value[1],
                    };
                    },
                },
            },
            {
                title: '操作',
                key: 'option',
                valueType: 'option',
                width: 100,
                // fixed: 'right',
                render: (text, record) => [
                    hasPermission(-1) ? <a key="edit" onClick={() => operate && operate('编辑', record)}>编辑</a> : null,
                // <DragHandle key="drag" /> 
                ],
            },
        ]
}

