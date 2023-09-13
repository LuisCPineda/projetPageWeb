import Message from "../models/message.js";
import logger from "../logger/logger.js";
import { getPool } from "../dataBases/mysqldb.js";

/**
 * Récupére toutes les conversations de l'utilisateur connecté
 *
 * @param {Object} req - Une requete.
 * @param {Object} res - Une reponse.
 * @param {function} next - Le prochain middleware dans le code
 * @returns {Object} - Un objet contenant tous les messages envoyés ou recu de l'utilisateur connecté
 *
 * @throws {error} - Une erreur serveur sera loggé et envoyé au client
 */
export const getConversations = async (req, res, next) => {
  logger.info("Fetch toutes les conversations");
  try {
    // get tous les messages de l'utilisateur connecté
    const messages = await Message.find({
      $or: [
        { fromUserId: req.userData.userId },
        { toUserId: req.userData.userId },
      ], // tous les messages envoyés ou recu de l'utilisateur connecté
    }).sort({ date: -1 }); // -1 pour trier la date par ordre décroissant

    logger.info("Tous les messages: " + messages);

    // creer un map pour stocker les conversations
    const conversations = new Map();

    // loop à travers tous les messages
    for (let message of messages) {
      // determiner l'autre utilisateur dans la conversation
      let autreUserId;
      if (message.fromUserId === req.userData.userId) {
        autreUserId = message.toUserId;
      } else {
        autreUserId = message.fromUserId;
      }

      const autreUserName = await getNomDeLaBD(autreUserId);

      // si l'autre utilisateur n'est pas dans la map, ajouter une nouvelle conversation
      if (!conversations.has(autreUserId)) {
        conversations.set(autreUserId, {
          userId: autreUserId,
          username: autreUserName,
          dernierMessage: message.message,
          dernierMessageDate: message.date,
          voitureId: message.voitureId,
          messages: [],
        });
      }
    }
    logger.info("Conversations: " + Array.from(conversations.values()));
    res.status(200).json({ conversations: Array.from(conversations.values()) });
  } catch (err) {
    logger.error("getConversations: " + err.message);
    res.status(500).json({ message: err.message });
  }
};

/**
 * Cree un nouveau message
 *
 * @param {Object} req - Une requete.
 * @param {Object} res - Une reponse.
 * @param {function} next - Le prochain middleware dans le code
 * @returns {Object} - Un objet contenant le nouveau message créé
 *
 * @throws {error} - Une erreur serveur sera loggé et envoyé au client
 */
export const creerMessage = async (req, res, next) => {
  const { toUserId, voitureId, message } = req.body;

  logger.info("creerMessage" + req.body);

  const nouveauMessage = new Message({
    fromUserId: req.userData.userId,
    toUserId,
    voitureId,
    message,
  });

  logger.info("Le nouveau message est " + nouveauMessage);

  try {
    const messageCree = await nouveauMessage.save();
    logger.info("Message est enregistré: " + messageCree);
    res.status(201).json(messageCree);
  } catch (err) {
    logger.error("creerMessage: " + err.message);
    res
      .status(500)
      .json({ message: "La création du message a echoué" + err.message });
  }
};

/**
 * Recupere une conversation entre deux utilisateurs
 *
 * @param {Object} req - Une requete.
 * @param {Object} res - Une reponse.
 * @param {function} next - Le prochain middleware dans le code
 * @returns {Object} - Un objet contenant tous les messages entre les deux utilisateurs
 *
 * @throws {error} - Une erreur serveur sera loggé et envoyé au client
 */
export const getConversation = async (req, res, next) => {
  const userId = req.userData.userId;
  const autreUserId = req.params.uid;

  logger.info("getConversation: " + userId + " " + autreUserId);

  let messages;
  try {
    messages = await Message.find({
      $or: [
        { fromUserId: userId, toUserId: autreUserId },
        { fromUserId: autreUserId, toUserId: userId },
      ],
    });
    logger.info("Les messages entre les deux utilisateurs: " + messages);
  } catch (err) {
    logger.error("getConversation: " + err.message);
    res
      .status(500)
      .json({ message: "Fetch de la conversation a echoué " + err.message });
  }
  // un peu speghetti mais vu que on n'a pas de Username dans le model de message,
  // on doit créer un nouveau tableau qui va contenir les messages en objet Javascript et non pas
  // en objet Mongoose afin de pouvoir ajouter le username.
  let messagesAvecLesNoms = [];
  for (let message of messages) {
    let messageObject = message.toObject();
    messageObject.username = await getNomDeLaBD(message.fromUserId);
    messagesAvecLesNoms.push(messageObject);
  }

  if (!messages || messages.length == 0) {
    logger.warn("getConversation: Pas de messages");
    return res
      .status(404)
      .json({ message: "Il n'y a pas de messages avec cet utilisateur" });
  }

  res.json({ messages: messagesAvecLesNoms });
};

/**
 * Recupere le nom de l'utilisateur dans la BD
 * @param {string} userId - L'id de l'utilisateur
 * @returns {string} - Le nom de l'utilisateur
 *
 * @throws {error} - Une erreur serveur sera loggé
 */
export const getNomDeLaBD = async (userId) => {
  return new Promise((resolve, reject) => {
    logger.info("getNomDeLaBD: " + userId);
    const pool = getPool();
    pool.query(
      "SELECT nom FROM client WHERE utilisateur_id_utilisateur = ?",
      [userId],
      (error, results) => {
        if (error) {
          logger.error(`MySQL requete echouée - ${error}`);
          reject(error);
        } else {
          resolve(results[0].nom);
          logger.info(`MySQL requete reussie: ${results}`);
        }
      }
    );
  });
};
