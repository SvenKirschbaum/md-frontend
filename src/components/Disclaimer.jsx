import React from "react";
import {Row} from "react-bootstrap";
import Col from "react-bootstrap/Col";

import './Disclaimer.css';
import Container from "react-bootstrap/Container";

function Disclaimer(props) {
    return (
        <Container>
            <Row>
                <Col xl={{span: 10, offset: 1}} className={"disclaimer"}>
                    Markus Dope isn't endorsed by Riot Games and doesn't reflect the views or opinions of Riot Games or
                    anyone officially involved in producing or managing Riot Games properties. Riot Games, and all
                    associated properties are trademarks or registered trademarks of Riot Games, Inc.
                </Col>
            </Row>
        </Container>
    );
}

export default Disclaimer;