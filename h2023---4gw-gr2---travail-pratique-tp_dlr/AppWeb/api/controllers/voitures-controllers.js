import fs from "fs";

import { validationResult } from "express-validator";

import Voiture from "../models/voiture.js";

import { getPool } from "../dataBases/mysqldb.js";

import logger from "../logger/logger.js";

/**
 *
 * Récupération d'une voiture par son identifiant (ID).
 *
 * @param {Object} req - L'objet requête (request) provenant du client.
 * @param {Object} res - L'objet réponse (response) à envoyer au client.
 * @param {Function} next - La fonction next pour passer au middleware suivant.
 * @returns {Promise<void>} - Renvoie une réponse JSON contenant les informations de la voiture trouvée.
 */
export const getVoitureParId = async (req, res, next) => {
  const voitureId = req.params.pid;
  let voiture;

  logger.info(`Récupérer d'une voiture par son id: ${voitureId}`);

  try {
    voiture = await Voiture.findById(voitureId);
  } catch (err) {
    const error = new Error(
      "Opps, il y a eu un problème, on peut pas trouver cette voiture"
    );
    error.status = 500;
    logger.error(`Erreur dans la récupération de la voiture - ${err.message}`);
    return next(error);
  }
  if (!voiture) {
    const error = new Error("On peut pas trouver une voiture avec cet id");
    error.status = 404;
    logger.warn(`Voiture pas trouvée avec son ID: ${voitureId}`);
    return next(error);
  }

  logger.info(`Voiture trouvée - ${voitureId}`);
  res.json(voiture);
};

/**
 * Récupération des voitures par marque.
 *
 * @param {Object} req - L'objet requête (request) provenant du client.
 * @param {Object} res - L'objet réponse (response) à envoyer au client.
 * @returns {Promise<void>} - Renvoie une réponse JSON contenant les voitures correspondant à la marque recherchée.
 */
export const getVoitureParMarque = async (req, res) => {
  const marqueParams = req.params.marque;

  logger.info(
    `Récupération d'une/des voiture(s) par sa/leur marque: ${marqueParams}`
  );

  try {
    const voitures = await Voiture.find({ marque: marqueParams });
    logger.info(`Voitures trouvées: ${JSON.stringify(voitures)}`);
    res.json({ voitures });
  } catch (err) {
    logger.error(
      `Erreur dans le get d'une/les voitures par sa/leur marque: ${marqueParams} - ${err.message}`
    );
    res.status(500).json({
      message: "Opps, il y a eu un problème, on peut pas trouver cette marque",
    });
  }
};

/**
 * Récupération de toutes les voitures.
 *
 * @param {Object} req - L'objet requête (request) provenant du client.
 * @param {Object} res - L'objet réponse (response) à envoyer au client.
 * @returns {Promise<void>} - Renvoie une réponse JSON contenant la liste de toutes les voitures.
 */
export const getVoitures = async (req, res) => {
  logger.info(`Get toutes les voitures`);
  try {
    const voitures = await Voiture.find();
    logger.info(`Nombres de voitures trouvées: ${voitures.length}`);
    res.json(voitures);
  } catch (err) {
    logger.error(`Erreur dans le get de toutes les voitures - ${err.message}`);
    res.status(500).json({
      message:
        "Opps, il y a eu un problème dans la recherche, svp essayez plus tard",
    });
  }
};

/**
 * Création d'une nouvelle voiture.
 *
 * @param {Object} req - L'objet requête (request) provenant du client.
 * @param {Object} res - L'objet réponse (response) à envoyer au client.
 * @param {Function} next - La fonction next pour passer au middleware suivant.
 * @returns {Promise<void>} - Renvoie une réponse JSON contenant les informations de la nouvelle voiture créée.
 */
