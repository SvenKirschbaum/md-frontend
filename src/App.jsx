import React from 'react';
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import './App.css';
import {ReactKeycloakProvider} from "@react-keycloak/web";

import keycloak from "./keycloak";
import Footer from "./components/Footer";
import Home from "./views/Home";
import NoMatch from "./views/NoMatch";
import './res/bootstrap.min.css';
import ImportMatch from "./views/ImportMatch";
import RoleRoute from "./components/RoleRoute";
import MatchView from "./views/MatchView";

function App() {
    return (
        <ReactKeycloakProvider authClient={keycloak} LoadingComponent={<div/>} initOptions={{
            onLoad: 'check-sso',
            promiseType: 'native',
            flow: 'standard',
            pkceMethod: 'S256',
            checkLoginIframe: false,
            silentCheckSsoRedirectUri: window.location.origin + '/silent-sso.html'
        }}>
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
        </ReactKeycloakProvider>
    );
}

export default App;
