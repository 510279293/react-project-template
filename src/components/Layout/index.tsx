import { Link } from "react-router-dom";

export default function Layout(){
    return (<ul>
        <li><Link to="/vue">vue app 应用</Link></li>
        <li><Link to="/react">react app 应用</Link></li>
        <li><Link to="/login">login</Link></li>
        <li><Link to="/about">about</Link></li>
    </ul>)
}