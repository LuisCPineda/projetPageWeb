import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";

import { envoyerCourriel } from "../middlewares/mailer.js";
import { getPool } from "../dataBases/mysqldb.js";
import logger from "../logger/logger.js";
import Voiture from "../models/voiture.js";

/**
 * Récupère un utilisateur en fonction de son ID.
 *
 * @param {Object} req - L'objet requête (request) provenant du client.
 * @param {Object} res - L'objet réponse (response) à envoyer au client.
 * @param {Function} next - La fonction next pour passer au middleware suivant.
 * @returns {Promise<void>} - Renvoie une réponse JSON contenant les informations de l'utilisateur.
 */
export const getUserParId = async (req, res, next) => {
  const utilisateurId = req.params.pid;
  let requete = "SELECT * FROM utilisateur WHERE id_utilisateur = ?";
  let pool = getPool();
  logger.info(`Recherche de l'utilisateur avec l'ID: ${utilisateurId}`);
  try {
    const utilisateur = await new Promise((resolve, reject) => {
      pool.query(requete, [utilisateurId], (err, results) => {
        if (err) {
          logger.error(`Erreur lors de la requête: ${err}`);
          reject(err);
        } else {
          resolve(results);
        }
      });
    });

    if (!utilisateur || utilisateur.length === 0) {
      const error = new Error(
        "On ne peut pas trouver un utilisateur avec cet id"
      );
      error.status = 404;
      logger.error(`Utilisateur avec l'ID: ${utilisateurId} non trouvé`);
      return next(error);
    }
    logger.info(`Utilisateur trouvé: ${utilisateur[0].id_utilisateur}`);
    res.json(utilisateur[0]);
  } catch {
    const error = new Error(
      "Opps, il y a eu un problème, on ne peut pas trouver cet utilisateur"
    );
    error.status = 500;
    logger.error(
      `Erreur lors de la recherche de l'utilisateur avec l'ID: ${utilisateurId}`
    );
    return next(error);
  }
};

/**
 * Récupère un client en fonction de l'ID de son utilisateur associé.
 *
 * @param {Object} req - L'objet requête (request) provenant du client.
 * @param {Object} res - L'objet réponse (response) à envoyer au client.
 * @param {Function} next - La fonction next pour passer au middleware suivant.
 * @returns {Promise<void>} - Renvoie une réponse JSON contenant les informations du client.
 */