export const creerVoiture = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.error(`Erreurs de validation : ${JSON.stringify(errors.array())}`);
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    titre,
    marque,
    modele,
    annee,
    prix,
    kilometrage,
    transmission,
    type_carrosserie,
    type_carburant,
    couleur_exterieur,
    couleur_interieur,
    moteur,
    numero_vin,
    description,
  } = req.body;

  const nouvelleVoiture = new Voiture({
    titre,
    marque,
    modele,
    annee,
    prix,
    photos_voiture: req.files.map((file) => file.path),
    kilometrage,
    transmission,
    type_carrosserie,
    type_carburant,
    couleur_exterieur,
    couleur_interieur,
    moteur,
    numero_vin,
    description,
    vendeur: req.userData.userId,
  });

  logger.info(
    `Création d'une nouvelle voiture: ${JSON.stringify(nouvelleVoiture)}`
  );

  let utilisateur;
  let pool = getPool();

  try {
    const requete = "SELECT * FROM utilisateur WHERE id_utilisateur = ?";

    utilisateur = await new Promise((resolve, reject) => {
      pool.query(requete, [req.userData.userId], (err, result) => {
        if (err) {
          logger.error(
            `Erreur dans la recherche de l'utilisateur: ${req.userData.userId} - ${err}`
          );
          reject(err);
        }
        resolve(result);
      });
    });

    if (utilisateur.length === 0) {
      const error = new Error("Utilisateur introuvable");
      error.status = 404;
      logger.warn(`L'utilisateur n'existe pas: ${req.userData.userId}`);
      return next(error);
    }

    utilisateur = utilisateur[0];
    logger.info(`L'utilisateur est trouvé: ${utilisateur}`);
  } catch (err) {
    logger.error(
      `Erreur dans la recherche de l'utilisateur: ${req.userData.userId} - ${err}`
    );
    const error = new Error(
      "La publication a echoué, veuillez essayer plus tard"
    );
    error.status = 500;
    return next(error);
  }

  try {
    const voitureSauvegardee = await nouvelleVoiture.save();
    const requeteInsertion =
      "INSERT INTO utilisateur_voiture (id_utilisateur, id_voiture) VALUES (?, ?)";
    await new Promise((resolve, reject) => {
      pool.query(
        requeteInsertion,
        [utilisateur.id_utilisateur, voitureSauvegardee._id.toString()],
        (err, results) => {
          if (err) {
            logger.error(`Erreur lors de la requête: ${err}`);
            reject(err);
          } else {
            resolve(results);
          }
        }
      );
    });

    logger.info(
      `La nouvelle voiture: ${JSON.stringify(
        nouvelleVoiture
      )} et l'utilisateur ${JSON.stringify(utilisateur)} sont sauvegardés`
    );
  } catch (err) {
    logger.error(
      `Erreur dans la sauvergarde de la nouvelle voiture: ${JSON.stringify(
        nouvelleVoiture
      )} et la sauvegarde de l'utilisateur mis-à-jour: ${JSON.stringify(
        utilisateur
      )} - ${err.message}`
    );
    const error = new Error(
      "La publication a echoué, veuillez essayer plus tard"
    );
    error.status = 500;
    return next(error);
  }
  res.status(201).json({ voiture: nouvelleVoiture });
};

/**
 * Modification des informations d'une voiture, on peut seuelemnt modifier le titre, le prix et la description.
 *
 * @param {Object} req - L'objet requête (request) provenant du client.
 * @param {Object} res - L'objet réponse (response) à envoyer au client.
 * @param {Function} next - La fonction next pour passer au middleware suivant.
 * @returns {Promise<void>} - Renvoie une réponse JSON contenant les informations de la voiture modifiée.
 */
