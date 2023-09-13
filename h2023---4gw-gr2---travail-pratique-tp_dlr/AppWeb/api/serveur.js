import express from "express";
import bodyParser from "body-parser";

import path from "path";
import { fileURLToPath } from "url";

import cors from "cors";
import cookieParser from "cookie-parser";

import { connexionMongoDB } from "./dataBases/mongodb.js";
import { connexionMySQL } from "./dataBases/mysqldb.js";

import voituresRoutes from "./routes/voitures-routes.js";
import utilisateursRoutes from "./routes/utilisateurs-routes.js";
import messagesRoutes from "./routes/messages-routes.js";

import logger from "./logger/logger.js";

const hostname = "localhost";
const port = 8000;

const app = express();
app.use(bodyParser.json());

//pour permettre les requetes cross-origin
app.use(
  cors({
    origin: "http://localhost:3000", //pour permettre l'acces au client
    credentials: true, //pour permettre l'acces aux cookies
  })
);

//https://flaviocopes.com/fix-dirname-not-defined-es-module-scope/
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(
  "/telechargements",
  express.static(path.join(__dirname, "telechargements"))
);
//pour permettre l'acces aux images

app.use(cookieParser()); //pour permettre l'acces aux cookies

app.use("/api/", voituresRoutes); // routes voitures
app.use("/user/", utilisateursRoutes); // routes utilisateurs
app.use("/messages/", messagesRoutes); // routes messages"

/**
 * Gére les routes inexistante
 * @param {Object} req - Une requete.
 * @param {Object} res - Une reponse.
 * @param {function} next - Le prochain middleware dans le code
 */
app.use((req, res, next) => {
  const error = new Error("Route inexistante");
  error.status = 404;
  logger.warn(`Route inexistante: ${req.method} ${req.url}`);
  next(error);
});

/**
 * Gére les erreurs jetés par les autres middlewares
 * @param {Error} error - L'objet erreur jeté par le middleware précédent
 * @param {Object} req - Une requete.
 * @param {Object} res - Une reponse.
 * @param {function} next - Le prochain middleware dans le code
 */
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
  const sourceErreur = error.source ? ` (source: ${error.source})` : "";
  logger.error(
    `Erreur jetté par un middleware: ${error.message}${sourceErreur}`
  );
});

Promise.all([connexionMongoDB(), connexionMySQL()])
  .then(() => {
    app.listen(port, () => {
      logger.info(
        `Le serveur roule à l'URL suivant : http://${hostname}:${port}🚀`
      );
      console.log(
        `Le serveur roule à l'URL suivant : http://${hostname}:${port}🚀`
      );
    });
  })
  .catch((err) => {
    logger.error(err);
    console.log(err);
  });
