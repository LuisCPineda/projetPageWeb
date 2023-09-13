/* react components */
import React from "react";
import { Link, useNavigate } from "react-router-dom";

/* react icons */
import { FaCheck } from "react-icons/fa";

/* bootstrap components */
import { Form, Button } from "react-bootstrap";

/* input validation (formik/yup) */
import { useFormik } from "formik";
import * as Yup from "yup";

/* toast notifications */
import { toast } from "react-toastify";

function SignupComp() {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      prenom: "",
      nom: "",
      adresse: "",
      telephone: "",
      email: "",
      mdp: "",
      mdpConfirmer: "",
      accepterTermes: false,
    },
    validationSchema: Yup.object({
      prenom: Yup.string().required("Ce champ est requis."),
      nom: Yup.string().required("Ce champ est requis."),
      adresse: Yup.string().required("Ce champ est requis."),
      telephone: Yup.string()
        .max(
          10,
          "Le numéro de téléphone ne peut pas comporter plus de 10 chiffres."
        )
        .matches(/^\d+$/, "Veuillez entrer un numéro de téléphone valide.")
        .required("Ce champ est requis."),
      email: Yup.string()
        .email("Veuillez entrer un courriel valide.")
        .required("Ce champ est requis."),
      mdp: Yup.string()
        .min(8, "Le mot de passe doit comporter au moins 8 caractères.")
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
        .max(20, "Le mot de passe ne peut pas comporter plus de 20 caractères.")
        .required("Ce champ est requis."),
      mdpConfirmer: Yup.string()
        .oneOf(
          [Yup.ref("mdp"), null],
          "Les mots de passe doivent correspondre."
        )
        .required("Ce champ est requis."),
      accepterTermes: Yup.boolean().oneOf(
        [true],
        "Vous devez accepeter les termes et conditions avant de continuer"
      ),
    }),
    onSubmit: async (values) => {
      try {
        const reponse = await fetch("http://localhost:8000/user/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
          credentials: "include", //pour que le cookie soit envoyé avec la requête
        });

        const reponseData = await reponse.json();
        //si la reponse a passer les verifications du serveurs
        if (reponse.ok) {
          toast.success(reponseData.message);
          //on attend 3 seconds avant d'envoyer le user a la page pour montrer la notification
          setTimeout(() => {
            navigate("/login");
          }, 3000);
        } else {
          toast.error(reponseData.message);
        }
      } catch (err) {
        toast.error(err.message);
        console.log(err);
      }
    },
  });

  return (
    <div className="auth-container">
      <div className="auth-comp border rounded p-4 p-sm-3 d-flex flex-column flex-md-row">
        <div className="col-md-6 mb-3 mb-md-0">
          <h3 className="text-center">Inscription</h3>
          <p className="text-center">
            Vous avez déjà un compte? <Link to="/login">Connectez-vous</Link>
          </p>
          <Form className="form-auth" onSubmit={formik.handleSubmit}>
            <Form.Group className="mb-3" controlId="formGroupPrenom">
              <Form.Control
                className={`input-auth ${
                  formik.touched.prenom && formik.errors.prenom
                    ? "is-invalid"
                    : ""
                }`}
                type="text"
                placeholder="Prenom"
                {...formik.getFieldProps("prenom")}
              />
              {formik.touched.prenom && formik.errors.prenom ? (
                <Form.Control.Feedback type="invalid">
                  {formik.errors.prenom}
                </Form.Control.Feedback>
              ) : null}
            </Form.Group>
            <Form.Group className="mb-3" controlId="formGroupNom">
              <Form.Control
                className={`input-auth ${
                  formik.touched.nom && formik.errors.nom ? "is-invalid" : ""
                }`}
                type="text"
                placeholder="Nom"
                {...formik.getFieldProps("nom")}
              />
              {formik.touched.nom && formik.errors.nom ? (
                <Form.Control.Feedback type="invalid">
                  {formik.errors.nom}
                </Form.Control.Feedback>
              ) : null}
            </Form.Group>
            <Form.Group className="mb-3" controlId="formGroupAdresse">
              <Form.Control
                className={`input-auth ${
                  formik.touched.adresse && formik.errors.adresse
                    ? "is-invalid"
                    : ""
                }`}
                type="text"
                placeholder="Adresse"
                {...formik.getFieldProps("adresse")}
              />
              {formik.touched.adresse && formik.errors.adresse ? (
                <Form.Control.Feedback type="invalid">
                  {formik.errors.adresse}
                </Form.Control.Feedback>
              ) : null}
            </Form.Group>
            <Form.Group className="mb-3" controlId="formGroupTelephone">
              <Form.Control
                className={`input-auth ${
                  formik.touched.telephone && formik.errors.telephone
                    ? "is-invalid"
                    : ""
                }`}
                type="tel"
                placeholder="Téléphone"
                {...formik.getFieldProps("telephone")}
              />
              {formik.touched.telephone && formik.errors.telephone ? (
                <Form.Control.Feedback type="invalid">
                  {formik.errors.telephone}
                </Form.Control.Feedback>
              ) : null}
            </Form.Group>
            <Form.Group className="mb-3" controlId="formGroupEmail">
              <Form.Control
                className={`input-auth ${
                  formik.touched.email && formik.errors.email
                    ? "is-invalid"
                    : ""
                }`}
                type="email"
                placeholder="Courriel"
                {...formik.getFieldProps("email")}
              />
              {formik.touched.email && formik.errors.email ? (
                <Form.Control.Feedback type="invalid">
                  {formik.errors.email}
                </Form.Control.Feedback>
              ) : null}
            </Form.Group>
            <Form.Group className="mb-3" controlId="formGroupMdp">
              <Form.Control
                className={`input-auth ${
                  formik.touched.mdp && formik.errors.mdp ? "is-invalid" : ""
                }`}
                type="password"
                placeholder="Mot de passe"
                {...formik.getFieldProps("mdp")}
              />
              {formik.touched.mdp && formik.errors.mdp ? (
                <Form.Control.Feedback type="invalid">
                  {formik.errors.mdp}
                </Form.Control.Feedback>
              ) : null}
            </Form.Group>
            <Form.Group className="mb-3" controlId="formGroupMdpConfirmer">
              <Form.Control
                className={`input-auth ${
                  formik.touched.mdpConfirmer && formik.errors.mdpConfirmer
                    ? "is-invalid"
                    : ""
                }`}
                type="password"
                placeholder="Confirmez votre mot de passe"
                {...formik.getFieldProps("mdpConfirmer")}
              />
              {formik.touched.mdpConfirmer && formik.errors.mdpConfirmer ? (
                <Form.Control.Feedback type="invalid">
                  {formik.errors.mdpConfirmer}
                </Form.Control.Feedback>
              ) : null}
            </Form.Group>
            <Form.Group
              controlId="formGroupTermesEtConditions"
              className="d-flex align-items-center"
            >
              <Form.Check
                className="me-1 small"
                type="checkbox"
                label="J'accepte"
                {...formik.getFieldProps("accepterTermes")}
              />
              <Link
                to="/termes-conditions"
                className="termes-conditions small align-self-center"
              >
                les termes et conditions
              </Link>
            </Form.Group>
            <div className="d-flex justify-content-center mb-3">
              <Button
                className="btn-auth w-100"
                variant="danger"
                type="submit"
                disabled={
                  !formik.isValid || Object.keys(formik.touched).length === 0
                }
              >
                S'inscrire
              </Button>
            </div>
          </Form>
        </div>
        <div className="col-md-6 d-flex justify-content-center align-items-center">
          <div>
            <h5 className="text-center mb-4">Pourquoi s'inscrire ?</h5>
            <ul className="list-unstyled">
              <li>
                <FaCheck className="signup-check-icon" />
                Lorem ipsum dolor sit amet.
              </li>
              <li>
                <FaCheck className="signup-check-icon" />
                Lorem ipsum dolor sit amet.
              </li>
              <li>
                <FaCheck className="signup-check-icon" />
                Lorem ipsum dolor sit amet.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
export default SignupComp;
