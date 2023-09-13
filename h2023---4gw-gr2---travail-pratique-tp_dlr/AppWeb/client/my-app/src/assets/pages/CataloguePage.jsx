import { React, useState, useEffect } from "react";

import { Container, Row, Col } from "react-bootstrap";

import NavbarComp from "../components/NavbarComp";
import VoitureCarte from "../components/VoitureComp";
import FooterComp from "../components/FooterComp";

function CataloguePage() {
  const [voitures, setVoitures] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/api/catalogue")
      .then((response) => response.json())
      .then((data) => {
        setVoitures(data);
      })
      .catch((error) => console.error(error));
  }, []);
  return (
    <div className="cataloguePage">
      <NavbarComp></NavbarComp>
      <Container>
        <Row>
          {voitures.map((voiture) => (
            <Col className="mb-4" sm={6} md={4} lg={3} key={voiture._id}>
              <VoitureCarte voiture={voiture} />
            </Col>
          ))}
        </Row>
      </Container>
      <FooterComp></FooterComp>
    </div>
  );
}
export default CataloguePage;
