import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";

import NavbarComp from "../components/NavbarComp";
import VoitureCarte from "../components/VoitureComp";
import FooterComp from "../components/FooterComp";

function VoituresParMarquePage() {
  const [voitures, setVoitures] = useState([]);
  const { marque } = useParams();
  console.log("Voitures data type:", typeof data);

  useEffect(() => {
    fetch(`http://localhost:8000/api/recherche/${marque}`)
      .then((response) => response.json())
      .then((data) => {
        setVoitures(data.voitures);
      })
      .catch((error) => console.error(error));
  }, [marque]);

  return (
    <div className="cataloguePage">
      <NavbarComp></NavbarComp>
      <Container>
        <Row>
          {voitures.length > 0 ? (
            voitures.map((voiture) => (
              <Col className="mb-4" sm={6} md={4} lg={3} key={voiture._id}>
                <VoitureCarte voiture={voiture} />
              </Col>
            ))
          ) : (
            <Col>
              <p className="recherche-vide">
                Aucun véhicule disponible pour cette marque pour le moment.
                Veuillez revenir ultérieurement
              </p>
            </Col>
          )}
        </Row>
      </Container>
      <FooterComp></FooterComp>
    </div>
  );
}
export default VoituresParMarquePage;
