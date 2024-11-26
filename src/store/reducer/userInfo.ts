import { StateType } from "..";
import { ProductTreeAction, UserInfoAction } from "../action";
import { SET_PRODUCT_TREE, SET_USER_INFO } from "../contants";

export function userInfoReducer(preUserInfo: StateType['userInfo'] = {}, action: UserInfoAction): StateType['userInfo'] {
    const { userInfo, type } = action
    switch (type) {
        case SET_USER_INFO: 
            return userInfo
        default:
            return preUserInfo
    }
}

export function productTreeReducer(preProductTree: StateType['productTree'] = [], action: ProductTreeAction): StateType['productTree'] {
    const { productTree, type } = action
    switch (type) {
        case SET_PRODUCT_TREE: 
            return productTree
        default:
            return preProductTree
    }
}
