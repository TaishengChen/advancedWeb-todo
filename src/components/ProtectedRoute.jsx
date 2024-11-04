import React from 'react';
import {useUser} from "../context/useUser.jsx";
import {Navigate, Outlet} from "react-router-dom";

function ProtectedRoute() {
    const {user} = useUser()
    if (!user || !user.token) return <Navigate to={"/signin"} />
    return (
        <Outlet />
    );
}

export default ProtectedRoute;