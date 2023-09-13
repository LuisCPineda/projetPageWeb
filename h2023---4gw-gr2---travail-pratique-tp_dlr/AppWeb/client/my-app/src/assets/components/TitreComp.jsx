/* react components */
import React from "react";
import { Container, Row, Col } from "react-bootstrap";

/* component */
import NavbarComp from "./NavbarComp";

function TitreComp() {
  return (
    <div className="header-page-principale">
      <NavbarComp></NavbarComp>
      <Container className="section-titre">
        <Row>
          <Col>
            <h1 className="big-heading">
              Trouver facilement la voiture qui vous convient
            </h1>
          </Col>
        </Row>
        <Row>
          <Col>
            <h4>
              Lorem ipsum dolor sit amet. Aut debitis doloremque eum minima
              nesciunt et nihil ipsum sed numquam dolor qui quibusdam quam.
            </h4>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
export default TitreComp;
