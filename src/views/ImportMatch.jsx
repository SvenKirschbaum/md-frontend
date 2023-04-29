import React, {useEffect, useState} from "react";

import './ImportMatch.css'

import {Button, Form, Modal} from "react-bootstrap";
import {Route, Switch, useHistory, useParams} from "react-router";
import NoMatch from "./NoMatch";
import {useKeycloak} from "@react-keycloak/web";
import Match from "../components/Match";
import Moment from "react-moment";
import moment from "moment";

function ImportMatch() {
    return (
        <Switch>
            <Route path={"/import"} exact component={ImportStep1}/>
            <Route path={"/import/:matchId"} exact component={ImportStep2}/>
            <Route component={NoMatch}/>
        </Switch>
    );
}

function ImportStep1() {
    const history = useHistory();

    const [matchId, setMatchId] = useState("");

    const onInput = (event) => {
        const regex = /https:\/\/matchhistory\.euw\.leagueoflegends\.com\/[a-z]{2}\/#match-details\/EUW1\/(\d+)\//gi;
        let match;

        if ((match = regex.exec(event.target.value)) !== null) {
            setMatchId(match[1]);
        }

        if (event.target.value.match("^\\d*$") != null) {
            setMatchId(event.target.value);
        }
    }

    return (
        <div className={"import-container"}>
            <Modal.Dialog
                centered={true}
                size={"lg"}
            >
                <Modal.Header>
                    <Modal.Title>Match importieren</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>Match ID</Form.Label>
                            <Form.Control type={"text"} placeholder={"Match ID"} value={matchId} onChange={onInput}/>
                            <Form.Text>
                                Die Match-ID ist die erste Zahl in der URL der Online Matchhistory.<br/>
                                Beispiel: https://matchhistory.euw.leagueoflegends.com/en/#match-details/EUW1/<span
                                className={"text-danger font-weight-bold"}>4811340935</span>/28857993?tab=overview
                            </Form.Text>
                        </Form.Group>
                    </Form>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={() => history.push("/")}>Zurück</Button>
                    <Button variant="primary" onClick={() => history.push("/import/" + matchId)}>Importieren</Button>
                </Modal.Footer>
            </Modal.Dialog>
        </div>
    );
}

function ImportStep2() {
    const {matchId} = useParams();
    const history = useHistory();
    const {keycloak} = useKeycloak();

    const [data, setData] = useState(null);
    const [playerMappings, setPlayerMappings] = useState({});

    useEffect(() => {
        let headers = new Headers();
        headers.append("Authorization", "Bearer " + keycloak.token);

        const abortController = new AbortController();
        fetch("/api/import/" + matchId, {
            headers: headers,
            signal: abortController.signal
        }).then((res) => {
            if (res.status === 422) {
                res.json().then(value => alert("Error: " + value.message));
                throw Error();
            } else if (!res.ok) throw Error(res.statusText);
            return res;
        }).then(res => res.json())
            .then(res => {
                if (res.hasOwnProperty('playerMapping')) setPlayerMappings(res.playerMapping);
                setData(res);
            })
            .catch(reason => {
                //Ignore AbortController.abort()
                if (reason.name === 'AbortError') return;
                if (reason.message) {
                    alert("Error loading Match Data: " + reason)
                }
                history.push("/import");
            })

        return () => abortController.abort();

        // We dont want to refetch the match data just because our authentication Token changed, so the hook depends on the token but we dont include it in the dependency list
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [matchId]);

    const setPlayerMapping = (participantId, playerName) => {
        let mappings = {...playerMappings};
        mappings[participantId] = playerName;
        setPlayerMappings(mappings);
    }

    const importMatch = () => {
        const participantIds = data.match.participants.map(participant => participant.participantId);
        if (!participantIds.map(id => playerMappings.hasOwnProperty(id)).reduce((previousValue, currentValue) => previousValue && currentValue)) {
            return alert("Bitte alle Spielernamen ausfüllen");
        }
        if (!participantIds.map(id => playerMappings[id]).reduce((previousValue, currentValue) => previousValue && currentValue)) {
            return alert("Bitte alle Spielernamen ausfüllen");
        }

        let headers = new Headers();
        headers.append("Authorization", "Bearer " + keycloak.token);
        headers.append("Content-Type", "application/json");

        fetch("/api/import/" + matchId, {
            headers: headers,
            method: 'POST',
            body: JSON.stringify({playerMapping: playerMappings})
        }).then((res) => {
            if (!res.ok) throw Error(res.statusText);
            return res;
        }).then(value => {
            alert("Match erfolgreich gespeichert");
            history.push("/");
        })
            .catch(reason => {
                alert("Error saving Match: " + reason)
            })
    }

    return (
        <div className={"import-container"}>
            <Modal.Dialog
                centered={true}
                size={"xl"}
            >
                <Modal.Header>
                    <Modal.Title>Match importieren: Spieler zuordnen</Modal.Title>
                    <div className={"text-right"}>
                        <div>{data ? <Moment format="DD.MM.YYYY HH:mm">{data.match.creationTime}</Moment> : ""}</div>
                        <div>{data ? moment.duration(data.match.duration).format("m:ss", {trim: false}) : ""}</div>
                    </div>
                </Modal.Header>

                <Modal.Body>
                    {data ?
                        <Match data={data.match} playerMappings={playerMappings} knownPlayers={data.knownPlayers}
                               setPlayerMapping={setPlayerMapping}/> :
                        <div>Loading...</div>}
                </Modal.Body>

                <Modal.Footer className={"justify-content-between"}>
                    <Button variant="secondary" onClick={history.goBack}>Zurück</Button>
                    <Button variant="primary" onClick={importMatch}>Importieren</Button>
                </Modal.Footer>
            </Modal.Dialog>
        </div>
    );
}


export default ImportMatch