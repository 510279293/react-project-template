import { Link, Outlet } from "react-router-dom";
import { Layout } from "@/components";

export default function Home () {
    return (<div>
        <Layout />
        <Outlet />
    </div>)
}
