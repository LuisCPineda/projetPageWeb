import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import ListConversations from "./ListConversations";
import Conversation from "./Conversation";
import { toast } from "react-toastify";

function MesMessagesComp() {
  const [conversations, setConversations] = useState([]);
  const [conversationSelectionee, setConversationSelectionee] = useState(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await fetch(`http://localhost:8000/messages/`, {
          method: "get",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        console.log(data);
        setConversations(data.conversations);
      } catch (error) {
        toast.error("Erreur dans la récupération des conversations");
        console.log(error);
      }
    };
    fetchConversations();
  }, []);

  return (
    <Container className="messages-container">
      <Row>
        <Col md={3}>
          <h2>Conversations</h2>
          {conversations.length > 0 ? (
            <ListConversations
              conversations={conversations}
              setConversationSelectionee={setConversationSelectionee}
            />
          ) : (
            <p>Vous avez aucune conversation</p>
          )}
        </Col>

        <Col md={9}>
          <h2>Conversation Ouverte</h2>
          {conversationSelectionee ? (
            <Conversation
              conversation={conversationSelectionee}
              messages={messages}
              setMessages={setMessages}
            />
          ) : (
            <p>Veuillez sélectionner une conversation</p>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default MesMessagesComp;
