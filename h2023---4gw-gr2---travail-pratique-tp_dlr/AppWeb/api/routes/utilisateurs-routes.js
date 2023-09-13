import express from "express";
import { check } from "express-validator";
import {
  getUserParId,
  getClientIdParUtilisateurId,
  signup,
  login,
  logout,
  modifierUtilisateur,
  supprimerUtilisateur,
} from "../controllers/utilisateurs-controllers.js";
import CheckAuth from "../middlewares/check-auth.js";

const router = express.Router();

router.get("/:pid", getUserParId);
router.get("/client/:pid", getClientIdParUtilisateurId);
router.post(
  "/signup",
  [
    check("nom").not().isEmpty(),
    check("prenom").not().isEmpty(),
    check("adresse").not().isEmpty(),
    check("telephone").not().isEmpty(),
    check("email").isEmail(),
    check("mdp")
      .isLength({ min: 8, max: 20 })
      .matches(/[a-z]/)
      .matches(/[A-Z]/)
      .matches(/[0-9]/)
      .matches(/[^a-zA-Z0-9]/),
  ],
  signup
);
router.post("/login", login);
router.post("/logout", logout);

//pour proteger les routes suivantes
router.use(CheckAuth);

router.patch(
  "/:pid",
  [check("mdpCourant").not().isEmpty()],
  modifierUtilisateur
);
router.delete(
  "/supprimer",
  [check("mdp").not().isEmpty()],
  supprimerUtilisateur
);

export default router;
