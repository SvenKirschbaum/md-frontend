import {Redirect, Route} from "react-router";
import React from "react";
import {useKeycloak} from "@react-keycloak/web";

function RoleRoute(ownprops) {
    const {component: Component, role, ...props} = ownprops;

    const {keycloak} = useKeycloak();

    let allowed = false;

    if (keycloak.authenticated && keycloak.tokenParsed.hasOwnProperty('resource_access') && keycloak.tokenParsed.resource_access.hasOwnProperty('markusdope-backend')) {
        if (keycloak.tokenParsed.resource_access["markusdope-backend"].roles.includes(role)) {
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