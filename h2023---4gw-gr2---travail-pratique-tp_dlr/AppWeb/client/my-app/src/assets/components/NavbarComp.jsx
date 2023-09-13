/* react components */
import { React, useContext } from "react";
import { Link } from "react-router-dom";

/* Toasts notifications*/
import { toast } from "react-toastify";

/* bootstrap components */
import { Navbar, Container, Nav, NavDropdown, Button } from "react-bootstrap";

/*Authentification Context*/
import { AuthContext } from "../../context/auth-context";

function NavbarComp() {
  const { utilisateur, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    toast.success("Vous avez été déconnecté(e).");
  };

  return (
    <Navbar
      collapseOnSelect
      expand="lg"
      bg="transparent"
      variant="dark"
      className="px-4"
    >
      <Container className="my-5">
        <Navbar.Brand as={Link} to="/">
          carfinder
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <NavDropdown title="Catalogue" id="collasible-nav-dropdown">
              <NavDropdown.Item as={Link} to="/catalogue">
                Consulter les voitures usagées
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/rechercher">
                Recherche spécifique
              </NavDropdown.Item>
            </NavDropdown>
            <NavDropdown title="Compte" id="collasible-nav-dropdown">
              <NavDropdown.Item as={Link} to="/profil">
                Profil
              </NavDropdown.Item>
              {utilisateur ? (
                <NavDropdown.Item as={Link} to="/mes-messages">
                  Mes messages
                </NavDropdown.Item>
              ) : (
                <></>
              )}
              <NavDropdown.Divider />
              {utilisateur ? (
                <NavDropdown.Item onClick={handleLogout}>
                  Se déconnecter
                </NavDropdown.Item>
              ) : (
                <>
                  <NavDropdown.Item as={Link} to="/login">
                    Se connecter
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/signup">
                    S'inscrire
                  </NavDropdown.Item>
                </>
              )}
            </NavDropdown>
          </Nav>
          <Nav>
            {utilisateur ? (
              <Nav.Link onClick={handleLogout}>Se déconnecter</Nav.Link>
            ) : (
              <Nav.Link as={Link} to="/login">
                Se connecter
              </Nav.Link>
            )}
          </Nav>
          <Nav className="d-flex justify-content-end">
            <Button as={Link} to="/publier" variant="outline-light">
              Vendre voiture
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
export default NavbarComp;
