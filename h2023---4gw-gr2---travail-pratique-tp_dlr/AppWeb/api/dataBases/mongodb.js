import mongoose from "mongoose";
import logger from "../logger/logger.js";

/**
 * Cette fonction permet de se connecter à la base de données MongoDB
 *
 * @returns {Promise} - Une promesse contenant le pool de connexion
 * @throws {Error} - Une erreur de connexion à la base de données
 */
export const connexionMongoDB = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/carfinderdata", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    logger.info("Connexion à MongoDB réussie");
  } catch (err) {
    logger.error(`Connexion à MongoDB échouée - ${err}}`);
    throw err;
  }
};
