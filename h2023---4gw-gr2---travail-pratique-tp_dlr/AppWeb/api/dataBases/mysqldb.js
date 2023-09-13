import mysql from "mysql";
import logger from "../logger/logger.js";

let pool;
/**
 * Cette fonction permet de se connecter à la base de données MySQL
 *
 * @returns {Promise} - Une promesse contenant le pool de connexion
 * @throws {Error} - Une erreur de connexion à la base de données
 *
 * @source https://codeforgeek.com/node-mysql-connection-pool-example/
 */

export const connexionMySQL = () => {
  return new Promise((resolve, reject) => {
    pool = mysql.createPool({
      host: "localhost",
      user: "adminscott",
      password: "oracle",
      database: "carfinderdata",
    });

    pool.getConnection((err, connection) => {
      if (err) {
        logger.error(`MySQL connexion échouée - ${err}`);
        reject(err);
      } else {
        logger.info("MySQL connexion réussie");
        resolve(pool);
      }
    });
  });
};
export const getPool = () => pool;
