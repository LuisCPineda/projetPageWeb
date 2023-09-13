import React from "react";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaPhone,
  FaEnvelope,
} from "react-icons/fa";
import { Container, Row, Col} from "react-bootstrap";
import { Link } from "react-router-dom";

const FooterComp = () => {
  return (
    <div className="footer">
      <Container>
        <Row className="align-items-center">
          <Col className="text-center">
            <Link to="/" className="footer-text">
              carfinder.com &copy; 2023
            </Link>
          </Col>
        </Row>
        <hr className="footer-separator" />
        <Row>
          <Col md={4} sm={6} className="footer-col">
            <h3 className="footer-title">Acheter & Vendre</h3>
            <ul className="footer-links">
              <li>
                  <a href="http://localhost:3000/rechercher">Rechecher une voiture</a>
              </li>
              <li>
                <a href="http://localhost:3000/catalogue">Consulter le catalogue</a>
              </li>
              <li>
                <a href="http://localhost:3000/publier">Vendre voiture</a>
              </li>
            </ul>
          </Col>
          <Col md={4} sm={6} className="footer-col">
            <h3 className="footer-title">À propos</h3>
            <ul className="footer-links">
              <li>
                <a href="#about">À propos</a>
              </li>
              <li>
                <a href="#faq">FAQ</a>
              </li>
            </ul>
          </Col>
          <Col md={4} sm={12} className="footer-col">
            <h3 className="footer-title">Nous contacter</h3>
            <p className="footer-contact">
              <a href="tel:+15146681000" className="contact-link">
                <FaPhone className="footer-icon" /> (514) 668-1000
              </a>
            </p>
            <p className="footer-contact">
              <a href="mailto:carfinder@contact.com" className="contact-link">
                <FaEnvelope className="footer-icon" /> carfinder@contact.com
              </a>
            </p>
            <div className="social-links">
              <a
                href="https://www.facebook.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="social-link me-2"
              >
                <FaFacebook />
              </a>
              <a
                href="https://twitter.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="social-link me-2"
              >
                <FaTwitter />
              </a>
              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
              >
                <FaInstagram />
              </a>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default FooterComp;
