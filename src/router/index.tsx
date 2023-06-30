import { createBrowserRouter } from "react-router-dom";
import Home from '@/pages/home'
import About from '@/pages/about'

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Home />
    },
    {
        path: "/about",
        element: <About />
    },
])
