import jwt from "jsonwebtoken";
import logger from "../logger/logger.js";

/**
 * Vérifie si l'utilisateur est authentifié
 *
 * @param {Object} req - L'objet requête provenant du client
 * @param {Object} res - L'objet réponse envoyé au client
 * @param {Function} next - Fonction pour passer au middleware suivant
 *
 * @throws {error} - Une erreur serveur sera loggé et envoyé au client
 */
const CheckAuth = (req, res, next) => {
  try {
    //recuperer le token
    const token = req.cookies.token;

    logger.info(`Vérification du token: ${token}`);

    //verifier le token
    const decodedToken = jwt.verify(
      token,
      "jean_francois_meuilleur_prof_is_the_private_key"
    );
    // Get le id de l'utilisateur du token
    req.userData = {
      userId: decodedToken.utilisateurId,
      email: decodedToken.utilisateurCourriel,
      //role: decodedToken.isAdmin,
    };
    logger.info(`Utilisateur authentifié: ${req.userData.email}`);
    // prochain middleware
    next();
  } catch (error) {
    logger.error(`Erreur d'authentification: ${error.message}`);
    res.status(401).json({ message: "Vous n'êtes pas authentifié(e)!" });
  }
};

export default CheckAuth;
