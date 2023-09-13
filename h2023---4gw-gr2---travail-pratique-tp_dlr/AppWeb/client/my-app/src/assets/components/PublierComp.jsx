/* react components */
import { React, useState } from "react";
import { useNavigate } from "react-router-dom";

/* bootstrap components */
import {
  Form,
  FormGroup,
  FormLabel,
  InputGroup,
  Carousel,
  Button,
} from "react-bootstrap";

/* input validation (formik/yup) */
import { useFormik } from "formik";
import * as Yup from "yup";

/* toast notifications */
import { toast } from "react-toastify";

/* Context authentification */
import { useAuthContext } from "../../context/auth-context";

function PublierComp() {
  const { utilisateur } = useAuthContext();

  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      titre: "",
      prix: "",
      marque: "",
      modele: "",
      annee: "",
      kilometrage: "",
      transmission: "",
      type_carrosserie: "",
      type_carburant: "",
      couleur_exterieur: "",
      couleur_interieur: "",
      moteur: "",
      numero_vin: "",
      description: "",
    },
    validationSchema: Yup.object({
      titre: Yup.string().required("Ce champ est requis."),
      prix: Yup.number()
        .typeError("Le prix doit être un chiffre")
        .min(0, "Le prix doit être positive")
        .required("Ce champ est requis"),
      marque: Yup.string().required("Ce champ est requis"),
      modele: Yup.string().required("Ce champ est requis."),
      annee: Yup.number()
        .min(1886, "L'année doit être supérieure ou égale à 1886") //l'annee de l'invention de la premiere voiture: https://group.mercedes-benz.com/company/tradition/company-history/1885-1886.html
        .max(
          new Date().getFullYear(), //https://www.w3schools.com/jsref/jsref_getfullyear.asp
          `L'année ne peut pas être supérieure à ${new Date().getFullYear()}`
        )
        .required("Ce champs est requis"),
      kilometrage: Yup.number()
        .typeError("Le kilométrage doit être un chiffre")
        .positive("Le kilométrage doit être un nombre positif")
        .required("Ce champs est requis"),
    }),
    onSubmit: async (values) => {
      try {
        const formData = new FormData();
        formData.append("titre", values.titre);
        formData.append("marque", values.marque);
        formData.append("modele", values.modele);
        formData.append("annee", parseInt(values.annee));
        formData.append("prix", parseFloat(values.prix));
        uploadedImages.forEach((file, index) => {
          formData.append(`photos_voiture`, file);
        });
        formData.append("kilometrage", parseFloat(values.kilometrage));
        formData.append("transmission", values.transmission);
        formData.append("type_carrosserie", values.type_carrosserie);
        formData.append("type_carburant", values.type_carburant);
        formData.append("couleur_exterieur", values.couleur_exterieur);
        formData.append("couleur_interieur", values.couleur_interieur);
        formData.append("moteur", values.moteur);
        formData.append("numero_vin", values.numero_vin);
        formData.append("description", values.description);
        formData.append("vendeur", utilisateur.userId);

        const response = await fetch(
          "http://localhost:8000/api/publierVoiture",
          {
            method: "POST",
            credentials: "include",
            body: formData,
          }
        );
        if (!response.ok) {
          console.error("Status:", response.status);
          const errorData = await response.json();
          console.error("Error data:", errorData);
          throw new Error("Une erreur est survenue");
        } else {
          navigate("/catalogue");
          toast.success("Votre voiture a été publiée avec succès");
        }
      } catch (error) {
        toast.error(error.message);
      }
    },
  });

  /**
   * Fonction qui retourne l'utilisateur à la page precedante. Utiliséé sur le bouton annuler
   */
  function RetournerEnArriere() {
    navigate(-1);
  }

  const [imageUrls, setImageUrls] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]);
  /**
   * Gère la telechargement des images de voitures en lisant les images recu du evenement avec le fileReader
   * et les stocke dans le state uploadedImages
   * le state imageUrls est utilisé pour afficher les images dans le carousel
   * @param event l'objet evenement qui est declenché lors d'une telechargement
   * d'une image
   */
  function handleImageUpload(event) {
    const files = event.target.files;
    setUploadedImages([...files]);
    const urls = [];
    for (let i = 0; i < files.length; i++) {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(files[i]);
      fileReader.onload = () => {
        urls.push(fileReader.result);
        setImageUrls(urls);
      };
    }
  }
  return (
    <div className="container-fluid pb-5">
      <div className="row justify-content-center">
        <div className="col-sm-12 col-md-10 col-lg-8 bg-white rounded p-4">
          <div className="col-12">
            <h1>Publiez votre véhicule</h1>
          </div>
          <Form onSubmit={formik.handleSubmit}>
            <div className="row">
              <div className="col-md-6 mt-2">
                <div>
                  <FormGroup className="mb-3">
                    <FormLabel>Titre de la publication *</FormLabel>
                    <InputGroup>
                      <Form.Control
                        className={` ${
                          formik.touched.titre && formik.errors.titre
                            ? "is-invalid"
                            : ""
                        }`}
                        type="text"
                        {...formik.getFieldProps("titre")}
                      />
                      {formik.touched.titre && formik.errors.titre ? (
                        <Form.Control.Feedback type="invalid">
                          {formik.errors.titre}
                        </Form.Control.Feedback>
                      ) : null}
                    </InputGroup>
                  </FormGroup>
                  <FormGroup className="mb-3">
                    <FormLabel>Prix *</FormLabel>
                    <InputGroup>
                      <Form.Control
                        className={` ${
                          formik.touched.prix && formik.errors.prix
                            ? "is-invalid"
                            : ""
                        }`}
                        type="number"
                        {...formik.getFieldProps("prix")}
                      />
                      {formik.touched.prix && formik.errors.prix ? (
                        <Form.Control.Feedback type="invalid">
                          {formik.errors.prix}
                        </Form.Control.Feedback>
                      ) : null}
                    </InputGroup>
                  </FormGroup>
                </div>
              </div>
              <div className="col-md-6">
                <div className="image-container mb-3">
                  {imageUrls.length === 0 ? (
                    <div className="text-center">
                      Veuillez télécharger le(s) image(s)
                    </div>
                  ) : (
                    <Carousel
                      interval={null}
                      controls={imageUrls.length > 1}
                      className="publication-carousel"
                    >
                      {imageUrls.map((url) => (
                        <Carousel.Item key={url}>
                          <img
                            src={url}
                            alt="téléchargement"
                            className="img-fluid img-thumbnail w-150"
                          />
                        </Carousel.Item>
                      ))}
                    </Carousel>
                  )}
                </div>
                <div>
                  <FormGroup className="mb-3">
                    <InputGroup>
                      <Form.Control
                        id="file-input"
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                      />
                    </InputGroup>
                  </FormGroup>
                </div>
              </div>
              <hr></hr>
            </div>
            <div className="row">
              <div className="col-md-6">
                <div>
                  <FormGroup className="mb-3">
                    <FormLabel>Marque *</FormLabel>
                    <InputGroup>
                      <Form.Select
                        className={`form-select ${
                          formik.touched.marque && formik.errors.marque
                            ? "is-invalid"
                            : ""
                        }`}
                        {...formik.getFieldProps("marque")}
                      >
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
                      {formik.touched.marque && formik.errors.marque ? (
                        <Form.Control.Feedback type="invalid">
                          {formik.errors.marque}
                        </Form.Control.Feedback>
                      ) : null}
                    </InputGroup>
                  </FormGroup>
                  <div className="row">
                    <FormGroup className="col-md-6 mb-3">
                      <FormLabel>Année *</FormLabel>
                      <InputGroup>
                        <Form.Control
                          maxLength="4"
                          className={` ${
                            formik.touched.annee && formik.errors.annee
                              ? "is-invalid"
                              : ""
                          }`}
                          type="text"
                          {...formik.getFieldProps("annee")}
                        />
                        {formik.touched.annee && formik.errors.annee ? (
                          <Form.Control.Feedback type="invalid">
                            {formik.errors.annee}
                          </Form.Control.Feedback>
                        ) : null}
                      </InputGroup>
                    </FormGroup>
                    <FormGroup className="col-md-6 mb-3">
                      <FormLabel>Kilométrage (km) *</FormLabel>
                      <InputGroup>
                        <Form.Control
                          type="number"
                          min="0"
                          step="100"
                          className={`${
                            formik.touched.kilometrage &&
                            formik.errors.kilometrage
                              ? "is-invalid"
                              : ""
                          }`}
                          {...formik.getFieldProps("kilometrage")}
                        />
                        {formik.touched.kilometrage &&
                        formik.errors.kilometrage ? (
                          <Form.Control.Feedback type="invalid">
                            {formik.errors.kilometrage}
                          </Form.Control.Feedback>
                        ) : null}
                      </InputGroup>
                    </FormGroup>
                  </div>
                  <div className="row">
                    <FormGroup className="col-md-6 mb-3">
                      <FormLabel>Transmission</FormLabel>
                      <InputGroup>
                        <Form.Select {...formik.getFieldProps("transmission")}>
                          <option value=""></option>
                          <option value="Automatique">Automatique</option>
                          <option value="Manuelle">Manuelle</option>
                        </Form.Select>
                      </InputGroup>
                    </FormGroup>
                    <FormGroup className="col-md-6 mb-3">
                      <FormLabel>Moteur</FormLabel>
                      <InputGroup>
                        <Form.Control {...formik.getFieldProps("moteur")} />
                      </InputGroup>
                    </FormGroup>
                  </div>
                  <div className="row">
                    <FormGroup className="col-md-6 mb-3">
                      <FormLabel>Couleur intérieure </FormLabel>
                      <InputGroup>
                        <Form.Control
                          {...formik.getFieldProps("couleur_interieur")}
                        />
                      </InputGroup>
                    </FormGroup>
                    <FormGroup className="col-md-6 mb-3">
                      <FormLabel>Couleur extérieure</FormLabel>
                      <InputGroup>
                        <Form.Control
                          {...formik.getFieldProps("couleur_exterieur")}
                        />
                      </InputGroup>
                    </FormGroup>
                  </div>
                  <div className="row d-flex align-items-center">
                    <FormGroup className="col-md-6 mb-3 d-flex justify-content-center ">
                      <Button
                        variant="danger"
                        type="submit"
                        disabled={
                          !formik.isValid ||
                          Object.keys(formik.touched).length === 0 ||
                          uploadedImages.length === 0
                        }
                      >
                        Publier votre voiture
                      </Button>
                    </FormGroup>
                    <FormGroup className="col-md-6 mb-3 d-flex justify-content-center ">
                      <Button
                        variant="outline-secondary"
                        onClick={RetournerEnArriere}
                      >
                        Annuler
                      </Button>
                    </FormGroup>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div>
                  <FormGroup className="mb-3">
                    <FormLabel>Modèle *</FormLabel>
                    <InputGroup>
                      <Form.Control
                        className={` ${
                          formik.touched.modele && formik.errors.modele
                            ? "is-invalid"
                            : ""
                        }`}
                        type="text"
                        {...formik.getFieldProps("modele")}
                      />
                      {formik.touched.modele && formik.errors.modele ? (
                        <Form.Control.Feedback type="invalid">
                          {formik.errors.modele}
                        </Form.Control.Feedback>
                      ) : null}
                    </InputGroup>
                  </FormGroup>
                  <FormGroup className="mb-3">
                    <FormLabel>Numéro VIN</FormLabel>
                    <InputGroup>
                      <Form.Control {...formik.getFieldProps("numero_vin")} />
                    </InputGroup>
                  </FormGroup>
                  <div className="row">
                    <FormGroup className="col-md-6 mb-3">
                      <FormLabel>Type de carrosserie</FormLabel>
                      <InputGroup>
                        <Form.Select
                          {...formik.getFieldProps("type_carrosserie")}
                        >
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
                    <FormGroup className="col-md-6 mb-3">
                      <FormLabel>Type de carburant</FormLabel>
                      <InputGroup>
                        <Form.Select
                          {...formik.getFieldProps("type_carburant")}
                        >
                          <option value=""></option>
                          <option value="Essence">Essence</option>
                          <option value="Diesel">Diesel</option>
                          <option value="Hybride">Hybride</option>
                          <option value="Électricité">Électricité</option>
                        </Form.Select>
                      </InputGroup>
                    </FormGroup>
                  </div>
                  <div>
                    <FormGroup className="mb-3">
                      <FormLabel>Description:</FormLabel>
                      <InputGroup>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          {...formik.getFieldProps("description")}
                        />
                      </InputGroup>
                    </FormGroup>
                  </div>
                </div>
              </div>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default PublierComp;