export const modifierVoiture = async (req, res, next) => {
  const { titre, prix, description } = req.body;
  const voitureId = req.params.pid;

  logger.info(`Modifier une voiture par son id: ${voitureId}`);

  let voiture;
  try {
    voiture = await Voiture.findById(voitureId);
    logger.info(`La voiture est trouvée: ${voiture}`);
  } catch (err) {
    const error = new Error(
      "Un problème est survenu, la modification a echoué"
    );
    error.status = 500;
    logger.error(`Erreur dans la recherche de la voiture - ${err.message}`);
    return next(error);
  }
  if (voiture.vendeur !== req.userData.userId) {
    const error = new Error(
      "Vous n'êtes pas autorisé à modifier cette voiture"
    );
    error.status = 401;
    logger.warn(
      `L'utilisateur ${req.userData.userId} n'est pas autorisé à modifier la voiture - ${err.message} `
    );
    return next(error);
  }

  if (titre) {
    voiture.titre = titre;
    logger.info(`Le titre de la voiture est modifié: ${voiture.titre}`);
  }
  if (prix) {
    voiture.prix = prix;
    logger.info(`Le prix de la voiture est modifié: ${voiture.prix}`);
  }
  if (description) {
    voiture.description = description;
    logger.info(
      `La description de la voiture est modifiée: ${voiture.description}`
    );
  }

  try {
    await voiture.save();
    logger.info(`La voiture est sauvegardée: ${voiture}`);
  } catch (err) {
    const error = new Error(
      "Un problème est survenu, la modification a echoué"
    );
    error.status = 500;
    logger.error(
      `Erreur dans la sauvegarde de la voiture: ${voiture} - ${err.message}`
    );
    return next(error);
  }

  res.status(200).json({ voiture: voiture.toObject });
};

/**
 * Suppression d'une voiture.
 *
 * @param {Object} req - L'objet requête (request) provenant du client.
 * @param {Object} res - L'objet réponse (response) à envoyer au client.
 * @param {Function} next - La fonction next pour passer au middleware suivant.
 * @returns {Promise<void>} - Renvoie une réponse JSON avec un message confirmant la suppression de la voiture.
 */
export const supprimerVoiture = async (req, res, next) => {
  const voitureId = req.params.pid;
  logger.info(`Supprimer une voiture par son id: ${voitureId}`);

  let voiture;
  try {
    voiture = await Voiture.findById(voitureId);
    logger.info(`La voiture est trouvée: ${voiture}`);
  } catch (err) {
    const error = new Error("Un problème est survenu, la suppression a echoué");
    error.status = 500;
    logger.error(`Erreur dans la recherche de la voiture: ${err.message}`);
    return next(error);
  }

  if (!voiture) {
    const error = new Error("Voiture introuvable");
    error.status = 404;
    logger.warn(`La voiture n'existe pas: ${voitureId}`);
    return next(error);
  }

  if (voiture.vendeur !== req.userData.userId) {
    const error = new Error(
      "Vous n'êtes pas autorisé à supprimer cette voiture"
    );
    error.status = 401;
    logger.warn(
      `L'utilisateur ${req.userData.userId} n'est pas autorisé à supprimer la voiture ${voitureId}}`
    );
    return next(error);
  }

  const imagePath = voiture.photos_voiture;

  try {
    await voiture.remove();
    logger.info(`La voiture est supprimée: ${voitureId}`);
  } catch (err) {
    const error = new Error("Un problème est survenu, la suppression a echoué");
    error.status = 500;
    logger.error(`Erreur dans la suppression de la voiture: ${err.message}`);
    return next(error);
  }

  logger.info(`Supprimer l'image de la voiture: ${voitureId}`);
  imagePath.forEach((path) => {
    fs.unlink(path, (err) => {
      if (err) {
        logger.error(`Erreur dans la suppression de l'image: ${err}`);
      } else {
        logger.info(`L'image est supprimée: ${path}`);
      }
    });
  });

  res.status(200).json({ message: "Voiture supprimée" });
};

/**
 * Récupération de toutes les voitures associées à un utilisateur.
 *
 * @param {Object} req - L'objet requête (request) provenant du client.
 * @param {Object} res - L'objet réponse (response) à envoyer au client.
 * @param {Function} next - La fonction next pour passer au middleware suivant.
 * @returns {Promise<void>} - Renvoie une réponse JSON contenant un tableau des voitures associées à l'utilisateur.
 */
