import { userInfo as userInfoApi } from "@/api/user";
import { StateType } from ".."
import { SET_USER_INFO } from "../contants"
import { Dispatch } from "redux";

export type UserInfoAction = {
    type: typeof SET_USER_INFO;
    userInfo: StateType['userInfo'];
}

export function setUserInfo(userInfo: StateType['userInfo'] = {}): UserInfoAction {
    return {
        type: SET_USER_INFO,
        userInfo
    }
}

export const asyncSetUserInfo = () => async (dispatch: Dispatch) => {
    const { data: userInfo } = await userInfoApi()
    dispatch(setUserInfo(userInfo))
}

