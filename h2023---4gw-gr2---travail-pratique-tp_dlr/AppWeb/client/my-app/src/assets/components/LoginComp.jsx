/* react components */
import React from "react";
import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";

/* react components */
import { Form, Button } from "react-bootstrap";

/* input validation (formik/yup) */
import { useFormik } from "formik";
import * as Yup from "yup";

/* toast notifications */
import { toast } from "react-toastify";

/* Context Authentification */
import { AuthContext } from "../../context/auth-context";

function LoginComp() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const formik = useFormik({
    initialValues: {
      email: "",
      mdp: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().required("Ce champ est requis."),
      mdp: Yup.string().required("Ce champ est requis."),
    }),
    onSubmit: async (values) => {
      try {
        const reponse = await login(values);
        //si la reponse a passer les verifications du serveur
        if (reponse.ok) {
          toast.success(reponse.message);
          //on attend 3 seconds avant d'envoyer le user a la page pour montrer la notification
          setTimeout(() => {
            navigate("/");
          }, 3000);
        } else {
          toast.error(reponse.message);
        }
      } catch (err) {
        toast.error("Erreur lors de la connexion");
        console.log(err);
      }
    },
  });
  return (
    <div className="auth-container">
      <div className="auth-comp border w-100 w-md-75 w-lg-50 rounded p-4 p-sm-3">
        <h3 className="d-flex justify-content-center">Connexion</h3>
        <p className="text-center">
          Vous n'avez pas de compte? <Link to="/signup">Inscrivez-vous</Link>
        </p>
        <Form className="form-auth" onSubmit={formik.handleSubmit}>
          <Form.Group className="mb-3" controlId="formGroupEmail">
            <Form.Control
              className={`input-auth ${
                formik.touched.email && formik.errors.email ? "is-invalid" : ""
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
          <div className="d-flex justify-content-center mb-3">
            <Button
              className="btn-auth w-100"
              variant="danger"
              type="submit"
              disabled={
                !formik.isValid || Object.keys(formik.touched).length === 0
              }
            >
              Se connecter
            </Button>
          </div>
          <p>
            <Link to="/forgottenPwd">Mot de passe oublié?</Link>
          </p>
        </Form>
      </div>
    </div>
  );
}
export default LoginComp;