export const getClientIdParUtilisateurId = async (req, res, next) => {
  const utilisateurId = req.params.pid;
  let requete = "SELECT * FROM client WHERE utilisateur_id_utilisateur = ?";
  let pool = getPool();
  logger.info(
    `Recherche du client avec l'ID de l'utilisateur: ${utilisateurId}`
  );
  try {
    const client = await new Promise((resolve, reject) => {
      pool.query(requete, [utilisateurId], (err, results) => {
        if (err) {
          logger.error(`Erreur lors de la requête: ${err}`);
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
    if (!client || client.length === 0) {
      const error = new Error("On ne peut pas trouver un client avec cet id");
      error.status = 404;
      logger.error(`Client avec l'ID utilisateur: ${utilisateurId} non trouvé`);
      return next(error);
    }
    logger.info(`Client trouvé: ${client[0]}`);
    res.json(client[0]);
  } catch {
    const error = new Error(
      "Opps, il y a eu un problème, on ne peut pas trouver ce client"
    );
    error.status = 500;
    logger.error(
      `Erreur lors de la recherche du client avec l'ID utilisateur: ${utilisateurId}`
    );
    return next(error);
  }
};

/**
 * Inscription d'un nouvel utilisateur et création d'un nouveau compte client.
 *
 * @param {Object} req - L'objet requête (request) provenant du client.
 * @param {Object} res - L'objet réponse (response) à envoyer au client.
 * @returns {Promise<void>} - Renvoie une réponse JSON contenant les informations du nouveau compte créé.
 */
export const signup = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { prenom, nom, adresse, telephone, email, mdp } = req.body;
  const requete = "SELECT * FROM utilisateur WHERE courriel = ?";
  let pool = getPool();

  logger.info(`Inscription de l'utilisateur avec l'email: ${email}`);

  pool.getConnection((err, connection) => {
    if (err) {
      logger.error(`Erreur lors de la récupération de la connexion: ${err}`);
      return res
        .status(500)
        .json({ message: "Erreur lors de la récupération de la connexion" });
    }

    // Démarrer la transaction
    connection.beginTransaction((err) => {
      if (err) {
        connection.release();
        logger.error(`Erreur lors du démarrage de la transaction: ${err}`);
        return res
          .status(500)
          .json({ message: "Erreur lors du démarrage de la transaction" });
      }

      // Recherche de l'utilisateur
      connection.query(requete, [email], (err, utilisateur) => {
        if (err) {
          logger.error(`Erreur lors de la requête: ${err}`);
          return connection.rollback(() =>
            res.status(500).json({ message: "Votre inscription a echoué" })
          );
        }

        // Vérifier si l'utilisateur existe déjà
        if (utilisateur.length) {
          logger.warn(`Utilisateur existe avec l'email: ${email} `);
          return res
            .status(409)
            .json({ message: "L'utilisateur existe déjà!" });
        }

        //crypter et hasher le mot de passe
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(mdp, salt);

        const requeteUtilisateur =
          "INSERT INTO utilisateur(`type_utilisateur`,`courriel`,`mot_de_passe`) VALUES ('user', ?, ?)";
        const valuesUtilisateur = [email, hash];

        connection.query(
          requeteUtilisateur,
          valuesUtilisateur,
          (err, results) => {
            if (err) {
              logger.error(`Erreur lors de la requête: ${err}`);
              return connection.rollback(() =>
                res.status(500).json({ message: "Votre inscription a echoué" })
              );
            }

            connection.query(requete, [email], (err, utilisateurId) => {
              if (err) {
                logger.error(`Erreur lors de la requête: ${err}`);
                return connection.rollback(() =>
                  res
                    .status(500)
                    .json({ message: "Votre inscription a echoué" })
                );
              }

              const requeteClient =
                "INSERT INTO client(`prenom`,`nom`,`adresse`,`telephone`,`utilisateur_id_utilisateur`) VALUES (?, ?, ?, ?, ?)";
              const valuesClient = [
                prenom,
                nom,
                adresse,
                telephone,
                utilisateurId[0].id_utilisateur,
              ];

              connection.query(requeteClient, valuesClient, (err, results) => {
                if (err) {
                  logger.error(`Erreur lors de la requête: ${err}`);
                  return connection.rollback(() =>
                    res
                      .status(500)
                      .json({ message: "Votre inscription a echoué" })
                  );
                }

                connection.commit((err) => {
                  if (err) {
                    return connection.rollback(() => {
                      connection.release();
                      logger.error(
                        `Erreur lors de la validation de la transaction: ${err}`
                      );
                      return res.status(500).json({
                        message:
                          "Erreur lors de la validation de la transaction",
                      });
                    });
                  }
                  envoyerCourriel(prenom, req, res, (err) => {
                    if (err) {
                      // handle error
                      logger.error(
                        `Erreur lors de l'envoi du courriel de bienvenue: ${err}`
                      );
                    } else {
                      logger.info("Courriel de bienvenue envoyé avec succès");
                    }
                  });

                  connection.release();
                  return res
                    .status(201)
                    .json({ message: "Votre inscription est réussie" });
                });
              });
            });
          }
        );
      });
    });
  });
};

/**
 * Connexion d'un utilisateur existant et récupération d'un jeton d'accès.
 *
 * @param {Object} req - L'objet requête (request) provenant du client.
 * @param {Object} res - L'objet réponse (response) à envoyer au client.
 * @returns {Promise<void>} - Renvoie une réponse JSON contenant les informations du compte connecté et un jeton d'accès.
 */
export const login = async (req, res) => {
  const { email, mdp } = req.body;
  const requete = "SELECT * FROM utilisateur WHERE courriel = ?";
  let pool = getPool();

  logger.info(`Connexion de l'utilisateur avec l'email: ${email}`);

  try {
    const utilisateur = await new Promise((resolve, reject) => {
      pool.query(requete, [email], (err, results) => {
        if (err) {
          logger.error(`Erreur lors de la requête: ${err}`);
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
    if (utilisateur.length === 0) {
      logger.warn(`Utilisateur non trouvé avec l'email: ${email} `);
      return res.status(409).json({
        message: "Identifiants invalides, reverifiez-les s'il vous plaît",
      });
    }

    let mdpValide = false;
    //on compare le mot de passe entré avec le mot de passe hashé dans la base de données
    try {
      mdpValide = await bcrypt.compare(mdp, utilisateur[0].mot_de_passe);
    } catch (err) {
      console.log(err);
      return res
        .status(500)
        .json({ message: "Votre connexion a echoué, svp essayez plus tard" });
    }
    if (!mdpValide) {
      return res.status(409).json({
        message: "Identifiants invalides, reverifiez-les s'il vous plaît",
      });
    }

    let token;
    try {
      token = jwt.sign(
        {
          utilisateurId: utilisateur[0].id_utilisateur,
          utilisateurRole: utilisateur[0].type_utilisateur,
          utilisateurCourriel: utilisateur[0].courriel,
        },
        "jean_francois_meuilleur_prof_is_the_private_key",
        { expiresIn: "1h" }
      );
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        message: "Votre connexion a echoué, svp essayez plus tard",
      });
    }

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 60 * 60 * 1000, //une heure
      sameSite: "lax",
    });

    logger.info(`Connexion réussie pour l'email: ${email}`);

    res.status(201).json({
      message: "Vous êtes connecté(e)!",
      userId: utilisateur[0].id_utilisateur,
      token: token,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Erreur lors de la connexion, svp essayez plus tard",
    });
  }
};

export const logout = async (req, res) => {
  logger.info(`Déconnexion`);
  res.cookie("token", "", {
    httpOnly: true,
    maxAge: 0,
    sameSite: "lax",
  });
  res.status(200).json({ message: "Vous êtes déconnecté(e)!" });
};

/**
 * Modification des informations d'un utilisateur, on peut seulement modifier le prenom,
 * le nom, l'adresse, le numero de telephone et le mdp
 * La methode verifie aussi le mot de passe de l'utilisateur
 *
 * @param {Object} req - L'objet requête (request) provenant du client.
 * @param {Object} res - L'objet réponse (response) à envoyer au client.
 * @param {Function} next - La fonction next pour passer au middleware suivant.
 * @returns {Promise<void>} - Renvoie une réponse JSON contenant les informations de l'utilisatteur et le client modifiées.
 */
export const modifierUtilisateur = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { nom, prenom, adresse, telephone, mdpCourant, nouveauMdp } = req.body;
  const utilisateurId = req.params.pid;
  let pool = getPool();

  logger.info(`Modification de l'utilisateur avec l'id: ${utilisateurId}`);

  const requeteUtilisateur =
    "SELECT * FROM utilisateur WHERE id_utilisateur = ?";
  const utilisateur = await new Promise((resolve, reject) => {
    pool.query(requeteUtilisateur, [utilisateurId], (err, results) => {
      if (err) {
        logger.error(`Erreur lors de la requête: ${err}`);
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
  const requeteClient =
    "SELECT * FROM client WHERE utilisateur_id_utilisateur = ?";
  const client = await new Promise((resolve, reject) => {
    pool.query(requeteClient, [utilisateurId], (err, results) => {
      if (err) {
        logger.error(`Erreur lors de la requête: ${err}`);
        reject(err);
      } else {
        resolve(results);
      }
    });
  });

  if (utilisateur.length === 0 || client.length === 0) {
    logger.warn(`Utilisateur non trouvé avec l'email: ${email} `);
    const error = new Error(
      "Opps, il y a eu un problème, on ne peut pas trouver un client avec cet id"
    );
    error.status = 404;
    return next(error);
  }
  const mdpValide = await bcrypt.compare(
    mdpCourant,
    utilisateur[0].mot_de_passe
  );
  if (!mdpValide) {
    logger.warn(`Mot de passe incorrect`);
    const error = new Error("Le mot de passe est incorrect", 401);
    return next(error);
  }

  let mdpEncrypter = utilisateur[0].mot_de_passe;
  if (nouveauMdp) {
    mdpEncrypter = await bcrypt.hash(nouveauMdp, 12);
  }

  const requeteMiseAJourClient =
    "UPDATE client SET nom = ?, prenom = ?, adresse = ?, telephone = ? WHERE utilisateur_id_utilisateur = ?";
  const requeteMiseAJourUtilisateur =
    "UPDATE utilisateur SET mot_de_passe = ? WHERE id_utilisateur = ?";

  try {
    await new Promise((resolve, reject) => {
      pool.query(
        requeteMiseAJourClient,
        [nom, prenom, adresse, telephone, utilisateurId],
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

    await new Promise((resolve, reject) => {
      pool.query(
        requeteMiseAJourUtilisateur,
        [mdpEncrypter, utilisateurId],
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
    logger.info(`Utilisateur modifié avec succès - id: ${utilisateurId}`);
    res.status(200).json({
      client: client[0],
      utilisateur: utilisateur[0],
    });
  } catch (err) {
    const error = new Error(
      "Opps, il y a eu un problème, on ne peut pas modifier ce client"
    );
    error.status = 500;
    return next(error);
  }
};

/**
 * Suppression d'un utilisateur et de son client associé.
 *
 * @param {Object} req - L'objet requête (request) provenant du client.
 * @param {Object} res - L'objet réponse (response) à envoyer au client.
 * @param {Function} next - La fonction next pour passer au middleware suivant.
 * @returns {Promise<void>} - Renvoie une réponse JSON indiquant que l'utilisateur a été supprimé.
 */
export const supprimerUtilisateur = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { utilisateurId, mdp } = req.body;
  const pool = getPool();

  const requeteUtilisateur =
    "SELECT * FROM utilisateur WHERE id_utilisateur = ?";
  const utilisateur = await new Promise((resolve, reject) => {
    pool.query(requeteUtilisateur, [utilisateurId], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });

  const requeteClient =
    "SELECT * FROM client WHERE utilisateur_id_utilisateur = ?";
  const client = await new Promise((resolve, reject) => {
    pool.query(requeteClient, [utilisateurId], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });

  if (utilisateur.length === 0 || client.length === 0) {
    logger.warn(`Utilisateur non trouvé avec l'email: ${utilisateur} `);
    const error = new Error(
      "Opps, il y a eu un problème, on ne peut pas trouver un client avec cet id"
    );
    error.status = 404;
    return next(error);
  }

  const mdpValide = await bcrypt.compare(mdp, utilisateur[0].mot_de_passe);
  if (!mdpValide) {
    logger.warn(`Le mot de passe est incorrect`);
    const error = new Error("Le mot de passe est incorrect", 401);
    return next(error);
  }
  const requeteSuppressionUtilisateurVoiture =
    "DELETE FROM utilisateur_voiture WHERE id_utilisateur = ?";
  const requeteSuppressionClient =
    "DELETE FROM client WHERE utilisateur_id_utilisateur = ?";
  const requeteSuppressionUtilisateur =
    "DELETE FROM utilisateur WHERE id_utilisateur = ?";

  try {
    await Voiture.deleteMany({ vendeur: utilisateurId });

    // Suppression des lignes dans la table utilisateur_voiture qui referencient l'utilisateur
    await new Promise((resolve, reject) => {
      pool.query(
        requeteSuppressionUtilisateurVoiture,
        [utilisateurId],
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
    const client = await new Promise((resolve, reject) => {
      pool.query(
        "SELECT * FROM client WHERE utilisateur_id_utilisateur = ?",
        [utilisateurId],
        (err, results) => {
          if (err) {
            reject(err);
          } else {
            resolve(results);
          }
        }
      );
    });

    // Suppression du client dans la table client
    if (client.length > 0) {
      await new Promise((resolve, reject) => {
        pool.query(
          requeteSuppressionClient,
          [utilisateurId],
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
    }

    // Suppression de l'utilisateur dans la table utilisateur
    await new Promise((resolve, reject) => {
      pool.query(
        requeteSuppressionUtilisateur,
        [utilisateurId],
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

    res.status(200).json({ message: "Votre compte a été supprimé" });
  } catch (err) {
    logger.error(`Erreur lors de la requête: ${err}`);
    const error = new Error(
      "Opps, il y a eu un problème, on ne peut pas supprimer ce client"
    );
    error.status = 500;
    return next(error);
  }
};
