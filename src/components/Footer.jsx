import React from 'react';

import './Footer.css'
import {Link} from "react-router-dom";
import RoleComponent from "./RoleComponent";
import {useAuth} from "react-oidc-context";

function Footer() {
    return (
        <div className={"footer"}>
            <LoginComponent/>
            <RoleComponent role={"manager"}>
                <Link className={"text-center"} to={"/import"}>Match importieren</Link>
            </RoleComponent>
            <div className="impressum">
                <a href="https://datenschutz.elite12.de/">Impressum<span className={"d-none d-lg-inline"}> / Datenschutzerklärung</span></a>
            </div>
        </div>
    );
}

function LoginComponent() {

    const auth = useAuth();

    if (auth.isAuthenticated) {
        return (
            <div>
                <span className={"d-none d-sm-inline"}>Eingeloggt als </span>{auth.user.profile.preferred_username}
            </div>
        );
    } else {
        return (
            <div>
                <span className={"login"} onClick={auth.signinRedirect}>Login</span>
            </div>
        );
    }
}

export default Footer;