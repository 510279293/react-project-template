import { userInfo as userInfoApi } from "@/api/user";
import { StateType } from ".."
import { SET_PRODUCT_TREE, SET_PROVIDERLIST } from "../contants"
import { Dispatch } from "redux";
import { getAllProductTree, getAllProvider } from "@/api/common";
import { handleCommonTreeData } from "@/utils/common";

export type ProductTreeAction = {
    type: typeof SET_PRODUCT_TREE;
    productTree: StateType['productTree'];
}

export type ProviderListAction = {
    type: typeof SET_PROVIDERLIST;
    providerList: StateType['providerList'];
}

export function setProductTree(productTree: StateType['productTree'] = []): ProductTreeAction {
    return {
        type: SET_PRODUCT_TREE,
        productTree
    }
}

export function setProviderList(providerList: StateType['providerList'] = []): ProviderListAction {
    return {
        type: SET_PROVIDERLIST,
        providerList
    }
}

export const asyncSetProductTree = () => async (dispatch: Dispatch) => {
    const { data } = await getAllProductTree()
    const { newTreeData } = handleCommonTreeData(data, (item) => ({type: item.type, id: item.id, title: item.name, key: `${item.type}-${item.id}`, label: item.name, value: `${item.type}-${item.id}`}))
    dispatch(setProductTree(newTreeData||[]))
}


export const asyncSetProviderList = () => async (dispatch: Dispatch) => {
    // const { data } = await getAllProvider()
    // dispatch(setProductTree(newTreeData||[]))
}
