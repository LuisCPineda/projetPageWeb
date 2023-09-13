import express from "express";

import { check } from "express-validator";

import checkUploads from "../middlewares/check-uploads.js";

import { telechargerImages } from "../middlewares/upload-images.js";
import {
  getVoitureParId,
  getVoitureParMarque,
  getVoitures,
  creerVoiture,
  modifierVoiture,
  supprimerVoiture,
  getVoituresParUtilisateurId,
  getVoiturePourRecherche,
} from "../controllers/voitures-controllers.js";
import CheckAuth from "../middlewares/check-auth.js";

const anneeCourante = new Date().getFullYear();

const router = express.Router();

router.get("/voiture/:pid", getVoitureParId);
router.get("/recherche/:marque", getVoitureParMarque);
router.get("/catalogue", getVoitures);
router.get("/user/:uid", getVoituresParUtilisateurId);
router.get("/resultatRecherche", getVoiturePourRecherche);

//pour proteger les routes suivantes
router.use(CheckAuth);

router.post(
  "/publierVoiture",
  telechargerImages,
  checkUploads, // middleware qui verifie si les fichiers sont téléchargés
  [
    check("titre", "Le titre est requis").notEmpty(),
    check("marque", "La marque est requise").notEmpty(),
    check("modele", "Le modele est requis").notEmpty(),
    check("prix", "Le prix est requis et doit être un nombre").isInt({
      min: 0,
    }),
    check(
      "annee",
      `L'année est requise, doit être un nombre et doit être entre 1886 et ${anneeCourante}`
    ).isInt({
      min: 1886,
      max: anneeCourante,
    }),
    check(
      "kilometrage",
      "Le kilometrage est requis et doit être un nombre"
    ).isInt({ min: 0 }),
  ],
  creerVoiture
);
router.patch("/:pid", modifierVoiture);
router.delete("/:pid", supprimerVoiture);

export default router;
