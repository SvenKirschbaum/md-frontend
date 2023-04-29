import React from 'react';
import {Col, Container, Row} from "react-bootstrap";

import './NoMatch.css'
import {Link} from "react-router-dom";

function NoMatch() {
    return (
        <Container fluid className={"no-match"}>
            <Row className={"align-middle"}>
                <Col md={12}>
                    <div className="error-template">
                        <h1>Oops!</h1>
                        <h2>404 Not Found</h2>
                        <div className="error-details">
                            Sorry, an error has occured, Requested page not found!
                        </div>
                        <div className="error-actions">
                            <Link to={"/"} className={"btn btn-primary btn-lg"}>Take Me Home</Link>
                        </div>
                    </div>
                </Col>
            </Row>
        </Container>
    );
}

export default NoMatch