import React, {useEffect, useState} from "react";
import { trackPromise, usePromiseTracker } from "react-promise-tracker";

import './Records.css';
import Card from "react-bootstrap/Card";
import CustomNumberFormat from "./CustomNumberFormat";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Spinner from "react-bootstrap/Spinner";
import MatchLink from "./MatchLink";
import {useSeason} from "./season";

const titlemappings = {
    loading: "Loading...",
    kills: "Highest Kills",
    cs: "Highest CS",
    kda: "Highest KDA",
    gold: "Highest Gold",
    assists: "Highest Assists",
    deaths: "Highest Deaths",
    visionScore: "Highest Vision Score",
    earlyDeath: "Frühester Tod",
    earlyKill: "Frühester Kill",
    highestkillParticipation: "Highest Killparticipation",
    lowestkillParticipation: "Lowest Killparticipation",
    highestDeathParticipation: "Highest Deathparticipation",
    ccTime: "CC Time",
    killingSpree: "Largest Killingspree",
    multiKill: "Largest Multikill",
}

const lanemappings = {
    "JUNGLE": "Jungle",
    "BOTTOM": "Botlane",
    "BOT": "Botlane",
    "TOP": "Toplane",
    "MID": "Midlane",
    "MIDDLE": "Midlane",
}

const breakpoints = [
    {
        breakpoint: 1800,
        settings: {
            slidesToShow: 4,
            slidesToScroll: 4,
        }
    },
    {
        breakpoint: 1450,
        settings: {
            slidesToShow: 3,
            slidesToScroll: 3
        }
    },
    {
        breakpoint: 1100,
        settings: {
            slidesToShow: 2,
            slidesToScroll: 2
        }
    },
    {
        breakpoint: 700,
        settings: {
            slidesToShow: 1,
            slidesToScroll: 1
        }
    }
]

function Records() {
    const [recordData, setRecordData] = useState({});
    const {promiseInProgress} = usePromiseTracker({area: 'records'});
    const season = useSeason();

    useEffect(() => {
        const abortController = new AbortController();

        trackPromise(
            fetch(`/api/stats/records/${season}`, {signal: abortController.signal})
                .then((res) => {
                    if (!res.ok) throw Error(res.statusText);
                    return res;
                })
                .then(res => res.json())
                .then(res => {
                    setRecordData(res.records);
                })
                .catch(reason => {
                    //Ignore AbortController.abort()
                    if (reason.name === 'AbortError') return;
                    alert("Error loading Records: " + reason)
                })
            , 'records'
        )

        return () => abortController.abort();
    }, [season]);

    //Display only if Loading or if there actually are records to display
    return (promiseInProgress || Object.keys(recordData).length > 0) && (
        <Slider autoplay autoplaySpeed={5000} className={"record-slider"} dots infinite={!promiseInProgress && Object.keys(recordData).length >= 5}
                slidesToShow={5} slidesToScroll={5} responsive={breakpoints} speed={1000}>
            {promiseInProgress ?
                <LoadingCard />
                :
                Object.entries(recordData).map(([key, entries]) => <Record key={key} titleKey={key} entries={entries}/>)
            }
        </Slider>
    );
}

function LoadingCard() {
    return (
        <Card className={"record-card"}>
            <Card.Header>Loading...</Card.Header>
            <Card.Body className={"text-center"}>
                <Spinner animation="border" role="status" className={"align-self-center"}>
                    <span className="sr-only">Loading...</span>
                </Spinner>
            </Card.Body>
            <Card.Footer/>
        </Card>
    )
}

function Record(props) {
    const {titleKey, entries} = props;

    return (
        <Card className={"record-card"}>
            <Card.Header>{titlemappings[titleKey] ?? titleKey}</Card.Header>
            <Card.Body>
                {
                    entries.map(data => <RecordEntry key={data.matchId + data.player} {...data} />)
                }
            </Card.Body>
            <Card.Footer/>
        </Card>
    );
}

function RecordEntry(props) {
    const {type, ...data} = props;

    switch (type) {
        case 'PlayerRecord':
            return <PlayerRecordEntry {...data} />;
        default:
            return null;
    }
}

function PlayerRecordEntry(props) {
    const {champion, lane, matchId, player, value} = props;

    return (
        <MatchLink id={matchId} className={"d-block text-white"}>
            [{lanemappings[lane] ?? lane}]&nbsp;
            {player} auf {champion}: <RecordValue value={value} />
        </MatchLink>
    );
}

function RecordValue(props) {
    const {value} = props;

    return (
        <span className={"recordValue"}>
            {isNaN(value) ?
                value :
                <CustomNumberFormat>{value}</CustomNumberFormat>
            }
        </span>
    )
}

export default Records;