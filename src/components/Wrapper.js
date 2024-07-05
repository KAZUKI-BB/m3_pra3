import React from "react";
import RequireAuth from "./RequireAuth";
import { Outlet } from "react-router-dom";

export const Wrapper = () => {
    return (
        <RequireAuth>
            <Outlet />
        </RequireAuth>
    )
}