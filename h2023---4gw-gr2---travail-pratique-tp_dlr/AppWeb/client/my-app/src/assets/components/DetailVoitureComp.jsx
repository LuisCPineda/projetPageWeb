import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Modal } from "react-bootstrap";
import { FaEnvelope } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

//import React, { useState, useEffect } from "react";
import {
  Form,
  Carousel,
  FormGroup,
  FormLabel,
  InputGroup,
  Button,
} from "react-bootstrap";

/* input validation (formik/yup) */
import { useFormik } from "formik";
import * as Yup from "yup";

import PhotoProfilLogo from "../images/photosVoitures/PhotoProfil.png";
import CarburantLogo from "../images/photosVoitures/carburant.png";
import TransmissionLogo from "../images/photosVoitures/transmission.png";
import KilometrageLogo from "../images/photosVoitures/kilometrage.png";
import CarrosserieLogo from "../images/photosVoitures/carrosserie.png";
import { toast } from "react-toastify";
import { useAuthContext } from "../../context/auth-context";

function DetailVoitureComp() {
  const [voiture, setVoiture] = useState(null);
  const { voitureId } = useParams();

  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const [modlalConfirmation, setModalConfirmation] = useState(false);
  const [modalModification, setModalModification] = useState(false);
  const [utilisateurInfos, setUtilisateurInfos] = useState(null);

  const [messageText, setMessageText] = useState(
    "Bonjour, je suis intéressé par votre voiture. Est-elle toujours disponible?"
  );

  const [titre, setTitre] = useState("");
  const [prix, setPrix] = useState("");
  const [description, setDescription] = useState("");

  const { utilisateur } = useAuthContext();

  const navigate = useNavigate();

  useEffect(() => {
    const chercherVoiture = async () => {
      const resultat = await fetch(
        `http://localhost:8000/api/voiture/${voitureId}`
      );
      const body = await resultat.json().catch((error) => {
        console.log(error);
      });
      setVoiture(body);
      setTitre(body.titre);
      setPrix(body.prix);
      setDescription(body.description);

      const resultatUtilisateur = await fetch(
        `http://localhost:8000/user/client/${body.vendeur}`
      );
      const bodyUtilisateur = await resultatUtilisateur
        .json()
        .catch((error) => {
          console.log(error);
        });
      setUtilisateurInfos(bodyUtilisateur);
    };
    chercherVoiture();
  }, [voitureId]);

  const envoyerMessage = async (event) => {
    event.preventDefault();
    const resultat = await fetch(`http://localhost:8000/messages/envoyer`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        toUserId: voiture.vendeur,
        voitureId: voiture._id,
        message: messageText,
      }),
    });

    if (!resultat.ok) {
      toast.error("Erreur lors de l'envoi du message");
      return;
    }
    toast.success("Message envoyé");
  };

  const formik = useFormik({
    initialValues: {
      titre: titre,
      prix: prix,
      description: description,
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      titre: Yup.string().required("Le titre est obligatoire"),
      prix: Yup.number()
        .typeError("Le prix doit être un chiffre")
        .min(0, "Le prix doit être positive")
        .required("Le prix est obligatoire"),
      description: Yup.string().required("La description est obligatoire"),
    }),
    onSubmit: async (values) => {
      try {
        const resultat = await fetch(`http://localhost:8000/api/${voitureId}`, {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        });

        if (!resultat.ok) {
          toast.error("Erreur lors de la modification de la voiture");
          return;
        }
        toast.success("Voiture modifiée");
        setTitre(values.titre);
        setPrix(values.prix);
        setDescription(values.description);
        fermerModalModification();
      } catch (error) {
        console.log(error);
      }
    },
  });

  const supprimerVoirure = async () => {
    try {
      const resultat = await fetch(`http://localhost:8000/api/${voitureId}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!resultat.ok) {
        toast.error("Erreur lors de la suppression de la voiture");
        return;
      }
      toast.success("Voiture supprimée");
      fermerModalConfirmation();
      setTimeout(() => {
        navigate("/catalogue");
      }, 3000);
    } catch (error) {
      console.log(error);
    }
  };

  const ouvrirModalModification = () => {
    setModalModification(true);
  };

  const fermerModalModification = () => {
    setModalModification(false);
  };

  const ouvrirModalConfirmation = () => {
    setModalConfirmation(true);
  };

  const fermerModalConfirmation = () => {
    setModalConfirmation(false);
  };

  const navigatePageVendeur = () => {
    navigate(`/vendeur/${voiture.vendeur}`);
  };

  if (!voiture || !utilisateurInfos) {
    return <div>Loading...</div>;
  }
  return (
    <div className="container-fluid">
      <div className="row justify-content-center">
        <div className="col-sm-12 col-md-10 col-lg-8 bg-color-tableau-photo rounded p-4 my-4">
          <Form onSubmit={envoyerMessage}>
            <div className="row d-flex flex-row">
              <div className="col-12 col-md-12 col-lg-8">
                <FormGroup className="mb-3 fs-5">
                  <Carousel>
                    {voiture.photos_voiture.map((photoPath, index) => (
                      <Carousel.Item key={index}>
                        <div className="image-wrapper">
                          <img
                            src={`http://localhost:8000/${photoPath}`}
                            alt={`Voiture ${index + 1}`}
                            width="700"
                            height="470"
                            className="carousel-image"
                            onClick={() => {
                              setSelectedImage(
                                `http://localhost:8000/${photoPath}`
                              );
                              setShowModal(true);
                            }}
                          />
                        </div>
                      </Carousel.Item>
                    ))}
                  </Carousel>
                </FormGroup>
              </div>
              <div className="col-12 col-md-12 col-lg-4 my-4">
                <FormGroup className="mb-3 fs-2 text-light fw-bold">
                  <FormLabel> {titre} </FormLabel>
                </FormGroup>
                <FormGroup className=" fs-4 text-light ">
                  <FormLabel>
                    {voiture.annee} {voiture.marque} {voiture.modele}
                  </FormLabel>
                </FormGroup>
                <FormGroup className="mb-3 fs-4 text-light fw-bold ">
                  <FormLabel>{prix} $</FormLabel>
                </FormGroup>
                <FormGroup className="mb-3 text-light  align-items-center">
                  <img
                    src={PhotoProfilLogo}
                    alt="Profil"
                    width="40"
                    height="40"
                    className="me-2"
                  />
                  <FormLabel
                    className="link-page-vendeur"
                    onClick={navigatePageVendeur}
                  >
                    {utilisateurInfos.prenom} {utilisateurInfos.nom}
                  </FormLabel>
                </FormGroup>
                {utilisateur && utilisateur.userId === voiture.vendeur ? (
                  <div>
                    <FormGroup className="mb-3 fs-5 text-light">
                      <Button
                        className="fw-bold fs-6 w-100 mb-2"
                        onClick={ouvrirModalModification}
                      >
                        Modifier
                      </Button>
                      <Button
                        className="fw-bold fs-6 w-100"
                        variant="danger"
                        onClick={ouvrirModalConfirmation}
                      >
                        Supprimer
                      </Button>
                    </FormGroup>
                  </div>
                ) : (
                  <div>
                    <FormGroup className="mb-3 fs-5 text-light">
                      <FormLabel>Message</FormLabel>
                      <InputGroup>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          className="champs-description"
                          value={messageText}
                          onChange={(event) =>
                            setMessageText(event.target.value)
                          }
                        ></Form.Control>
                      </InputGroup>
                    </FormGroup>
                    <FormGroup className="d-flex justify-content-center">
                      <InputGroup>
                        <Button
                          className="fw-bold fs-6 w-100"
                          variant="danger"
                          type="submit"
                        >
                          Envoyer un message <FaEnvelope className="ms-2" />
                        </Button>
                      </InputGroup>
                    </FormGroup>
                  </div>
                )}
              </div>
              <div className="row align-items-center border-top border-bottom py-2 mt-4">
                <div className="col-md-3 text-center">
                  <form>
                    <div className="form-group">
                      <label className="text-light">
                        ★ VIN : {voiture.numero_vin}
                      </label>
                    </div>
                  </form>
                </div>
                <div className="col-md-3 text-center">
                  <form>
                    <div className="form-group">
                      <label className="text-light">
                        ★ Couleur intérieure : {voiture.couleur_interieur}
                      </label>
                    </div>
                  </form>
                </div>
                <div className="col-md-3 text-center">
                  <form>
                    <div className="form-group">
                      <label className="text-light">
                        ★ Couleur extérieure : {voiture.couleur_exterieur}
                      </label>
                    </div>
                  </form>
                </div>
                <div className="col-md-3 text-center">
                  <form>
                    <div className="form-group">
                      <label className="text-light">
                        ★ Moteur : {voiture.moteur}
                      </label>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </Form>
        </div>
      </div>

      <div className="row justify-content-center">
        <div className="col-12 col-md-10 col-lg-8 bg-color-tableau rounded p-4 my-2">
          <div className="row justify-content-center">
            <div className="col-12 col-sm-6 col-md-3 mb-3 d-flex flex-column flex-sm-row align-items-center text-center">
              <img
                src={CarburantLogo}
                alt="Carburant"
                width="70"
                height="60"
                className="me-2"
              />
              <FormLabel className="details-label">
                <span className="fw-bold">{voiture.type_carburant}</span>
                <br /> Type de carburant
              </FormLabel>
            </div>
            <div className="col-12 col-sm-6 col-md-3 mb-3 d-flex flex-column flex-sm-row align-items-center">
              <img
                src={KilometrageLogo}
                alt="kilometrage"
                width="85"
                height="55"
                className="me-2"
              />
              <FormLabel className="details-label">
                <span className="fw-bold">{voiture.kilometrage} km</span>
                <br />
                Kilométrage
              </FormLabel>
            </div>
            <div className="col-12 col-sm-6 col-md-3 mb-3 d-flex flex-column flex-sm-row align-items-center">
              <img
                src={TransmissionLogo}
                alt="Transmission"
                width="65"
                height="55"
                className="me-2"
              />
              <FormLabel className="details-label">
                <span className="fw-bold">{voiture.transmission}</span>
                <br />
                Transmission
              </FormLabel>
            </div>
            <div className="col-12 col-sm-6 col-md-3 mb-3 d-flex flex-column flex-sm-row align-items-center">
              <img
                src={CarrosserieLogo}
                alt="Carosserie"
                width="85"
                height="65"
                className="me-2"
              />
              <FormLabel className="details-label">
                <span className="fw-bold">{voiture.type_carrosserie}</span>
                <br />
                Type de carrosserie
              </FormLabel>
            </div>
          </div>
        </div>
      </div>

      <div className="row justify-content-center">
        <div className="col-md-10 col-lg-8 bg-color-tableau-photo rounded p-4 my-4">
          <div className="w-100 col-md-6">
            <FormGroup className=" fs-4 mb-3 text-light fw-bold">
              <FormLabel>Description</FormLabel>
              <div className="champs-description">{description}</div>
            </FormGroup>
          </div>
        </div>
      </div>
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        centered
        className="voiture-modal"
      >
        <Modal.Body
          className="text-center voiture-modal-body"
          onClick={() => setShowModal(false)}
        >
          {selectedImage && (
            <img src={selectedImage} alt="Voiture selectionnée" />
          )}
        </Modal.Body>
      </Modal>
      <Modal
        show={modlalConfirmation}
        onHide={fermerModalConfirmation}
        centered
      >
        <Modal.Header>
          <Modal.Title>
            Êtes-vous sûr de voulour supprimer votre voiture? Cette action est
            irréversible
          </Modal.Title>
        </Modal.Header>
        <Modal.Footer>
          <Button variant="secondary" onClick={fermerModalConfirmation}>
            Annuler
          </Button>
          <Button variant="danger" onClick={supprimerVoirure}>
            Supprimer
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={modalModification} onHide={fermerModalModification} centered>
        <Modal.Header closeButton>
          <Modal.Title>Modifier votre voiture</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={formik.handleSubmit}>
            <FormGroup className="mb-3">
              <FormLabel>Titre</FormLabel>
              <Form.Control
                type="text"
                name="titre"
                onChange={formik.handleChange}
                value={formik.values.titre}
                isInvalid={formik.touched.titre && formik.errors.titre}
              />
              {formik.touched.titre && formik.errors.titre ? (
                <div className="text-danger">{formik.errors.titre}</div>
              ) : null}
            </FormGroup>
            <FormGroup className="mb-3">
              <FormLabel>Prix</FormLabel>
              <Form.Control
                type="number"
                name="prix"
                onChange={formik.handleChange}
                value={formik.values.prix}
                isInvalid={formik.touched.prix && formik.errors.prix}
              />
              {formik.touched.prix && formik.errors.prix ? (
                <div className="text-danger">{formik.errors.prix}</div>
              ) : null}
            </FormGroup>
            <FormGroup className="mb-3">
              <FormLabel>Description</FormLabel>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                onChange={formik.handleChange}
                value={formik.values.description}
                isInvalid={
                  formik.touched.description && formik.errors.description
                }
              />
              {formik.touched.description && formik.errors.description ? (
                <div className="text-danger">{formik.errors.description}</div>
              ) : null}
            </FormGroup>
            <FormGroup className="d-flex justify-content-center">
              <Button
                variant="secondary"
                onClick={fermerModalModification}
                className="btn-annuler-modification"
              >
                Annuler
              </Button>
              <Button variant="primary" type="submit">
                Modifier
              </Button>
            </FormGroup>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default DetailVoitureComp;
