import { ProFormCompact } from "@/components/ProFormFields";
import { ProColumns } from "@ant-design/pro-components";
import { Input } from "antd";

export const selectOptions = [
    {label: '资源申请', value: 1},
    {label: '资源变更', value: 2},
    {label: '资源删除', value: 3},
    {label: '资源复制', value: 4}
]

// 
const cascaderOptions = [
    {
        value: 'zhejiang',
        label: '浙江省',
        children: [
            {
                value: 'hangzhou',
                label: '杭州市',
                children: [
                    {
                        value: 'xihu',
                        label: '西湖区',
                    },
                ],
            },
        ],
    },
    {
        value: 'jiangsu',
        label: '江苏省',
        children: [
            {
                value: 'nanjing',
                label: '南京市',
                children: [
                    {
                        value: 'facai',
                        label: '发财区',
                    },
                ],
            },
        ],
    },
]

const hideInSearch = true
const hideInTable = true

// 表格列定义具体文档链接: https://pro-components.antdigital.dev/components/table#columns-%E5%88%97%E5%AE%9A%E4%B9%89
export const columns: (operate: any, data?: any) => ProColumns<any>[] = (operate, data) => [
    {
        title: "文本框",
        dataIndex: 'userName',
        width: 120,
        hideInForm: true,
        initialValue: '哈哈哈',   // 搜索框初始值
    },
    {
        title: "下拉框",
        valueType: 'select',
        dataIndex: 'select',
        fieldProps: {
            mode: 'multiple', // 是否开启多选
        },
        width: 120,
        request: async () => selectOptions
    },
    {
        title: "树形下拉框",
        valueType: 'treeSelect',
        dataIndex: 'treeSelect',
        width: 120,
        fieldProps: { // 
            treeCheckable: true,  // 是否开启多选
        },
        request: async () => cascaderOptions
    },
    {
        title: "金额框",
        valueType: 'money',
        dataIndex: 'money',
        width: 120,
        initialValue: 100,
    },
    {
        title: "数字输入框",
        valueType: 'digit',
        dataIndex: 'digit',
        width: 120,
    },
    {
        title: "级联选择器",
        valueType: 'cascader',
        dataIndex: 'cascader',
        width: 120,
        request: async () => cascaderOptions
    },
    {
        title: "复合选择器",
        dataIndex: 'compact',
        width: 120,
        initialValue: { 'name': 123 },
        fieldProps: {
            changeClear: true,
            options: [
                {label: '名称', value: 'name'},
                {label: 'ID', value: 'id'},
            ]
        },
        tooltip: '复合选择器常见于[select, input] 纬度输入组合',
        renderFormItem: ({fieldProps}) => <ProFormCompact {...(fieldProps) as any} />   // renderFormItem 为自定义筛选条件
    },
    {
        title: "日期框",
        valueType: 'date',
        dataIndex: 'date',
        width: 120,
        initialValue: '2024-03-22'
    },
    {
        title: "日期区间",
        valueType: 'dateRange',
        dataIndex: 'dateRange',
        width: 120,
        initialValue: ['2024-03-06', '2024-04-21']
    },
    {
        title: "日期时间",
        valueType: 'dateTime',
        dataIndex: 'dateTime',
        width: 120,
        initialValue: '2024-03-22 11:28:39'
    },
    {
        title: "日期时间区间",
        valueType: 'dateTimeRange',
        dataIndex: 'dateTimeRange',
        width: 120,
        initialValue: ['2024-03-06 05:23:34', '2024-04-21 18:23:45']
    },
    {
        title: "开关",
        valueType: 'switch',
        dataIndex: 'switch',
        width: 120,
    },
    /*********** 以上常用 ************/
    {
        title: "时间",
        valueType: 'time',
        dataIndex: 'time',
        width: 120,
    },
    {
        title: "时间区间",
        valueType: 'timeRange',
        dataIndex: 'timeRange',
        width: 120,
    },
    {
        title: "星级组件",
        valueType: 'rate',
        dataIndex: 'rate',
        width: 240,
        initialValue: 3.5,
        hideInSearch
    },
    {
        // 建议使用 select 组件
        title: "单选框",     
        valueType: 'radio',
        dataIndex: 'radio',
        width: 120,
        tooltip: '建议使用 select 组件, 单选功能',
        request: async () => selectOptions
    },
    {
        title: "多选框",
        valueType: 'checkbox',
        dataIndex: 'checkbox',
        width: 120,
        tooltip: '建议使用 select 组件, 多选功能',
        request: async () => selectOptions
    },
    {
        // 建议使用 select 组件
        title: "按钮单选框", 
        valueType: 'radioButton',
        dataIndex: 'radioButton',
        width: 120,
        hideInSearch,   // 表单搜索中不展示
        request: async () => selectOptions
    },
    {
        title: "密码框",
        valueType: 'password',
        dataIndex: 'password',
        width: 120,
        initialValue: '123456',
        hideInSearch
    },
    {
        title: "周",
        valueType: 'dateWeek',
        dataIndex: 'dateWeek',
        width: 120,
        // initialValue: '2024-12周'
        hideInSearch,   // 表单搜索中不展示
        hideInTable,    // 表格中不展示
    },
    {
        title: "月",
        valueType: 'dateMonth',
        dataIndex: 'dateMonth',
        width: 120,
        hideInSearch,   // 表单搜索中不展示
        hideInTable,    // 表格中不展示
    },
    {
        title: "季度输入",
        valueType: 'dateQuarter',
        dataIndex: 'dateQuarter',
        width: 120,
        hideInSearch,   // 表单搜索中不展示
        hideInTable,    // 表格中不展示
    },
    {
        title: "年份输入",
        valueType: 'dateYear',
        dataIndex: 'dateYear',
        width: 120,
        hideInSearch,   // 表单搜索中不展示
        hideInTable,    // 表格中不展示
    },
    {
        title: "进度条",
        valueType: 'progress',
        dataIndex: 'progress',
        width: 120,
        initialValue: 78,
        hideInSearch   // 表单搜索中不展示
    },
    {
        title: "百分比组件",
        valueType: 'percent',
        dataIndex: 'percent',
        width: 120,
        initialValue: 78,
        hideInSearch   // 表单搜索中不展示
    },
    {
        title: "秒格式化",
        valueType: 'second',
        dataIndex: 'second',
        width: 120,
        initialValue: 20000,
        hideInSearch   // 表单搜索中不展示
    },
    {
        title: "头像",
        valueType: 'avatar',
        dataIndex: 'avatar',
        width: 120,
        initialValue: 'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg',
        hideInSearch   // 表单搜索中不展示
    },
    {
        title: "代码框",
        valueType: 'code',
        dataIndex: 'code',
        width: 120,
        initialValue: `const a = 1;\nconst b = 2;\nconsole.log(a+b)`,
        hideInSearch   // 表单搜索中不展示
    },
    {
        title: "相对于当前时间",
        valueType: 'fromNow',
        dataIndex: 'fromNow',
        width: 120,
        initialValue: '2024-03-01 14:23:45',
        hideInSearch   // 表单搜索中不展示
    },
    {
        title: "图片",
        valueType: 'image',
        dataIndex: 'image',
        width: 120,
        initialValue: 'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg',
        hideInSearch   // 表单搜索中不展示
    },
    {
        title: "json代码框",
        valueType: 'jsonCode',
        dataIndex: 'jsonCode',
        width: 120,
        initialValue: `const a = 1;\nconst b = 2;\nconsole.log(a+b)`,
        hideInSearch   // 表单搜索中不展示
    },
    {
        title: "颜色选择器",
        valueType: 'color',
        dataIndex: 'color',
        width: 120,
        initialValue: '#1890ff',
        hideInSearch,   // 表单搜索中不展示
        hideInTable,    // 表格中不展示
    },
    {
        title: "分段器",
        valueType: 'segmented',
        dataIndex: 'segmented',
        width: 120,
        hideInSearch,   // 表单搜索中不展示
        hideInTable,    // 表格中不展示
    },
    {
        title: "分组",
        valueType: 'group',
        dataIndex: 'group',
        width: 120,
        hideInSearch,   // 表单搜索中不展示
        hideInTable,    // 表格中不展示
    },
    {
        title: "表单列表",
        valueType: 'formList',
        dataIndex: 'formList',
        width: 120,
        hideInSearch,   // 表单搜索中不展示
        hideInTable,    // 表格中不展示
    },
    {
        title: "表单集合",
        valueType: 'formSet',
        dataIndex: 'formSet',
        width: 120,
        hideInSearch,   // 表单搜索中不展示
        hideInTable,    // 表格中不展示
    },
    {
        title: "分割线",
        valueType: 'divider',
        dataIndex: 'divider',
        width: 120,
        hideInSearch,   // 表单搜索中不展示
        hideInTable,    // 表格中不展示
    },
    {
        title: "依赖项",
        valueType: 'dependency',
        dataIndex: 'dependency',
        width: 120,
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
