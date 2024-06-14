import React, {useCallback, useEffect} from 'react';
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import './App.css';

import Footer from "./components/Footer";
import Home from "./views/Home";
import NoMatch from "./views/NoMatch";
import './res/bootstrap.min.css';
import ImportMatch from "./views/ImportMatch";
import RoleRoute from "./components/RoleRoute";
import MatchView from "./views/MatchView";
import {CookieConsent} from "react-cookie-consent";
import {AuthProvider, useAuth} from "react-oidc-context";

function App() {

    const onSigninCallback = useCallback(() => {
        window.history.replaceState({}, document.title, window.location.pathname);
    }, []);

    return (
        <>
            <CookieConsent
                location="bottom"
                cookieSecurity={true}
                sameSite="strict"
                style={{background: "black"}}
            >
                This website uses cookies to ensure you get the best experience on our website. <a
                className="cookielink" href="https://cookiesandyou.com/">Learn more</a>
            </CookieConsent>
            <AuthProvider
                authority={import.meta.env.VITE_OIDC_AUTHORITY}
                client_id={import.meta.env.VITE_OIDC_CLIENT_ID}
                redirect_uri={window.location.origin.toString()}
                automaticSilentRenew={true}
                onSigninCallback={onSigninCallback}
            >
                <Router>
                    <div className={"content"}>
                        <div className={"main-content"}>
                            <Switch>
                                <Route path={"/"} exact component={Home}/>
                                <Route path={"/match/:id"} component={MatchView}/>
                                <RoleRoute role="manager" path={"/import"} component={ImportMatch}/>
                                <Route component={NoMatch}/>
                            </Switch>
                        </div>
                        <Footer/>
                    </div>
                </Router>
            </AuthProvider>
        </>
    );
}

export default App;
