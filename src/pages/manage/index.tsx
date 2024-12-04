// import { Outlet } from '@/components'

import { Outlet } from 'react-router-dom'

export { default as UserManage } from './user'
export { default as DashBoard } from './dashBoard'
export { default as Overview } from './overview'

export default function Manage() {
    return (<div className="p-5" style={{boxSizing: 'border-box'}}>
        <Outlet />
    </div>)
}