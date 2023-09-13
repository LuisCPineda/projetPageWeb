import multer from "multer";
import logger from "../logger/logger.js";

/**
 * Configuration de multer pour télécharger des images
 * @type {Object}
 * @property {Function} storage - Fonction pour configurer le dossier de destination et le nom du fichier
 * @property {Function} fileFilter - Fonction pour filtrer les fichiers
 * @property {number} limits - Limite de taille du fichier
 *
 * @source http://expressjs.com/en/resources/middleware/multer.html
 */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    logger.info(`Téléchargement de l'image ${file.originalname}`);
    cb(null, "telechargements/");
  },
  filename: (req, file, cb) => {
    const filename =
      req.userData.userId +
      "-" +
      new Date().toISOString().replace(/:/g, "-") +
      "-" +
      file.originalname;
    logger.info(`Nom de l'image: ${filename}`);
    cb(null, filename);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    logger.error(`Type de fichier invalide: ${file.mimetype}`);
    cb(null, false);
  }
};

export const telechargerImages = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5, // 5 MB max
  },
  fileFilter: fileFilter,
}).array("photos_voiture");
