// import { Outlet } from '@/components'
import { Outlet } from 'react-router-dom'

export { default as Role } from './role'
export { default as Dictionary } from './dictionary'
export { default as Organization } from './organization'

export default function System() {
    return (<div className="p-5" style={{boxSizing: 'border-box'}}>
        <Outlet />
    </div>)
}
