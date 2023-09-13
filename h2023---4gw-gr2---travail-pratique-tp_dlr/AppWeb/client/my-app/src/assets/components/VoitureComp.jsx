import { Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const VoitureCarte = ({ voiture }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/voiture/${voiture._id}`);
  };

  return (
    <Card className="carte-voiture" onClick={handleClick}>
      <Card.Img
        className="carte-image"
        variant="top"
        src={`http://localhost:8000/${voiture.photos_voiture[0]}`}
      />
      <Card.Body>
        <Card.Title>{voiture.titre}</Card.Title>
        {/*<Card.Title>{voiture.marque + " " + voiture.modele}</Card.Title>*/}
        <Card.Text>
          Kilomètres: {voiture.kilometrage + " km"}
          <br />
          Prix: {voiture.prix + " $"}
        </Card.Text>
      </Card.Body>
    </Card>
  );
};
export default VoitureCarte;
