/**
 * Verfie si un fichier est téléchargé
 *
 * @param {Object} req - L'objet requête provenant du client
 * @param {Object} res - L'objet réponse envoyé au client
 * @param {Function} next - Fonction pour passer au middleware suivant
 * @returns {Object} - Renvoie un objet JSON avec un message d'erreur si aucun fichier n'est téléchargé
 */

import logger from "../logger/logger.js";

const checkUploads = (req, res, next) => {
  if (!req.files || req.files.length === 0) {
    logger.error("Aucun fichier téléchargé");
    return res.status(400).json({ message: "Aucun fichier téléchargé" });
  }
  next();
};
export default checkUploads;
