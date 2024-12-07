import React, {useContext, useEffect, useState} from "react";

import '../views/Home.css';
import DataTable, {createTheme} from "react-data-table-component";

import './PlayerStats.css';
import CustomNumberFormat from "./CustomNumberFormat";
import WinrateBar from "./WinrateBar";
import Spinner from "react-bootstrap/Spinner";
import {Col, Form, Row} from "react-bootstrap";
import Container from "react-bootstrap/Container";
import {ChampionImage, ItemImage, SummonerSpellImage} from "./LolAssets";
import Moment from "react-moment";
import moment from "moment";
import {VersionContext} from "./version";
import {SeasonContext, useSeason} from "./season";
import {trackPromise, usePromiseTracker} from "react-promise-tracker";
import {useNavigate, useNavigation} from "react-router";

createTheme('custom-dark', {
    text: {
        primary: '#FFFFFF',
        secondary: 'rgba(255, 255, 255, 0.7)',
        disabled: 'rgba(0,0,0,.12)'
    },
    background: {
        "default": '#222222'
    },
    context: {
        background: '#E91E63',
        text: '#FFFFFF'
    },
    divider: {
        "default": 'rgba(81, 81, 81, 1)'
    },
    button: {
        "default": '#FFFFFF',
        focus: 'inherit',
        hover: 'inherit',
        disabled: 'rgba(255, 255, 255, .18)'
    },
    sortFocus: {
        "default": 'rgba(255, 255, 255, .54)'
    },
    selected: {
        "default": 'rgba(0, 0, 0, .7)',
        text: '#FFFFFF'
    },
    highlightOnHover: {
        "default": 'rgba(0, 0, 0, .7)',
        text: '#FFFFFF'
    },
    striped: {
        "default": 'rgba(255, 255, 255, .1)',
        text: '#FFFFFF'
    },
    rows: {
        denseStyle: {
            minHeight: '300px'
        }
    }
});

const customStyles = {
    headRow: {
        denseStyle: {
            minHeight: '3rem'
        }
    },
    headCells: {
        style: {
            fontSize: '0.9rem'
        }
    },
    rows: {
        style: {
            fontSize: 'initial'
        },
        denseStyle: {
            minHeight: '2rem'
        }
    }
}

const columns = [
    {
        name: "Name",
        selector: row => row.playerName,
        sortable: true,
        grow: 1.5,
        sortFunction: (e1, e2) => e1.playerName.localeCompare(e2.playerName),
    },
    {
        name: "WinRate",
        selector: (data) => data.wins / (data.wins + data.losses),
        sortable: true,
        cell: (data) => <WinrateBar data={data}/>
    },
    {
        name: "Games",
        selector: (data) => data.wins + data.losses,
        sortable: true
    },
    {
        name: "Wins",
        selector: row => row.wins,
        sortable: true
    },
    {
        name: "Losses",
        selector: row => row.losses,
        sortable: true,
    },
    {
        name: "Kills",
        selector: row => row.kills,
        sortable: true,
    },
    {
        name: "Deaths",
        selector: row => row.deaths,
        sortable: true,
    },
    {
        name: "Assists",
        selector: row => row.assists,
        sortable: true,
    },
    {
        name: "KDA",
        selector: (data) => ((data.kills + data.assists) / data.deaths),
        format: (data) => <CustomNumberFormat>{(data.kills + data.assists) / data.deaths}</CustomNumberFormat>,
        sortable: true
    },
    {
        name: "Total Damage",
        selector: row => row.damage,
        sortable: true,
        format: (data) => <CustomNumberFormat>{data.damage}</CustomNumberFormat>,
    },
    {
        name: "DMG per Min",
        selector: (data) => data.damage / (data.gameDuration / 60),
        sortable: true,
        format: (data) => <CustomNumberFormat>{data.damage / (data.gameDuration / 60)}</CustomNumberFormat>,
    },
    {
        name: "Gold per Min",
        selector: (data) => data.gold / (data.gameDuration / 60),
        sortable: true,
        format: (data) => <CustomNumberFormat>{data.gold / (data.gameDuration / 60)}</CustomNumberFormat>,
    },
    {
        name: "CS per Min",
        selector: (data) => data.cs / (data.gameDuration / 60),
        sortable: true,
        format: (data) => <CustomNumberFormat>{data.cs / (data.gameDuration / 60)}</CustomNumberFormat>,
    },
    {
        name: "VS / Game",
        selector: (data) => data.visionScore / (data.wins + data.losses),
        sortable: true,
        format: (data) => <CustomNumberFormat>{data.visionScore / (data.wins + data.losses)}</CustomNumberFormat>,
    },
]

