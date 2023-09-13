import express from "express";
import {
  getConversations,
  creerMessage,
  getConversation,
} from "../controllers/messages-controllers.js";
import CheckAuth from "../middlewares/check-auth.js";

const router = express.Router();

router.use(CheckAuth); //pour proteger les routes suivantes

router.get("/", getConversations);
router.post("/envoyer", creerMessage);
router.get("/:uid", getConversation);

export default router;
