import { Outlet } from "react-router-dom";

export { default as Role } from './role'
export { default as Dictionary } from './dictionary'


export default function System() {
    return (<div style={{padding: 20}}><Outlet /></div>)
}
