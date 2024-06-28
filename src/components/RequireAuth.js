import React from "react";
import { Navigate } from "react-router-dom";

const RequireAuth = ({children}) => {
    const authToken = sessionStorage.getItem('authToken');

    if(!authToken){
        return <Navigate to="/" replace/>;
    }else{
        return children;
    }
};

export default RequireAuth;