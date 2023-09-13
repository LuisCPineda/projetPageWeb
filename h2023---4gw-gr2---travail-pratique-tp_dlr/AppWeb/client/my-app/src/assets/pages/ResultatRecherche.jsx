import React, { useState, useEffect } from "react";
import { useParams,useLocation } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";

import NavbarComp from "../components/NavbarComp";
import VoitureCarte from "../components/VoitureComp";
import FooterComp from "../components/FooterComp";
//import { toast } from "react-toastify";

function ResultatRecherche() {
  const [voitures, setVoitures] = useState([]);

  const location = useLocation();
  const chercherParametres= new URLSearchParams(location.search);
  
  const { resultat } = useParams();
  console.log("Voitures data type:", typeof data);
  useEffect(() => {
    
    fetch(`http://localhost:8000/api/resultatRecherche?${chercherParametres}`)
      .then((response) => response.json())
      .then((data) => {
        setVoitures(data.voitures);
      })
      //.then((response)=>toast.success(response.message))
      .catch((error) => console.error(error));
      
  }, [resultat]);

  return (
    <div className="cataloguePage">
      <NavbarComp></NavbarComp>
      <div className="d-flex justify-content-center mb-5"><h1>Voici votre résultat de la recherche</h1></div>
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
                Aucun véhicule disponible pour cette recherche pour le moment.
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
export default ResultatRecherche;