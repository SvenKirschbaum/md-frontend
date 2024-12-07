import React, {useCallback} from 'react';
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import './App.scss';

import Footer from "./components/Footer";
import Home from "./views/Home";
import NoMatch from "./views/NoMatch";
import ImportMatch from "./views/ImportMatch";
import RequireAuth from "./components/RequireAuth.jsx";
import MatchView from "./views/MatchView";
import {CookieConsent} from "react-cookie-consent";
import {AuthProvider} from "react-oidc-context";

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
                <Router
                    future={{
                        v7_relativeSplatPath: true,
                        v7_startTransition: true,
                        v7_fetcherPersist: true,
                        v7_normalizeFormMethod: true,
                        v7_partialHydration: true,
                        v7_skipActionStatusRevalidation: true,
                    }}
                >
                    <div className={"content"}>
                        <div className={"main-content"}>
                            <Routes>
                                <Route path={"/"} exact element={<Home />}/>
                                <Route path={"/match/:id"} element={<MatchView />}/>
                                <Route path={"/import/*"} element={
                                    <RequireAuth role="manager">
                                        <ImportMatch/>
                                    </RequireAuth>
                                }/>
                                <Route element={<NoMatch />}/>
                            </Routes>
                        </div>
                        <Footer/>
                    </div>
                </Router>
            </AuthProvider>
        </>
    );
}

export default App;
