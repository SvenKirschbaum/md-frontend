import CustomNumberFormat from "./CustomNumberFormat";
import {ProgressBar} from "react-bootstrap";
import React from "react";

import './WinrateBar.css';

function WinrateBar(props) {
    const data = props.data;
    const winrate = data.wins / (data.wins + data.losses);

    return (
        <ProgressBar className={"winrate-bar"} title={(winrate * 100).toFixed(2) + '%'}>
            <ProgressBar
                variant="success"
                now={winrate * 100}
            />
            <ProgressBar
                variant="danger"
                now={(1 - winrate) * 100}
            />
            <WinrateBarLabel winrate={winrate}/>
        </ProgressBar>
    );
}

//If this part is not wrapped in an extra component react will throw a warning, because the parent progressbar sets the isChild property on children.
function WinrateBarLabel(props) {
    return (
        <div className={"winrate-label"}>
            <CustomNumberFormat suffix={"%"}>{props.winrate * 100}</CustomNumberFormat>
        </div>
    );
}

export default WinrateBar;