function PlayerStats(props) {
    const {promiseInProgress: statsLoading} = usePromiseTracker({area: 'playerstats'});
    const {promiseInProgress: seasonLoading} = usePromiseTracker({area: 'season'});
    const [data, setData] = useState();
    const [showProvisional, setShowProvisional] = useState(false);
    const {season, currentSeason, setSeason} = useContext(SeasonContext);
    const [selectedSeason, setSelectedSeason] = useState(undefined);

    //Set the selected Season to the current, if there currently is none selected, and ther is a current Season known
    if(selectedSeason === undefined && currentSeason !== undefined) setSelectedSeason(currentSeason);

    const filteredData = data?.filter(entry => (entry.wins + entry.losses) >= 5);

    useEffect(() => {
        const abortController = new AbortController();
        trackPromise(
            fetch(`/api/stats/player/${season}`, {signal: abortController.signal})
                .then((res) => {
                    if (!res.ok) throw Error(res.statusText);
                    return res;
                })
                .then(res => res.json())
                .then(res => {
                    setData(res);
                    //If there is no non provisional Data, show the provisional
                    if(res.filter(entry => (entry.wins + entry.losses) >= 5).length === 0) setShowProvisional(true);
                })
                .catch(reason => {
                    //Ignore AbortController.abort()
                    if (reason.name === 'AbortError') return;
                    alert("Error loading Player Stats: " + reason);
                })
            , 'playerstats'
        );

        return () => abortController.abort();
    }, [season]);

    return (
        <DataTable
            title={"Player Stats"}
            columns={columns}
            data={showProvisional ? data : filteredData}
            keyField={"name"}
            responsive={true}
            striped={true}
            dense={true}
            persistTableHead={true}
            defaultSortField={"playerName"}
            highlightOnHover={true}
            progressPending={statsLoading}
            theme={"custom-dark"}
            className={props.className}
            customStyles={customStyles}
            expandableRows
            expandableRowsComponent={PlayerDetails}
            actions={
                <Row className={"data-table-actions"}>
                    <Col xs={6} sm={5} md={4} xl={3}>
                        <Form.Switch
                            id={"provisional-switch"}
                            className={"provisional-switch"}
                            label="Include provisional Rankings"
                            checked={showProvisional}
                            onChange={(e) => setShowProvisional(e.target.checked)}
                        />
                    </Col>
                    <Col xs={6} sm={4} md={3} xl={2}>
                        <Form.Control
                            id="seasonSelect"
                            as="select"
                            className="ml-4"
                            onChange={(e) => {
                                setSeason(e.target.value);
                                setSelectedSeason(e.target.value);
                            }}
                            value={selectedSeason}
                        >
                            {seasonLoading ?
                                <option>Loading...</option>
                                :
                                <React.Fragment>
                                    <option value={0}>All Seasons</option>
                                    {[...Array(currentSeason).keys()].map(season => <option key={season} value={season+1}>Season {season+1}</option>)}
                                </React.Fragment>
                            }
                        </Form.Control>
                    </Col>
                </Row>
            }
            noDataComponent={<p>There is no data for the choosen filters</p>}
        />
    );
}

function PlayerDetails(props) {
    const [data, setData] = useState();
    const season = useSeason();

    useEffect(() => {
        const abortController = new AbortController();
        fetch(`/api/match/player/${props.data.playerName}/${season}`, {signal: abortController.signal})
            .then((res) => {
                if (!res.ok) throw Error(res.statusText);
                return res;
            })
            .then(res => res.json())
            .then(res => {
                setData(res);
            })
            .catch(reason => {
                //Ignore AbortController.abort()
                if (reason.name === 'AbortError') return;
                alert("Error loading Player Matches: " + reason)
            })

        return () => abortController.abort();
    }, [props.data.playerName, season]);

    if (data === undefined) {
        return (
            <div className={"playerDetails-loading"}>
                <Spinner animation="border" role="status">
                    <span className="sr-only">Loading...</span>
                </Spinner>
            </div>
        );
    }

    return (
        <Container fluid className={"matchHistoryContainer"}>
            <Container>
                <Row className={"matchHistory"}>
                    {data.map((match => <PlayerMatchEntry key={match.matchId} data={match}/>))}
                </Row>
            </Container>
        </Container>
    );
}

function PlayerMatchEntry(props) {
    const data = props.data;
    const navigate = useNavigate();

    let itemSlots = new Array(7);
    itemSlots.fill(undefined);

    data.player.items.forEach(((value, index) => {
        if (index === data.player.items.length - 1) itemSlots[6] = value;
        else itemSlots[index] = value;
    }));

    const onClick = () => {
        navigate("/match/" + data.matchId);
    }


    return (
        <VersionContext.Provider value={data.version}>
            <Col xs={12} onClick={onClick}
                 className={"matchHistoryEntry bg-secondary border border-light border-bottom-0"}>
                <div className={"resultIndicator resultIndicator-" + (data.win ? 'win' : 'loss')}/>
                <div className={"matchHistoryEntryData"}>
                    <div className={"champion"}>
                        <ChampionImage championId={data.player.championId}/>
                        <div className={"summonerSpells"}>
                            <SummonerSpellImage className={"summonerSpell"} spellId={data.player.summonerSpellDId}/>
                            <SummonerSpellImage className={"summonerSpell"} spellId={data.player.summonerSpellFId}/>
                        </div>
                    </div>
                    <div className={"championName"}>
                        {data.champion}
                    </div>
                    <div className={"flex-grow-1"}/>
                    <div className={"items"}>
                        {itemSlots.map((item, slot) => <ItemImage key={slot} itemId={item}/>)}
                    </div>
                    <div className={"kda"}>
                        {data.player.stats.kills}/{data.player.stats.deaths}/{data.player.stats.assists}
                    </div>
                    <div className={"gold"}>
                        <CustomNumberFormat>{data.player.stats.goldEarned}</CustomNumberFormat>
                    </div>
                    <div className={"matchTime"}>
                        <div>{<Moment format="DD.MM.YYYY HH:mm">{data.matchCreationTime}</Moment>}</div>
                        <div>{moment.duration(data.matchDuration).format("m:ss", {trim: false})}</div>
                    </div>
                </div>
            </Col>
        </VersionContext.Provider>
    );
}

export default PlayerStats