import { StateType } from "..";
import { UserInfoAction } from "../action";
import { SET_USER_INFO } from "../contants";

export function userInfoReducer(preUserInfo: StateType['userInfo'] = {}, action: UserInfoAction): StateType['userInfo'] {
    const { userInfo, type } = action
    switch (type) {
        case SET_USER_INFO: 
            return userInfo
        default:
            return preUserInfo
    }
}
