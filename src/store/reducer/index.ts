import { combineReducers } from 'redux'
import { 
    userInfoReducer as userInfo,
} from './userInfo'
import {
    orgTreeReducer as orgTree,
    cacheKeyReducer as cacheKey
} from './common'

export default combineReducers<unknown>({
    userInfo,
    orgTree,
    cacheKey
})
