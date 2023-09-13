import { connexionMongoDB } from "./mongodb.js";
import { ObjectId } from "mongodb";

import Voiture from "../models/voiture.js";

import seedData from "../../bd/scripts/mongodb/seedData.json" assert { type: "json" };

import logger from "../logger/logger.js";

const { voitures } = seedData;

/**
 * Cette fonction permet de réinitialiser la base de données mongodb
 * à partir du fichier seedData.json
 *
 * @returns {void}
 * @throws {Error} - Une erreur de connexion à la base de données
 * ou une erreur de sauvegarde des données
 */
const seedDataBase = async () => {
  try {
    await connexionMongoDB();

    await Voiture.deleteMany({});

    logger.info("La base de données a été vidée");

    for (const voitureData of voitures) {
      // Convertir les id en ObjectId
      voitureData._id = new ObjectId(voitureData._id.$oid);

      const voiture = new Voiture(voitureData);
      await voiture.save();
    }

    logger.info("La base de données a été réinitialisée");
  } catch (error) {
    logger.error(`La base de données n'a pas pu être réinitialisée - ${error}`);
    throw error;
  }
};

seedDataBase();
