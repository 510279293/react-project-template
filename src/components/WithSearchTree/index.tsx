import { Children, CSSProperties, Key, ReactNode, useEffect, useRef, useState, } from 'react'
import { Tree, Input, Modal, } from 'antd'
import { DataNode, TreeProps } from 'antd/lib/tree';
import { Icon } from '@/components';
import { isFunction } from 'lodash';
import { handleCommonTreeData } from '@/utils';
import { ModalForm, ModalFormProps } from '@ant-design/pro-components';
import { useModalHook } from '@/hooks';
const { Search } = Input

interface TreeDataItem extends DataNode{
  _title?: string;
}

type TreeTiTleRenderActions = 'add' | 'update' | 'del' | any;
type TreeTiTleRenderProps = {
    nodeData: any; 
    showIcons?: ((item: any) => TreeTiTleRenderActions[]) | TreeTiTleRenderActions[];
    titleOperate?: (nodeData: any, type?: string) => void;
}
export interface WithSearchTreeProps extends TreeProps {
    placeholder?: string;
    warpStyle?: CSSProperties;
    onSearch?: (args: any) => void;
    titleOperate?: (...args: any) => void;
    showIcons?: TreeTiTleRenderActions[] | any;
    treeData: TreeDataItem[];
    noChildren?: boolean;
}

type WithSearchTreeWarpProps = {
    title?: ReactNode | boolean;
    onOperate?: (...args: any) => void;
    children?: ReactNode;
    Icon?: ReactNode
}

type Loop = (data: DataNode[], searchKey: string) => any;

// 根据关键字 searchKey 在 data 中模糊查找
const loop: Loop = (data: TreeDataItem[], searchKey: string) => data.map((item: TreeDataItem) => {
    const { _title, key } = item
    const index = (_title as string).indexOf(searchKey);
    const beforeStr = (_title as string).substr(0, index);
    const afterStr = (_title as string).substr(index + searchKey.length);
    const newtitle = index > -1 ? (<span>{beforeStr}<span style={{color: '#f50'}}>{searchKey}</span>{afterStr}</span>) : (<>{item._title}</>)
    if (item.children) {
        return { ...item, title: newtitle, _title, key, children: loop(item.children, searchKey) };
    }
    return {
        ...item,
        title: newtitle,
        _title,
        key,
    };
})

// 根据 key 在 treeData 中查询 父节点
const getParentKey = (key: Key, tree: DataNode[]): DataNode => {
    let parentKey;
    for (let i = 0; i < tree.length; i++) {
      const node = tree[i];
      if (node.children) {
        if (node.children.some(item => item.key === key)) {
          parentKey = node.key;
        } else if (getParentKey(key, node.children)) {
          parentKey = getParentKey(key, node.children);
        }
      }
    }
    return parentKey as DataNode;
};

// 将 treeData 进行一级扁平化
const getFlatKeyValue = (data:TreeDataItem[]  = []) => {
    const arr: TreeDataItem[] = []
    const deps = (data:TreeDataItem[]) => {
        (data||[]).forEach(v => {
            const { title, key, children, _title } = v || {}
            arr.push({title, key, _title: _title||''})
            children && deps(children)
        })
    }
    deps(data)
    return arr
}

export const TreeTiTleRender = ({nodeData, showIcons: icons, titleOperate}: TreeTiTleRenderProps) => {
    const { title } = nodeData
    const showIcons = isFunction(icons) ? icons(nodeData) : (icons || ['add', 'update', 'del'])

    const titleClick = (e: Event, type?: string) => {
      !['titleClick'].includes(type||'') && e.stopPropagation()
      titleOperate?.(type, nodeData)
    }
    return <div className="group/item flex justify-between" onClick={(e) => titleClick(e as unknown as Event, 'titleClick')}>{title}
                <div className="invisible group-hover/item:visible">
                    {showIcons?.includes('add') ? <Icon type="icon-jiahao" style={{ color: '#0479FE', marginLeft: 6}} onClick={(e) => titleClick(e as unknown as Event, 'add')} /> : null}
                    {showIcons?.includes('update') ? <Icon type="icon-web-icon-" style={{ color: '#0479FE', marginLeft: 6}} onClick={(e) => titleClick(e as unknown as Event, 'update')} /> : null}
                    {showIcons?.includes('del') ? <Icon type="icon-shanchu" style={{ color: '#0479FE', marginLeft: 6}} onClick={(e) => titleClick(e as unknown as Event, 'del')} /> : null}
                </div>
            </div>
}

export const WithSearchTreeWarp = ({title, onOperate, Icon: MIcon, children}: WithSearchTreeWarpProps) => {
    return <div>
       {(typeof title === 'boolean' && !title) ? null : <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '14px', fontWeight: 500, background: '#F5F5F5', boxSizing: 'border-box', padding: '12px'}}>
            {title}{MIcon ? MIcon : <Icon type="icon-jiahao" style={{cursor: 'pointer'}} onClick={onOperate} />}
        </div>}
        <div style={{boxSizing: 'border-box', padding: '12px', background: '#fff',}}>{children}</div>
    </div>
}

