import { combineReducers } from 'redux'
import { 
    userInfoReducer as userInfo,
} from './userInfo'
import {
    productTreeReducer as productTree
} from './common'

export default combineReducers<unknown>({
    userInfo,
    productTree
})
