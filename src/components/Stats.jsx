import React, {useEffect, useState} from "react";
import PlayerStats from "./PlayerStats";
import Records from "./Records";
import {SeasonContext} from "./season";
import {trackPromise} from "react-promise-tracker";

function Stats(props) {
    const [season, setSeason] = useState("");
    const [currentSeason, setCurrentSeason] = useState(undefined);

    useEffect(() => {
        const abortController = new AbortController();
        trackPromise(
            fetch("/api/stats/season", {signal: abortController.signal})
                .then((res) => {
                    if (!res.ok) throw Error(res.statusText);
                    return res;
                })
                .then(res => res.json())
                .then(res => {
                    setCurrentSeason(res.currentSeason);
                })
                .catch(reason => {
                    //Ignore AbortController.abort()
                    if (reason.name === 'AbortError') return;
                    alert("Error loading current Season: " + reason)
                })
        , "season")

        return () => abortController.abort();
    }, []);

    return (
        <SeasonContext.Provider value={{season, currentSeason, setSeason}}>
            <div className={props.className}>
                <Records/>
                <PlayerStats className={"mb-3"}/>
            </div>
        </SeasonContext.Provider>
    );
}

export default Stats;