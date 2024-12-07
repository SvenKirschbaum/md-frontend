import {Navigate} from "react-router";
import React from "react";
import {useAuth} from "react-oidc-context";

function RequireAuth(props) {
    const {role, children} = props;

    const auth = useAuth();

    let allowed = false;

    if (auth.isAuthenticated && auth.user.profile.hasOwnProperty('resource_access') && auth.user.profile.resource_access.hasOwnProperty('markusdope-backend')) {
        if (auth.user.profile.resource_access["markusdope-backend"].roles.includes(role)) {
            allowed = true;
        }
    }

    return allowed ? children : <Navigate  to={"/"}/>;
}

export default RequireAuth;