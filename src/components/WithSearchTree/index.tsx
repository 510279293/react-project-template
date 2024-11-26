import { CSSProperties, Key, ReactNode, } from 'react'
import { Tree, Input, } from 'antd'
import { DataNode, TreeProps } from 'antd/lib/tree';
import { Icon } from '@/components';
import { isFunction } from 'lodash';
const { Search } = Input

interface TreeDataItem extends DataNode{
  _title?: string;
}

type TreeTiTleRenderActions = 'add' | 'update' | 'del'
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
      titleOperate && titleOperate(nodeData, type)
    }
    return <div style={{display: 'flex', justifyContent: 'space-between'}} className="treeItemDiv" onClick={(e) => titleClick(e as unknown as Event, 'titleClick')}>{title}
                <div style={{display: 'none'}} className="treeItemDiv_p">
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

function WithSearchTree ({warpStyle, placeholder, onSearch, titleOperate, showIcons, treeData, ...rest}: WithSearchTreeProps) {
    const treeSearch = (searchKey: string) => {
        const filterData = loop(treeData, searchKey)
        const flatKeyValueArr = getFlatKeyValue(treeData)

        const expandedKeys = flatKeyValueArr.map((item: TreeDataItem) => {
            if ((item._title as string).indexOf(searchKey) > -1) {
                return getParentKey(item.key, treeData);
            }
            return null;
        }).filter((item, i, self) => item && self.indexOf(item) === i);

        onSearch && onSearch({filterData, expandedKeys })
    }
    return (<div style={warpStyle}>
                <Search placeholder={placeholder || '请输入关键字'} style={{width: '100%', marginBottom: '12px'}} onChange={(e) => treeSearch(e.target.value)} enterButton />
                <Tree className='treeBody customScrollBar' titleRender={(nodeData) => <TreeTiTleRender nodeData={nodeData} showIcons={showIcons} titleOperate={titleOperate} />} treeData={treeData} {...rest}/>
            </div>)
}

export default WithSearchTree
