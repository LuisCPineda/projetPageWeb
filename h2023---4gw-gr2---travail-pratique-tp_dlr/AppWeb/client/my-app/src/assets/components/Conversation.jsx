import React, { useEffect, useState } from "react";
import { Card, ListGroup, Form, Button } from "react-bootstrap";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "react-toastify";
import { useAuthContext } from "../../context/auth-context";

function Conversation({ conversation }) {
  const [nouveauMessage, setNouveauMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const { utilisateur } = useAuthContext();

  const envoyerMessage = async () => {
    try {
      const response = await fetch(`http://localhost:8000/messages/envoyer`, {
        method: "post",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          toUserId: conversation.userId,
          voitureId: conversation.voitureId,
          message: nouveauMessage,
        }),
      });
      const data = await response.json();
      console.log(data);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          fromUserId: utilisateur.userId,
          message: nouveauMessage,
          date: new Date(),
        },
      ]);
      setNouveauMessage("");
    } catch (error) {
      toast.error("Erreur dans l'envoi du message");
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/messages/${conversation.userId}`,
          {
            method: "get",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        setMessages(data.messages);
      } catch (error) {
        toast.error("Error dans le chargement des messages");
        console.log(error);
      }
    };
    fetchMessages();
  }, [conversation]);
  return (
    <Card>
      <Card.Header className="conversation-header">
        Conversation avec {conversation.username}
      </Card.Header>
      <ListGroup variant="flush">
        {messages.map((message, index) => (
          <ListGroup.Item key={index}>
            <strong>
              {message.fromUserId === utilisateur.userId
                ? "Moi"
                : message.username}
              :
            </strong>
            <p
              style={
                message.fromUserId === utilisateur.userId
                  ? { color: "blue" }
                  : { color: "green" }
              }
            >
              {message.message}
            </p>
            <small>
              {formatDistanceToNow(new Date(message.date), {
                addSuffix: true,
                locale: fr,
              })}
            </small>
          </ListGroup.Item>
        ))}
      </ListGroup>
      <Form className="m-3">
        <Form.Group>
          <Form.Control
            className="message-input"
            as="textarea"
            value={nouveauMessage}
            onChange={(e) => setNouveauMessage(e.target.value)}
          />
        </Form.Group>
        <Button className="mt-2" onClick={envoyerMessage}>
          Envoyer
        </Button>
      </Form>
    </Card>
  );
}

export default Conversation;
