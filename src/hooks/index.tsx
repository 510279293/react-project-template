import { parse } from 'qs';
import { useLocation, useSearchParams } from 'react-router-dom'

export * from './plusTableHook'
export * from './initHook'
export * from './auth'


export const useParseSearch = (searchStr?: string) => {
    const { search } = useLocation()
    return parse((searchStr||search).slice(1)) as Record<string, any>;
}
