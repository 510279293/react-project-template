import { StateType } from "..";
import { CacheKeyAction, OrgTreeAction } from "../action";
import { SET_CACHE_KEY, SET_ORG_TREE } from "../contants";

export function orgTreeReducer(preOrgTree: StateType['orgTree'] = [], action: OrgTreeAction): StateType['orgTree'] {
    const { orgTree, type } = action
    switch (type) {
        case SET_ORG_TREE: 
            return orgTree
        default:
            return preOrgTree
    }
}

export function cacheKeyReducer(preCacheKey: StateType['cacheKey'] = [], action: CacheKeyAction): StateType['cacheKey'] {
    const { cacheKey, type } = action
    switch (type) {
        case SET_CACHE_KEY: 
            return cacheKey
        default:
            return preCacheKey
    }
}
