import {useKeycloak} from "@react-keycloak/web";

function RoleComponent(props) {
    const {keycloak} = useKeycloak();

    if (!keycloak.authenticated || !keycloak.tokenParsed.hasOwnProperty('resource_access') || !keycloak.tokenParsed.resource_access.hasOwnProperty('markusdope-backend')) return null;

    const roles = keycloak.tokenParsed.resource_access["markusdope-backend"].roles;

    if (roles.includes(props.role)) return props.children;

    return null;
}

export default RoleComponent;