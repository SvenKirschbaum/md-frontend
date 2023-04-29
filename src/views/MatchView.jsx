import React, {useEffect, useState} from "react";
import {useHistory, useParams} from "react-router";
import {useKeycloak} from "@react-keycloak/web";
import {Button, Modal} from "react-bootstrap";
import Match from "../components/Match";

import './MatchView.css';
import RoleComponent from "../components/RoleComponent";
import Moment from "react-moment";
import moment from "moment";

function MatchView() {
    const history = useHistory();
    const [data, setData] = useState();
    const {id} = useParams();
    const {keycloak} = useKeycloak();

    useEffect(() => {
        const abortController = new AbortController();
        fetch("/api/match/" + id, {signal: abortController.signal})
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
                if (reason.message) {
                    alert("Error loading Match Data: " + reason)
                }
            })

        return () => abortController.abort();

        // We dont want to refetch the match data just because our authentication Token changed, so the hook depends on the token but we dont include it in the dependency list
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const deleteMatch = () => {
        let headers = new Headers();
        headers.append("Authorization", "Bearer " + keycloak.token);

        fetch("/api/match/" + id, {
            headers: headers,
            method: 'DELETE',
        }).then((res) => {
            if (!res.ok) throw Error(res.statusText);
            return res;
        }).then(_ => {
            alert("Match erfolgreich gelöscht");
            history.push("/");
        })
            .catch(reason => {
                alert("Error deleting Match: " + reason)
            })
    };

    return (
        <div className={"match-container"}>
            <Modal.Dialog
                centered={true}
                size={"xl"}
            >
                <Modal.Header className={"d-flex justify-content-between"}>
                    <div>
                        <Modal.Title>Match {id}</Modal.Title>
                        <div>{data ? `Markus Dope Season ${data.season}` : ""}</div>
                    </div>
                    <div className={"text-right"}>
                        <div>{data ? <Moment format="DD.MM.YYYY HH:mm">{data.match.creationTime}</Moment> : ""}</div>
                        <div>{data ? moment.duration(data.match.duration).format("m:ss", {trim: false}) : ""}</div>
                    </div>
                </Modal.Header>

                <Modal.Body>
                    {data ?
                        <Match data={data.match} playerMappings={data.players}/> :
                        <div>Loading...</div>}
                </Modal.Body>

                <Modal.Footer className={"justify-content-between"}>
                    <Button variant="secondary" onClick={history.goBack}>Zurück</Button>
                    <RoleComponent role={"manager"}>
                        <Button variant="danger" onClick={deleteMatch}>Löschen</Button>
                    </RoleComponent>
                </Modal.Footer>
            </Modal.Dialog>
        </div>
    );
}

export default MatchView;