function WithSearchTreeHook({onSearch, treeData: pTreeData, ...rest}: WithSearchTreeProps) {
    const [treeData, setTreeData] = useState<any>(pTreeData||[])
    const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true)
    const [expandedKeys, setExpandedKeys] = useState<any[]>([])
    const treeDataRef = useRef<typeof treeData>(treeData)
    const keyword = useRef<string>('')

    const treeSearch = (searchKey: string) => {
        keyword.current = searchKey
        const treeData = treeDataRef.current
        const filterData = loop(treeData, searchKey)
        const flatKeyValueArr = getFlatKeyValue(treeData)
        const expandedKeys = flatKeyValueArr.map((item: TreeDataItem) => {
            if ((item._title||'' as string).indexOf(searchKey) > -1) {
                return getParentKey(item.key, treeData);
            }
            return null;
        }).filter((item, i, self) => item && self.indexOf(item) === i);
        setTreeData(filterData)
        setExpandedKeys(expandedKeys)
    }

    const onExpand = (expandedKeys: any) => {
        setExpandedKeys(expandedKeys)
        setAutoExpandParent(false)
    }

    useEffect(() => {
        const copyTreeData = JSON.parse(JSON.stringify(pTreeData||[]))
        const { newTreeData } = handleCommonTreeData(copyTreeData, ({title, ...rest}) => ({_title: title, title, ...rest}))
        setTreeData(newTreeData)
        treeDataRef.current = newTreeData
        keyword.current && treeSearch(keyword.current)
    }, [pTreeData])

    return {
        treeData,
        autoExpandParent,
        expandedKeys,
        treeSearch,
        onExpand
    }
}

function WithSearchTree ({warpStyle, placeholder, onSearch, titleOperate, showIcons, treeData: pTreeData, noChildren, ...rest}: WithSearchTreeProps) {
    const {
        treeData,
        autoExpandParent,
        expandedKeys,
        treeSearch,
        onExpand
    } = WithSearchTreeHook({treeData: pTreeData, onSearch})
    
    return (<div style={warpStyle}>
                <Search 
                    placeholder={placeholder || '请输入关键字'} 
                    style={{width: '100%', marginBottom: '12px'}} 
                    onChange={(e) => treeSearch(e.target.value)} 
                    enterButton 
                />
                <Tree 
                    className={noChildren ? 'junc-ant-tree-no-children' : ''} 
                    titleRender={(nodeData) => <TreeTiTleRender nodeData={nodeData} showIcons={showIcons} titleOperate={titleOperate} />} 
                    treeData={treeData}
                    autoExpandParent={autoExpandParent}
                    expandedKeys={expandedKeys}
                    onExpand={onExpand}
                    {...rest}
                />
            </div>)
}

interface WithSearchTreeModalFormProps extends Omit<WithSearchTreeProps, 'treeData'> {
    titleIcon?: WithSearchTreeWarpProps['Icon'];
    params?: any;
    request?: (params?: any) => Promise<TreeProps['treeData']>;
    treeData?: TreeProps['treeData'];
    onSave?: (action: TreeTiTleRenderActions, record?: any, values?: any) => void;
    showIcons?: TreeTiTleRenderActions[];
    children?: React.ReactNode;
    title?: WithSearchTreeWarpProps['title'];
    modalProps?: ModalFormProps;
}

// 扩展 增删改查功能
export function WithSearchTreeModalForm({ params, request, onSave, title, titleIcon, showIcons, children, ...rest }: WithSearchTreeModalFormProps) {
    const [treeData, setTreeData] = useState<any>([])

    const requestApi = async (params?: any) => {
        const treeData = await request?.(params)
        setTreeData(treeData)
    }

    const {
        modalProps,
        onSuccess,
        createAction
    } = useModalHook({
        callBack: requestApi
    })

    useEffect(() => {
        request && requestApi(params)
    }, [params])

    const operate = async (action: TreeTiTleRenderActions, record?: any) => {
        const { params, request } = rest?.modalProps || {}
        const payload = Object.assign(record||{}, params||{})
        switch(action) {
            case 'add': {
                return createAction(action, {
                    ...rest?.modalProps,
                    params: {},
                    request: () => request?.(action, payload),
                    onFinish: async(values: any) => {
                        const success = await onSave?.(action, payload, values)
                        success && onSuccess?.()
                    }
                })
            }
            case 'update': {
                return createAction(action, {
                    ...rest?.modalProps,
                    params: Object.assign(record||{}, params||{}),
                    request: () => request?.(action, payload),
                    onFinish: async(values: any) => {
                        const success = await onSave?.(action, payload, values)
                        success && onSuccess?.()
                    }
                })
            }
            case 'del':
                return Modal.confirm({
                    title: '确认要删除该数据吗?',
                    content: '删除后当前内容将永久删除，不可恢复。',
                    okText: '确认',
                    cancelText: '取消',
                    onOk: async () => {
                        const success = await onSave?.(action, payload)
                        if (success) {
                            onSuccess?.()
                            return Promise.resolve()
                        }
                        return Promise.reject()
                    }
                });
            default:
                return onSave?.(action, payload)
        }
    }

    return (<>
        <WithSearchTreeWarp 
            title={title}
            Icon={(titleIcon||(showIcons||['add'])?.includes('add')) ? false : ' '} 
            onOperate={() => operate?.('add', null)}
        >
            <WithSearchTree 
                treeData={treeData||[]} 
                blockNode 
                showIcons={showIcons} 
                titleOperate={operate} 
                {...rest}
            />
        </WithSearchTreeWarp>
        <ModalForm<any> 
            layout="horizontal" 
            width={500} 
            labelCol={{span: 4}} 
            {...rest?.modalProps}
            {...modalProps}
        >
            {children}
        </ModalForm>
    </>)
}

export default WithSearchTree
