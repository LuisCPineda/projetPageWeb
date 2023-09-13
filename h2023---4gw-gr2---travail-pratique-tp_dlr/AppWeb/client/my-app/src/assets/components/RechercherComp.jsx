import React from "react";
//import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Form,
  FormGroup,
  FormLabel,
  InputGroup,
  Button,
} from "react-bootstrap";
/* input validation (formik/yup) */
import { useFormik } from "formik";



// Image
import NavbarComp from "./NavbarComp";



function RechercheComp() {


  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      marque: "",
      modele: '',
      annee_min:"",
      annee_max: "",
      prix_min: "",
      prix_max: "",
      kilometrage_min:"",
      kilometrage_max: "",
      transmission: "",
      type_carrosserie: "",
      type_carburant: "",
      couleur_exterieur: "",
      couleur_interieur: "",
    },
    onSubmit: async (values) => {
      console.log(formik.values);
      //type_id=1&mot_cle=&ville_nom=&carrosserie_nom%5B%5D=Compact&marque=&marque_nom=Honda&annee_min=&annee_max=&modele=&modele_nom=&prix_min=&prix_max=&budget_min=&budget_max=&frequence=hebdomadaire&terme=12&taxes_incluses=false&distance=50&code_postal=&page=1
      navigate(`/resultatRecherche?marque=${values.marque}&modele=${encodeURI(values.modele)}&annee_min=${encodeURI(formik.values.annee_min)}&annee_max=${encodeURI(formik.values.annee_max)}&prix_min=${formik.values.prix_min}&prix_max=${encodeURI(formik.values.prix_max)}&kilometrage_min=${formik.values.kilometrage_min}&kilometrage_max=${formik.values.kilometrage_max}&transmission=${encodeURI(formik.values.transmission)}&type_carrosserie=${formik.values.type_carrosserie}&type_carburant=${formik.values.type_carburant}&couleur_exterieur=${formik.values.couleur_exterieur}&couleur_interieur=${formik.values.couleur_interieur}`);
    },
  });

  return (
    <div className="header-page-recheche">
      <NavbarComp></NavbarComp>
      <br /><br />
      <div className="row justify-content-center">
        <div className=" background-tableau-recherche col-sm-12 col-md-10 col-lg-8 rounded p-4">
          <Form onSubmit={formik.handleSubmit}>
            <div className="row">
              <div className="col-md-6">
                <br />
                <FormGroup className="mb-3 text-dark fw-bold">
                  <FormLabel>Marque</FormLabel>
                  <InputGroup>
                    <Form.Select
                    id="marque"
                    name="marque"
                    type="text"
                    onChange={formik.handleChange}
                    value={formik.values.marque}>
                      <option value="">-- Choisissez votre marque --</option>
                      <option value="Acura">Acura</option>
                      <option value="Alfa Romeo">Alfa Romeo</option>
                      <option value="Audi">Audi</option>
                      <option value="Bmw">BMW</option>
                      <option value="Cadillac">Cadillac</option>
                      <option value="Chevorlet">Chevorlet</option>
                      <option value="Chrysler">Chrysler</option>
                      <option value="Dodge">Dodge</option>
                      <option value="Ferrari">Ferrari</option>
                      <option value="Fiat">Fiat</option>
                      <option value="Ford">Ford</option>
                      <option value="GMC">GMC</option>
                      <option value="Honda">Honda</option>
                      <option value="Hyundai">Hyundai</option>
                      <option value="Infiniti">Infiniti</option>
                      <option value="Jaguar">Jaguar</option>
                      <option value="Jeep">Jeep</option>
                      <option value="Kia">Kia</option>
                      <option value="Lamborghini">Lamborghini</option>
                      <option value="Land Rover">Land Rover</option>
                      <option value="Lexus">Lexus</option>
                      <option value="Lincoln">Lincoln</option>
                      <option value="Maserati">Maserati</option>
                      <option value="Mazda">Mazda</option>
                      <option value="Mercedes-Benz">Mercedes-Benz</option>
                      <option value="Mini">Mini</option>
                      <option value="Mitsubishi">Mitsubishi</option>
                      <option value="Nissan">Nissan</option>
                      <option value="Porsche">Porsche</option>
                      <option value="Ram">Ram</option>
                      <option value="Rolls-Royce">Rolls-Royce</option>
                      <option value="Subaru">Subaru</option>
                      <option value="Tesla">Tesla</option>
                      <option value="Toyota">Toyota</option>
                      <option value="Volkswagen">Volkswagen</option>
                      <option value="Volvo">Volvo</option>
                    </Form.Select>
                  </InputGroup>
                </FormGroup>
                <FormGroup className="mb-3 text-dark fw-bold">
                <FormLabel>Année</FormLabel>
                  <div className="input-group">
                    <Form.Control
                      type="number"
                      placeholder="Minimum"
                      step="1"
                      min="0"
                      className="form-control rounded"
                      style={{ maxWidth: "200px" }}
                      id="annee_min"
                      name="annee_min"
                      onChange={formik.handleChange}
                      value={formik.values.annee_min}
                    />
                    <div className="input-group-append">

                    </div>
                    <div className="mx-2"></div>
                    <Form.Control
                      type="number"
                      placeholder="Maximum"
                      step="1"
                      min="0"
                      className="form-control rounded"
                      style={{ maxWidth: "200px" }}
                      id="annee_max"
                      name="annee_max"
                      onChange={formik.handleChange}
                      value={formik.values.annee_max}
                    />
                    <div className="input-group-append">
                    </div>
                  </div>
                </FormGroup>
                <FormGroup className="mb-3 text-dark fw-bold">
                  <FormLabel>Transmission</FormLabel>
                  <InputGroup>
                    <Form.Select 
                    id="transmission"
                    name="transmission"
                    type="text"
                    onChange={formik.handleChange}
                    value={formik.values.transmission}>
                      <option value=""></option>
                      <option value="Automatique">Automatique</option>
                      <option value="Manuelle">Manuelle</option>
                    </Form.Select>
                  </InputGroup>
                </FormGroup>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <FormGroup className="text-dark fw-bold">
                      <FormLabel>Type de carrosserie</FormLabel>
                      <InputGroup>
                        <Form.Select 
                        id="type_carrosserie"
                        name="type_carrosserie"
                        type="text"
                        onChange={formik.handleChange}
                        value={formik.values.type_carrosserie}>
                          <option value=""></option>
                          <option value="Berline">Berline</option>
                          <option value="Break">Break</option>
                          <option value="Cabriolet">Cabriolet</option>
                          <option value="Coupé">Coupé</option>
                          <option value="Monospace">Monospace</option>
                          <option value="SUV">SUV</option>
                          <option value="Utilitaire">Utilitaire</option>
                        </Form.Select>
                      </InputGroup>
                    </FormGroup>
                  </div>
                  <div className="col-md-6 mb-3">
                    <FormGroup>
                      <FormLabel className="text-dark fw-bold">Type de carburant</FormLabel>
                      <InputGroup>
                        <Form.Select
                         id="type_carburant"
                         name="type_carburant"
                         type="text"
                         onChange={formik.handleChange}
                         value={formik.values.type_carburant}>
                          <option value=""></option>
                          <option value="Essence">Essence</option>
                          <option value="Diesel">Diesel</option>
                          <option value="Hybride">Hybride</option>
                          <option value="Électricité">Électricité</option>
                        </Form.Select>
                      </InputGroup>
                    </FormGroup>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <br />
                <FormGroup className="mb-3 text-dark fw-bold">
                  <FormLabel>Modèle </FormLabel>
                  <InputGroup>
                    <Form.Control 
                    id="modele"
                    name="modele"
                    type="text"
                    onChange={formik.handleChange}
                    value={formik.values.modele}/>
                  </InputGroup>
                </FormGroup>
                <FormGroup className="mb-3 text-dark fw-bold">
                  <FormLabel>Prix</FormLabel>
                  <div className="input-group">
                    <Form.Control
                      type="number"
                      placeholder="Prix minimum"
                      step="100"
                      min="0"
                      className="form-control rounded-left"
                      style={{ maxWidth: "150px" }}
                      id="prix_min"
                      name="prix_min"
                      onChange={formik.handleChange}
                      value={formik.values.prix_min}
                    />
                    <div className="input-group-append">
                      <span className="input-group-text">$</span>
                    </div>
                    <div className="mx-2"></div>
                    <Form.Control
                      type="number"
                      placeholder="Prix maximum"
                      step="100"
                      min="0"
                      className="form-control rounded-right"
                      style={{ maxWidth: "150px" }}
                      id="prix_max"
                      name="prix_max"
                      onChange={formik.handleChange}
                      value={formik.values.prix_max}
                    />
                    <div className="input-group-append">
                      <span className="input-group-text">$</span>
                    </div>
                  </div>
                </FormGroup>
                <FormGroup className="mb-3 text-dark fw-bold">
                  <FormLabel>Kilometrage</FormLabel>
                  <div className="input-group">
                    <Form.Control
                      type="number"
                      placeholder="Minimum"
                      step="100"
                      min="0"
                      className="form-control rounded"
                      style={{ maxWidth: "200px" }}
                      id="kilometrage_min"
                      name="kilometrage_min"
                      onChange={formik.handleChange}
                      value={formik.values.kilometrage_min}
                    />
                    <div className="input-group-append">

                    </div>
                    <div className="mx-2"></div>
                    <Form.Control
                      type="number"
                      placeholder="Maximum"
                      step="100"
                      min="0"
                      className="form-control rounded"
                      style={{ maxWidth: "200px" }}
                      id="kilometrage_max"
                      name="kilometrage_max"
                      onChange={formik.handleChange}
                      value={formik.values.kilometrage_max}
                    />
                    <div className="input-group-append">
                    </div>
                  </div>
                </FormGroup>
                <div className="row">
                  <div className="col-md-6">
                    <FormGroup className="mb-3 text-dark fw-bold">
                      <FormLabel>Couleur extérieure</FormLabel>
                      <InputGroup >
                        <Form.Select 
                        id="couleur_exterieur"
                        name="couleur_exterieur"
                        type="text"
                        onChange={formik.handleChange}
                        value={formik.values.couleur_exterieur}>
                          <option value=""></option>
                          <option value="beige">Beige</option>
                          <option value="rouge">Rouge</option>
                          <option value="bleu">Bleu</option>
                          <option value="vert">Vert</option>
                          <option value="jaune">Jaune</option>
                          <option value="noir">Noir</option>
                          <option value="blanc">Blanc</option>
                          <option value="gris">Gris</option>
                          <option value="orange">Orange</option>
                          <option value="violet">Violet</option>
                        </Form.Select>
                      </InputGroup>
                    </FormGroup>
                  </div>
                  <div className="col-md-6">
                    <FormGroup className="mb-3 text-dark fw-bold">
                      <FormLabel>Couleur intérieure</FormLabel>
                      <InputGroup>
                        <Form.Select 
                         id="couleur_interieur"
                         name="couleur_interieur"
                         type="text"
                         onChange={formik.handleChange}
                         value={formik.values.couleur_interieur}>
                          <option value=""></option>
                          <option value="beige">Beige</option>
                          <option value="rouge">Rouge</option>
                          <option value="bleu">Bleu</option>
                          <option value="vert">Vert</option>
                          <option value="jaune">Jaune</option>
                          <option value="noir">Noir</option>
                          <option value="blanc">Blanc</option>
                          <option value="gris">Gris</option>
                          <option value="orange">Orange</option>
                          <option value="violet">Violet</option>
                        </Form.Select>
                      </InputGroup>
                    </FormGroup>
                  </div>
                </div>
              </div>
            </div>
            <br />
            <div className="d-flex justify-content-center">
              <Button className="fw-bold" variant="danger" type="submit">
                Rechercher votre véhicule
              </Button>
            </div>
          </Form>
          <div className="col-12"></div>

        </div>
      </div>
    </div>
  );
}

export default RechercheComp;