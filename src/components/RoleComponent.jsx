import {useAuth} from "react-oidc-context";

function RoleComponent(props) {
    const auth = useAuth();

    if (!auth.isAuthenticated || !auth.user.profile.hasOwnProperty('resource_access') || !auth.user.profile.resource_access.hasOwnProperty('markusdope-backend')) return null;

    const roles = auth.user.profile.resource_access["markusdope-backend"].roles;

    if (roles.includes(props.role)) return props.children;

    return null;
}

export default RoleComponent;