import { createBrowserRouter } from "react-router-dom";
import Home from '@/pages/home'
import About from '@/pages/about'
import Login from "@/pages/login";
import { Error } from "@/components"; 

const routes = [
    {
        path: "/",
        element: <Home />,
        errorElement: <Error />,
        children: [
            {
                path: "/login",
                element: <Login />
            },
            {
                path: "/about",
                element: <About />
            },
        ]
    },
]

export const router = createBrowserRouter(routes)