export const getVoituresParUtilisateurId = async (req, res, next) => {
  const utilisateurId = req.params.uid;
  logger.info(`Recherche des voitures par l'utilisateur: ${utilisateurId}`);

  let utilisateurAvecVoitures;
  try {
    const requete =
      "Select id_voiture FROM utilisateur_voiture WHERE id_utilisateur = ?";
    let pool = getPool();

    utilisateurAvecVoitures = await new Promise((resolve, reject) => {
      pool.query(requete, [utilisateurId], (err, result) => {
        if (err) {
          logger.error(`Erreur dans la recherche de l'utilisateur: ${err}`);
          reject(err);
        }
        resolve(result);
      });
    });
    logger.info(`L'utilisateur est trouvé: ${utilisateurAvecVoitures}`);
  } catch (err) {
    const error = new Error("Un problème est survenu, svp ressayez plutard");
    error.status = 500;
    logger.error(`Erreur dans la recherche de l'utilisateur: ${err.message}`);
    return next(error);
  }

  if (!utilisateurAvecVoitures || utilisateurAvecVoitures.length === 0) {
    const error = new Error("Aucune voiture trouvée pour cet utilisateur", 404);
    logger.warn(
      `Aucune voiture trouvée pour cet utilisateur: ${utilisateurId}`
    );
    return next(error);
  }

  try {
    const voitures = await Promise.all(
      utilisateurAvecVoitures.map(async (voitureId) => {
        const voiture = await Voiture.findById(voitureId.id_voiture);
        return voiture.toObject({ getters: true });
      })
    );

    logger.info(
      `Les voitures associés à l'utilisateur: ${JSON.stringify(voitures)}`
    );

    res.status(200).json({ voitures: voitures });
  } catch (err) {
    const error = new Error("Un problème est survenu, svp ressayez plutard");
    error.status = 500;
    logger.error(`Erreur dans la recherche des voitures: ${err.message}`);
    return next(error);
  }
};

export const getVoiturePourRecherche = async (req, res) => {
  const {
    marque,
    modele,
    annee_min,
    annee_max,
    prix_min,
    prix_max,
    kilometrage_min,
    kilometrage_max,
    transmission,
    type_carrosserie,
    type_carburant,
    couleur_exterieur,
    couleur_interieur,
  } = req.query;

  logger.info(`Recherche des voitures par les critères: ${req.query}`);

  let query = {};
  try {
    if (marque) {
      query.marque = new RegExp(marque, "i");
    }
    if (modele) {
      query.modele = new RegExp(modele, "i");
    }
    if (annee_min || annee_max) {
      query.annee = query.annee || {};
      if (annee_min) {
        query.annee.$gte = annee_min;
      }
      if (annee_max) {
        query.annee.$lte = annee_max;
      }
    }
    if (prix_min || prix_max) {
      query.prix = query.prix || {};
      if (prix_min) {
        query.prix.$gte = prix_min;
      }
      if (prix_max) {
        query.prix.$lte = prix_max;
      }
    }
    if (kilometrage_min || kilometrage_max) {
      query.kilometrage = query.kilometrage || {};
      if (kilometrage_min) {
        query.kilometrage.$gte = kilometrage_min;
      }
      if (kilometrage_max) {
        query.kilometrage.$lte = kilometrage_max;
      }
    }
    if (transmission) {
      query.transmission = new RegExp(transmission, "i");
    }
    if (type_carrosserie) {
      query.type_carrosserie = new RegExp(type_carrosserie, "i");
    }
    if (type_carburant) {
      query.type_carburant = new RegExp(type_carburant, "i");
    }
    if (couleur_exterieur) {
      query.couleur_exterieur = new RegExp(couleur_exterieur, "i");
    }
    if (couleur_interieur) {
      query.couleur_interieur = new RegExp(couleur_interieur, "i");
    }
    const voitures = await Voiture.find(query).exec();
    logger.info(
      `Les critères de recherche: ${JSON.stringify(query)}, ont trouvé ${
        voitures.length
      } results: ${JSON.stringify(voitures)}`
    );
    res.json({ voitures, message: "Voici le résultat de votre recherche" });
  } catch (err) {
    logger.error(`Erreur dans la recherche de la voiture: ${err.message}`);
    res.status(500).json({
      message: "Opps, il y a eu un problème,Essayez plus tard",
    });
  }
};
