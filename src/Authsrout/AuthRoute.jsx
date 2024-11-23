import React from 'react'
import { Navigate, Outlet } from "react-router-dom"

const AuthRoute = () => {
    return (
        !localStorage.getItem("user") ? (
            <Outlet />
        ) : (
            <Navigate to={"/transaction"} />
        )
    )
}

export default AuthRoute