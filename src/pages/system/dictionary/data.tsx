import { ProTableModalFormProps } from "@/components/ProTablePlus";

export type TableListItem = {
    createTime: string;
    dictName: string;
    optionId: string;
    optionName: string;
    status: string;
};

export type OperateActionType = 'add' | 'update' | 'del'  

export const columnsFn: ProTableModalFormProps['columns'] = ({operate, hasPermission}) => {
    return [
            {
                title: '字典名称',
                dataIndex: 'dictName',
                // fixed: 'left',
                // order: 100,
                hideInSearch: true,
                width: 100,
                // fieldProps: {placeholder: '请输入字典名称'}
            },
            {
                title: '选项名称',
                dataIndex: 'optionName',
                width: 100,
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
                    transform: (value: any) => {
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
                width: 100,
                fieldProps: { allowEmpty: [true, true]},
                search: {
                    transform: (value: any) => {
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
                    hasPermission(-1) ? <a key="edit" onClick={() => operate?.('update', record)}>编辑</a> : null,
                // <DragHandle key="drag" /> 
                ],
            },
        ]
}

