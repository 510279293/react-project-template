import { StateType } from ".."
import { SET_ORG_TREE, SET_CACHE_KEY } from "../contants"
import { Dispatch } from "redux";
import { handleCommonTreeData } from "@/utils/common";
import { sysOrgTree } from "@/api";

export type OrgTreeAction = {
    type: typeof SET_ORG_TREE;
    orgTree: StateType['orgTree'];
}

export type CacheKeyAction = {
    type: typeof SET_CACHE_KEY;
    cacheKey: StateType['cacheKey'];
}

export function setOrgTree(orgTree: StateType['orgTree'] = []): OrgTreeAction {
    return {
        type: SET_ORG_TREE,
        orgTree
    }
}

export function setCacheKey(cacheKey: StateType['cacheKey'] = []): CacheKeyAction {
    return {
        type: SET_CACHE_KEY,
        cacheKey
    }
}

export const asyncSetOrgTree = () => async (dispatch: Dispatch) => {
    const { data } = await sysOrgTree()
    const { newTreeData } = handleCommonTreeData(data, ({whetherUser, id, name, ...rest}) => ({title: name, key: `${whetherUser ? 'u' : 'd'}-${id}`, label: name, value: `${whetherUser ? 'u' : 'd'}-${id}`, whetherUser, id, name, ...rest}))
    dispatch(setOrgTree(newTreeData||[]))
}

