import React, {useState} from "react";

import {Col, Container, Row} from "react-bootstrap";
import Autosuggest from 'react-autosuggest';

import './Match.css';
import {ChampionImage, ItemImage, SummonerSpellImage} from "./LolAssets";
import CustomNumberFormat from "./CustomNumberFormat";

import {VersionContext} from "./version";

function Match(props) {

    const blueTeamId = props.data.blueTeam.teamId;
    const redTeamId = props.data.redTeam.teamId;

    const blueTeamPlayers = props.data.participants.filter(participant => participant.team === blueTeamId);
    const redTeamPlayers = props.data.participants.filter(participant => participant.team === redTeamId);

    return (
        <VersionContext.Provider value={props.data.version}>
            <Container fluid>
                <Row>
                    <Col xs={6} className={"team-result team-result-" + (props.data.blueTeam.winner ? "win" : "loss")}>
                        {props.data.blueTeam.winner ? "Victory" : "Defeat"}
                    </Col>
                    <Col xs={6} className={"team-result team-result-" + (props.data.redTeam.winner ? "win" : "loss")}>
                        {props.data.redTeam.winner ? "Victory" : "Defeat"}
                    </Col>
                    <Bans blue={props.data.blueTeam.bans} red={props.data.redTeam.bans}/>
                    <Col xs={6} className={"team blueTeam"}>
                        {blueTeamPlayers.map((participant) => <Player key={participant.participantId}
                                                                      data={participant}
                                                                      playerMappings={props.playerMappings}
                                                                      setPlayerMapping={props.setPlayerMapping}
                                                                      knownPlayers={props.knownPlayers}
                            />
                        )}
                    </Col>
                    <Col xs={6} className={"team redTeam"}>
                        {redTeamPlayers.map((participant) => <Player key={participant.participantId}
                                                                     data={participant}
                                                                     playerMappings={props.playerMappings}
                                                                     setPlayerMapping={props.setPlayerMapping}
                                                                     knownPlayers={props.knownPlayers}
                            />
                        )}
                    </Col>
                </Row>
            </Container>
        </VersionContext.Provider>
    );
}

function Player(props) {

    let playernameComponent;
    if (props.setPlayerMapping) {
        playernameComponent =
            <Col className={"playerInputContainer"}>
                <PlayerInput
                    playerMappings={props.playerMappings}
                    participantId={props.data.participantId}
                    setPlayerMapping={props.setPlayerMapping}
                    knownPlayers={props.knownPlayers}
                />
            </Col>
    } else {
        playernameComponent = <Col className={"playerName"}>{props.playerMappings[props.data.participantId]}</Col>;
    }

    return (
        <Row className={"justify-content-center"}>
            <Col className={"flex-grow-0 championSpellContainer"}>
                <ChampionImage championId={props.data.championId}/>
                <SummonerSpells participant={props.data}/>
            </Col>
            <Col>
                <Row className={"flex-column h-100"}>
                    {playernameComponent}
                    <Col className={"player-stats"}>
                        <div>Gold: <CustomNumberFormat>{props.data.stats.goldEarned}</CustomNumberFormat></div>
                        <div>CS: {props.data.stats.creepScore}</div>
                        <div>VS: {props.data.stats.visionScore}</div>
                    </Col>
                </Row>
            </Col>
            <Items items={props.data.items}/>
            <Col
                className={"flex-grow-0 kda"}>{props.data.stats.kills}/{props.data.stats.deaths}/{props.data.stats.assists}</Col>
        </Row>
    );
}

function PlayerInput(props) {
    const playerMappings = props.playerMappings;
    const value = playerMappings.hasOwnProperty(props.participantId) ? playerMappings[props.participantId] : "";

    const onChange = (event, {newValue}) => {
        props.setPlayerMapping(props.participantId, newValue);
    };

    const [suggestions, setSuggestions] = useState([]);

    const onSuggestionsFetchRequested = ({value}) => {
        if (!value) setSuggestions(props.knownPlayers);

        const search = value.trim().toLowerCase();

        setSuggestions(props.knownPlayers.filter(value => value.toLowerCase().includes(search)));
    }

    const onSuggestionsClearRequested = () => {
        setSuggestions(props.knownPlayers);
    }

    const getSuggestionValue = (suggestion) => {
        return suggestion;
    }

    const renderSuggestion = (suggestion) => {
        return (
            <div className="ac-entry">
                <span className="ac-title">{suggestion}</span>
            </div>
        );
    }

    return (
        <Autosuggest
            suggestions={suggestions}
            onSuggestionsFetchRequested={onSuggestionsFetchRequested}
            onSuggestionsClearRequested={onSuggestionsClearRequested}
            getSuggestionValue={getSuggestionValue}
            renderSuggestion={renderSuggestion}
            inputProps={{value, onChange, placeholder: "Spielernamen eingeben", className: "form-control"}}
        />
    );
}

function SummonerSpells(props) {

    return (
        <div>
            <SummonerSpellImage className={"summonerSpell"} spellId={props.participant.summonerSpellDId}/>
            <SummonerSpellImage className={"summonerSpell"} spellId={props.participant.summonerSpellFId}/>
        </div>
    );
}

function Items(props) {
    return (
        <Col className={"inventory-container"}>
            <div className={"item-container"}>
                {props.items.slice(0, -1).map((item, slot) => <ItemImage key={slot} itemId={item}/>)}
            </div>
            <div className={"trinket-container"}>
                <ItemImage itemId={props.items[props.items.length - 1]}/>
            </div>
        </Col>
    );
}

function Bans(props) {
    return (
        <Col xs={12} className={"bans"}>
            <div>
                {props.blue.map(ban => <ChampionImage key={ban} championId={ban}/>)}
            </div>
            <div>
                {props.red.map(ban => <ChampionImage key={ban} championId={ban}/>)}
            </div>
        </Col>
    );
}

export default Match;