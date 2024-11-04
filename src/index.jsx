import React, {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './screens/index.css'
import Home from "./screens/Home.jsx";
import ErrorPage from "./screens/ErrorPage.jsx";
import Authentication, {AuthenticationMode} from "./screens/Authentication.jsx";
import UserProvider from "./context/UserProvider.jsx";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

const router = createBrowserRouter([
    {
        errorElement: <ErrorPage/>
    },
    {
        path: "/signin",
        element: <Authentication authenticationMode={AuthenticationMode.Login}/>
    },
    {
        path: '/signup',
        element: <Authentication authenticationMode={AuthenticationMode.Register}/>
    },
    {
        element: <ProtectedRoute/>,
        children: [
            {
                path: "/",
                element: <Home/>,
            }
        ]
    }
])

createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <UserProvider>
            <RouterProvider router={router}/>
        </UserProvider>
    </React.StrictMode>
)
