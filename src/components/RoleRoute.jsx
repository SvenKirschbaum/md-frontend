import {Redirect, Route} from "react-router";
import React from "react";
import {useAuth} from "react-oidc-context";

function RoleRoute(ownprops) {
    const {component: Component, role, ...props} = ownprops;

    const auth = useAuth();

    let allowed = false;

    if (auth.isAuthenticated && auth.user.profile.hasOwnProperty('resource_access') && auth.user.profile.resource_access.hasOwnProperty('markusdope-backend')) {
        if (auth.user.profile.resource_access["markusdope-backend"].roles.includes(role)) {
            allowed = true;
        }
    }

    return (
        <Route
            {...props}
            render={props => (
                allowed ?
                    <Component {...props} /> :
                    <Redirect to='/'/>
            )}
        />
    )
}

export default RoleRoute;