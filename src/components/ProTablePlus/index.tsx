import { BetaSchemaForm, ProColumns, ProFormColumnsType, ProTable, ProTableProps } from "@ant-design/pro-components";
import { ReactNode, useState } from "react";

interface Columns<DataSource, ValueType = any> extends ProColumns<DataSource, ValueType> {
    hideInAdd?: boolean;
}
interface ProTablePlusProps<DataSource, U, ValueType = any> extends Omit<ProTableProps<DataSource, U, ValueType>, 'columns'> {
    columns?: Columns<DataSource,ValueType>[];
    addTrigger?: ReactNode;
    // actions?: 
    // SchemaForm
}


// interface 

function ProTablePlus({addTrigger, columns, toolbar, ...rest}: ProTablePlusProps<any, any, any>) {
    const [open, setOpen] = useState(false)
    const addColumns = columns?.filter(column => column.hideInAdd !== true).map(column => ({...column, width: 'md'}))
    return (<>
       <ProTable
            columns={columns}
            {...rest}
            toolbar={{
                ...toolbar,
                actions: [
                    <span onClick={() => setOpen(true)}>{addTrigger}</span>,
                    ...(toolbar?.actions||[])
                ]
            }}
       />
       <BetaSchemaForm<any>
            open={open}
            modalProps={{onCancel: () => setOpen(false), destroyOnClose: true}}
            onFinish={async (values) => {
                console.log(values);
            }}
            title="新增"
            layoutType="ModalForm"
            layout="horizontal"
            labelCol={{span: 4}}
            wrapperCol={{span: 16}}
            columns={addColumns as any}
        />
    </>)
}


export default ProTablePlus