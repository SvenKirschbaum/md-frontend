import React from "react";

import './Home.css';
import Stats from "../components/Stats";
import Disclaimer from "../components/Disclaimer";

function Home() {
    return (
        <div className={"home"}>
            <div className={"header"}/>
            <Stats className={"flex-grow-1"}/>
            <Disclaimer/>
        </div>
    );
}

export default Home