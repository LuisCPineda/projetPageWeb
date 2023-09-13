import React from "react";
import { ListGroup } from "react-bootstrap";
import { formatDistanceToNow } from "date-fns"; //https://www.learnhowtoprogram.com/react-part-time-react-track/react-with-redux-part-2/introduction-to-date-fns
import { fr } from "date-fns/locale";

function ListConversations({ conversations, setConversationSelectionee }) {
  return (
    <ListGroup>
      {conversations.map((conversation) => (
        <ListGroup.Item
          key={conversation.userId}
          action
          onClick={() => setConversationSelectionee(conversation)}
        >
          <div>
            <strong>Utilisateur:</strong> {conversation.username}
          </div>
          <div>
            <strong>Dernier Message: </strong> {conversation.dernierMessage}
          </div>
          <div>
            <strong>Temps: </strong>
            {formatDistanceToNow(new Date(conversation.dernierMessageDate), {
              addSuffix: true,
              locale: fr,
            })}
          </div>
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
}

export default ListConversations;
