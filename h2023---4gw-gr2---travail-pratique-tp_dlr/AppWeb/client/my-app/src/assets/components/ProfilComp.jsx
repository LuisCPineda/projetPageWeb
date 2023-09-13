import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

/* react-bootstrap components */
import {
  Container,
  Row,
  Col,
  Nav,
  Tab,
  InputGroup,
  FormControl,
  Button,
  Form,
  Modal,
} from "react-bootstrap";

/* toast notifications */
import { toast } from "react-toastify";

/* input validation (formik/yup) */
import { useFormik } from "formik";
import * as Yup from "yup";

/* react icons */
import {
  FaMapMarkerAlt,
  FaEdit,
  FaLock,
  FaUserCircle,
  FaEnvelope,
  FaPhone,
} from "react-icons/fa";

import VoitureCarte from "./VoitureComp";
import PhotoProfil from "../images/photosVoitures/PhotoProfil.png";

/* Context authentification */
import { useAuthContext } from "../../context/auth-context";

function ProfilComp() {
  const { utilisateur, logout } = useAuthContext();

  const [isEditing, setIsEditing] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [courriel, setCourriel] = useState("");
  const [adresse, setAdresse] = useState("");
  const [telephone, setTelephone] = useState("");

  const [voitures, setVoitures] = useState([]);

  const navigate = useNavigate();

  /* récupération des données du client */
  useEffect(() => {
    const fetchClientData = async () => {
      try {
        const reponseClient = await fetch(
          `http://localhost:8000/user/client/${utilisateur.userId}`
        );
        const clientData = await reponseClient.json().catch((err) => {
          console.log("Erreur dans la récupération des données du client", err);
        });
        setNom(clientData.nom);
        setPrenom(clientData.prenom);
        setAdresse(clientData.adresse);
        setTelephone(clientData.telephone);

        const reponseUtilisateur = await fetch(
          `http://localhost:8000/user/${utilisateur.userId}`
        );
        const utilisateurData = await reponseUtilisateur.json().catch((err) => {
          console.log("Erreur dans la récupération des données du client", err);
        });
        setCourriel(utilisateurData.courriel);
      } catch (err) {
        console.log("Erreur dans la récupération des données du client", err);
      }
    };
    fetchClientData();
  }, [utilisateur.userId]);

  /* récupération des voitures du client */
  useEffect(() => {
    const fetchVoitures = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/api/user/${utilisateur.userId}`
        );
        console.log("response", response);
        console.log(utilisateur.userId);
        const responseData = await response.json();
        setVoitures(responseData.voitures);
      } catch (err) {
        console.log("Erreur dans la récupération des voitures du client", err);
      }
    };
    fetchVoitures();
  }, [utilisateur.userId]);

  /* modification des données du client */
  const formik = useFormik({
    initialValues: {
      nom: nom,
      prenom: prenom,
      adresse: adresse,
      telephone: telephone,
      mdpCourant: "",
      nouveauMdp: "",
      mdpConfirmer: "",
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      nom: Yup.string()
        .matches(
          /^[a-zA-Z-'\s]+$/,
          "Seuls les lettres, les espaces, les tirets et les apostrophes sont autorisées"
        )
        .required("Le nom est requis"),
      prenom: Yup.string()
        .matches(
          /^[a-zA-Z-'\s]+$/,
          "Seuls les lettres, les espaces, les tirets et les apostrophes sont autorisées"
        )
        .required("Le prénom est requis"),
      adresse: Yup.string().required("L'adresse est requise"),
      telephone: Yup.string()
        .matches(/^\d+$/, "Veuillez entrer un numéro de téléphone valide.")
        .required("Le numéro de téléphone est requis"),
      mdpCourant: Yup.string().required("Le mot de passe est requis"),
      nouveauMdp: Yup.string()
        .min(8, "Le mot de passe doit contenir au moins 8 caractères")
        .matches(
          /[a-z]/,
          "Le mot de passe doit comporter au moins une lettre minuscule."
        )
        .matches(
          /[A-Z]/,
          "Le mot de passe doit comporter au moins une lettre majuscule."
        )
        .matches(/[0-9]/, "Le mot de passe doit comporter au moins un chiffre.")
        .matches(
          /[^a-zA-Z0-9]/,
          "Le mot de passe doit comporter au moins un symbole."
        )
        .max(
          20,
          "Le mot de passe ne peut pas comporter plus de 20 caractères."
        ),
      mdpConfirmer: Yup.string().when("nouveauMdp", {
        is: (val) => (val && val.length > 0 ? true : false),
        then: Yup.string()
          .required("Vous devez confirmer votre mot de passe")
          .oneOf(
            [Yup.ref("mdp"), null],
            "Les mots de passe doivent correspondre."
          ),
      }),
    }),
    onSubmit: async (values) => {
      try {
        const response = await fetch(
          `http://localhost:8000/user/${utilisateur.userId}`,
          {
            method: "PATCH",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              nom: values.nom,
              prenom: values.prenom,
              adresse: values.adresse,
              telephone: values.telephone,
              mdpCourant: values.mdpCourant,
              nouveauMdp: values.nouveauMdp,
            }),
          }
        );
        const responseData = await response.json();
        if (response.ok) {
          setNom(values.nom);
          setPrenom(values.prenom);
          setAdresse(values.adresse);
          setTelephone(values.telephone);

          toast.success("Les informations ont été mises à jour avec succès");
        } else {
          toast.error(`Erreur ${response.status}: ${responseData.message}`);
        }
      } catch (err) {
        console.log("Erreur dans la modification du client", err);
        toast.error("Erreur lors de la soumission des données");
      }

      setIsEditing(false);
    },
  });

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  /* suppression du compte */
  const supprimerCompte = async () => {
    try {
      const response = await fetch(`http://localhost:8000/user/supprimer`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          utilisateurId: utilisateur.userId,
          mdp: formik.values.mdpCourant,
        }),
      });
      const responseData = await response.json();
      if (response.ok) {
        logout();
        toast.success("Le compte a été supprimé avec succès");
        setTimeout(() => {
          navigate("/");
        }, 3000);
      } else {
        toast.error(`Erreur ${response.status}: ${responseData.message}`);
      }
    } catch (err) {
      console.log("Erreur dans la suppression du compte", err);
      toast.error("Erreur lors de la suppression du compte");
    }
  };

  /* affichage du nom complet */
  const nomComplet = `${prenom} ${nom}`;

  return (
    <Container className="profil-container">
      <Row className="user-info">
        <Col
          xs={12}
          md={3}
          className="d-flex align-items-center justify-content-center"
        >
          <img src={PhotoProfil} alt="User" className="user-img" />
        </Col>
        <Col xs={12} md={9} className="user-details">
          <div>
            <h3>{nomComplet}</h3>
            <p>Courriel: {courriel}</p>
            <p>Téléphone: {telephone}</p>
            <p>Adresse: {adresse}</p>
          </div>
        </Col>
      </Row>
      <Tab.Container defaultActiveKey="mesVoitures">
        <Row className="bg-white">
          <Col xs={12} md={3}>
            <Nav variant="pills" className="flex-column mt-2">
              <Nav.Item>
                <Nav.Link className="profil-tab" eventKey="mesVoitures">
                  Mes Voitures
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link className="profil-tab" eventKey="parametres">
                  Parametres
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </Col>
          <Col xs={12} md={9}>
            <Tab.Content>
              <Tab.Pane eventKey="mesVoitures">
                <div className="card-body mt-3 mb-3">
                  <div className="row mb-4">
                    <div className="col-md-12 d-flex align-items-center justify-content-between mb-3">
                      <h2>Mes Voitures</h2>
                    </div>
                  </div>
                  <Row>
                    {!voitures ? (
                      <div className="col-12 text-center">
                        <p>Aucune voiture disponible.</p>
                      </div>
                    ) : (
                      voitures.map((voiture) => (
                        <Col
                          className="mb-4 d-flex justify-content-center"
                          sm={6}
                          md={4}
                          lg={3}
                          key={voiture._id}
                        >
                          <VoitureCarte voiture={voiture} />
                        </Col>
                      ))
                    )}
                  </Row>
                </div>
              </Tab.Pane>
              <Tab.Pane eventKey="parametres">
                {
                  <Form onSubmit={formik.handleSubmit}>
                    <div className="card-body mt-3 mb-3">
                      <div className="row mb-4">
                        <div className="col-md-12 d-flex align-items-center justify-content-between mb-3">
                          <h2>Paramètres du compte</h2>
                          <FaEdit
                            className="edit-button"
                            onClick={() => setIsEditing(!isEditing)}
                          />
                        </div>
                        <div className="col-md-4 d-flex align-items-center">
                          <FaUserCircle className="me-2" />
                          <p className="mb-0">Nom d'utilisateur</p>
                        </div>
                        <div className="col-md-8">
                          {isEditing ? (
                            <Row>
                              <Col>
                                <InputGroup>
                                  <FormControl
                                    name="prenom"
                                    value={formik.values.prenom}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    isInvalid={
                                      formik.touched.prenom &&
                                      formik.errors.prenom
                                    }
                                  />
                                  <Form.Control.Feedback type="invalid">
                                    {formik.errors.prenom}
                                  </Form.Control.Feedback>
                                </InputGroup>
                              </Col>
                              <Col>
                                <InputGroup>
                                  <FormControl
                                    name="nom"
                                    value={formik.values.nom}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    isInvalid={
                                      formik.touched.nom && formik.errors.nom
                                    }
                                  />
                                  <Form.Control.Feedback type="invalid">
                                    {formik.errors.nom}
                                  </Form.Control.Feedback>
                                </InputGroup>
                              </Col>
                            </Row>
                          ) : (
                            <div className="d-flex align-items-center">
                              <p className="mb-0 me-2">{nomComplet}</p>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="row mb-4">
                        <div className="col-md-4 d-flex align-items-center">
                          <FaEnvelope className="me-2" />
                          <p className="mb-0">Courriel</p>
                        </div>
                        <div className="col-md-8">
                          <div className="d-flex align-items-center">
                            <p className="mb-0 me-2">{courriel}</p>
                          </div>
                        </div>
                      </div>
                      <div className="row mb-4">
                        <div className="col-md-4 d-flex align-items-center">
                          <FaMapMarkerAlt className="me-2" />
                          <p className="mb-0">Adresse</p>
                        </div>
                        <div className="col-md-8">
                          {isEditing ? (
                            <InputGroup>
                              <FormControl
                                name="adresse"
                                value={formik.values.adresse}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                isInvalid={
                                  formik.touched.adresse &&
                                  formik.errors.adresse
                                }
                              />
                              <Form.Control.Feedback type="invalid">
                                {formik.errors.adresse}
                              </Form.Control.Feedback>
                            </InputGroup>
                          ) : (
                            <div className="d-flex align-items-center">
                              <p className="mb-0 me-2">{adresse}</p>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="row mb-4">
                        <div className="col-md-4 d-flex align-items-center">
                          <FaPhone className="me-2" />
                          <p className="mb-0">Téléphone</p>
                        </div>
                        <div className="col-md-8">
                          {isEditing ? (
                            <InputGroup>
                              <FormControl
                                name="telephone"
                                value={formik.values.telephone}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                isInvalid={
                                  formik.touched.telephone &&
                                  formik.errors.telephone
                                }
                              />
                              <Form.Control.Feedback type="invalid">
                                {formik.errors.telephone}
                              </Form.Control.Feedback>
                            </InputGroup>
                          ) : (
                            <div className="d-flex align-items-center">
                              <p className="mb-0 me-2">{telephone}</p>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="row mb-4">
                        <div className="col-md-4 d-flex align-items-center">
                          <FaLock className="me-2" />
                          <p className="mb-0">Mot de passe</p>
                        </div>
                        <div className="col-md-8">
                          {isEditing ? (
                            <div>
                              <InputGroup className="mb-3">
                                <FormControl
                                  type="password"
                                  name="mdpCourant"
                                  placeholder="Mot de passe actuel"
                                  value={formik.values.mdpCourant}
                                  onChange={formik.handleChange}
                                  onBlur={formik.handleBlur}
                                  isInvalid={
                                    formik.touched.mdpCourant &&
                                    formik.errors.mdpCourant
                                  }
                                />
                                <Form.Control.Feedback type="invalid">
                                  {formik.errors.mdpCourant}
                                </Form.Control.Feedback>
                              </InputGroup>
                              <InputGroup className="mb-3">
                                <FormControl
                                  type="password"
                                  name="nouveauMdp"
                                  placeholder="Nouveau mot de passe"
                                  value={formik.values.nouveauMdp}
                                  onChange={formik.handleChange}
                                  onBlur={formik.handleBlur}
                                  isInvalid={
                                    formik.touched.nouveauMdp &&
                                    formik.errors.nouveauMdp
                                  }
                                />
                                <Form.Control.Feedback type="invalid">
                                  {formik.errors.nouveauMdp}
                                </Form.Control.Feedback>
                              </InputGroup>
                              <InputGroup>
                                <FormControl
                                  type="password"
                                  name="confirmerMdp"
                                  placeholder="Confirmer le nouveau mot de passe"
                                  value={formik.values.confirmerMdp}
                                  onChange={formik.handleChange}
                                  onBlur={formik.handleBlur}
                                  isInvalid={
                                    formik.touched.confirmerMdp &&
                                    formik.errors.confirmerMdp
                                  }
                                />
                                <Form.Control.Feedback type="invalid">
                                  {formik.errors.confirmerMdp}
                                </Form.Control.Feedback>
                              </InputGroup>
                            </div>
                          ) : (
                            <div className="d-flex align-items-center">
                              <p className="mb-0 me-2">********</p>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="d-flex justify-content-end">
                        {isEditing ? (
                          <>
                            <Button
                              variant="secondary"
                              className="me-2"
                              onClick={() => setIsEditing(false)}
                            >
                              Annuler
                            </Button>
                            <Button variant="primary" type="submit">
                              Enregistrer
                            </Button>
                          </>
                        ) : (
                          ""
                        )}
                      </div>

                      <hr />
                      <h5>Supprimer mon compte</h5>

                      <button
                        type="button"
                        className="btn btn-danger"
                        onClick={openModal}
                      >
                        Supprimer le compte
                      </button>
                      <Modal show={showModal} onHide={closeModal} centered>
                        <Modal.Header closeButton>
                          <Modal.Title>Supprimer le compte</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                          Êtes-vous sûr de vouloir supprimer votre compte ?
                          Cette action est irréversible.
                          <Form>
                            <Form.Group className="mb-3">
                              <Form.Label>
                                Veuillez entrer votre mot de passe
                              </Form.Label>
                              <Form.Control
                                type="password"
                                name="mdpCourant"
                                placeholder="Mot de passe"
                                value={formik.values.mdpCourant}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                isInvalid={
                                  formik.touched.mdpCourant &&
                                  formik.errors.mdpCourant
                                }
                              />
                              <Form.Control.Feedback type="invalid">
                                {formik.errors.mdpCourant}
                              </Form.Control.Feedback>
                            </Form.Group>
                          </Form>
                        </Modal.Body>
                        <Modal.Footer>
                          <Button variant="secondary" onClick={closeModal}>
                            Annuler
                          </Button>
                          <Button variant="danger" onClick={supprimerCompte}>
                            Supprimer mon compte
                          </Button>
                        </Modal.Footer>
                      </Modal>
                    </div>
                  </Form>
                }
              </Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    </Container>
  );
}

export default ProfilComp;
