import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Col, Container, Row } from "react-bootstrap";
import { FaMapMarkerAlt, FaPhone, FaStar } from "react-icons/fa";

//IMAGES
import PhotoProfil from "../images/photosVoitures/PhotoProfil.png";
import VoitureCarte from "./VoitureComp";

function VendeurComp() {
  const { vendeurId } = useParams();

  const [client, setClient] = useState(null);
  const [voitures, setVoitures] = useState([]);
  console.log(client);

  useEffect(() => {
    const fetchClient = async () => {
      console.log("vendeurId: " + vendeurId);
      const response = await fetch(
        `http://localhost:8000/user/client/${vendeurId}`
      );
      console.log(response);
      const data = await response.json().catch((error) => console.log(error));
      console.log(data);
      setClient(data);
    };
    fetchClient();
  }, [vendeurId]);

  useEffect(() => {
    const fetchVoitures = async () => {
      const response = await fetch(
        `http://localhost:8000/api/user/${vendeurId}`
      );
      const data = await response.json().catch((error) => console.log(error));
      console.log(data);
      setVoitures(data.voitures);
    };
    fetchVoitures();
  }, [vendeurId]);

  if (!client) {
    return <div>Loading...</div>;
  }
  return (
    <Container className="my-5">
      <Row>
        <Col>
          <div>
            <img
              src={PhotoProfil}
              alt="Profil"
              className="rounded-circle me-3"
              width="85"
              height="85"
            />
            <h4 className="mb-3 text-light">
              {client.prenom} {client.nom}
            </h4>
          </div>
          <div>
            <hr className="my-4 border-top border-2 border-secondary" />
            <p className="text-light mb-0">
              <FaStar className="text-warning me-1" />
              Vendeur certifié
            </p>
            <p className="text-light mb-0">
              <FaMapMarkerAlt className="me-1" />
              {client.adresse}
            </p>
            <p className="text-light mb-0">
              <FaPhone className="me-1" />
              {client.telephone}
            </p>
          </div>
        </Col>
        <Col md={9}>
          <h4 className="mb-4 text-light">
            Parcourez les produits de notre vendeur
          </h4>
          <Row>
            {voitures.map((voiture) => (
              <Col className="mb-4" sm={6} md={4} lg={3} key={voiture._id}>
                <VoitureCarte voiture={voiture} />
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
    </Container>
  );
}

export default VendeurComp;
