import { StateType } from "..";
import { ProductTreeAction } from "../action";
import { SET_PRODUCT_TREE } from "../contants";

export function productTreeReducer(preProductTree: StateType['productTree'] = [], action: ProductTreeAction): StateType['productTree'] {
    const { productTree, type } = action
    switch (type) {
        case SET_PRODUCT_TREE: 
            return productTree
        default:
            return preProductTree
    }
}
