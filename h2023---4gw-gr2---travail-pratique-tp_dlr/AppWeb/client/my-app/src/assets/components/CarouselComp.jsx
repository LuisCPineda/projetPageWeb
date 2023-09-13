/* react components */
import React from "react";
import { Carousel } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

/* images */
import AcuraLogo from "../images/logos/acura-logo.png";
import AudiLogo from "../images/logos/audi-logo.png";
import BMWLogo from "../images/logos/bmw-logo.png";
import ChevorletLogo from "../images/logos/chevrolet-logo.png";
import DodgeLogo from "../images/logos/dodge-logo.png";
import FiatLogo from "../images/logos/fiat-logo.png";
import FordLogo from "../images/logos/ford-logo.png";
import GMCLogo from "../images/logos/gmc-logo.png";
import HondaLogo from "../images/logos/honda-logo.png";
import HyundaiLogo from "../images/logos/hyundai-logo.png";
import InfinitiLogo from "../images/logos/infiniti-logo.png";
import JeepLogo from "../images/logos/jeep-logo.png";
import KiaLogo from "../images/logos/kia-logo.png";
import LandRoverLogo from "../images/logos/land-rover-logo.png";
import LexusLogo from "../images/logos/lexus-logo.png";
import MazdaLogo from "../images/logos/mazda-logo.png";
import MercedesLogo from "../images/logos/mercedes-logo.png";
import MiniCarLogo from "../images/logos/mini-car-logo.png";
import MitsubishiLogo from "../images/logos/mitsubishi-logo.png";
import NissanLogo from "../images/logos/nissan-logo.png";
import SubaruLogo from "../images/logos/subaru-logo.png";
import ToyotaLogo from "../images/logos/toyota-logo.png";
import VolkswagenLogo from "../images/logos/volkswagen-logo.png";
import VolvoLogo from "../images/logos/volvo-logo.png";

const CarouselComp = () => {
  const logos = [
    { brand: "Acura", image: AcuraLogo },
    { brand: "Audi", image: AudiLogo },
    { brand: "BMW", image: BMWLogo },
    { brand: "Chevorlet", image: ChevorletLogo },
    { brand: "Dodge", image: DodgeLogo },
    { brand: "Fiat", image: FiatLogo },
    { brand: "Ford", image: FordLogo },
    { brand: "GMC", image: GMCLogo },
    { brand: "Honda", image: HondaLogo },
    { brand: "Hyundai", image: HyundaiLogo },
    { brand: "Infiniti", image: InfinitiLogo },
    { brand: "Jeep", image: JeepLogo },
    { brand: "Kia", image: KiaLogo },
    { brand: "Land_Rover", image: LandRoverLogo },
    { brand: "Lexus", image: LexusLogo },
    { brand: "Mazda", image: MazdaLogo },
    { brand: "Mercedes", image: MercedesLogo },
    { brand: "Mini_Car", image: MiniCarLogo },
    { brand: "Mitsubishi", image: MitsubishiLogo },
    { brand: "Nissan", image: NissanLogo },
    { brand: "Subaru", image: SubaruLogo },
    { brand: "Toyota", image: ToyotaLogo },
    { brand: "Volkswagen", image: VolkswagenLogo },
    { brand: "Volvo", image: VolvoLogo },
  ];

  const navigate = useNavigate();

  const handleLogoClick = (brand) => {
    navigate(`/recherche/${brand}`);
  };
  return (
    <div>
      <h2 className="mb-5 titre-carousel">Recherche par marque</h2>
      <Carousel interval={null}>
        {logos.map((logo, index) => {
          if (index % 3 === 0) {
            return (
              <Carousel.Item key={index}>
                <div className="d-flex justify-content-center align-items-center">
                  <img
                    className="carousel-logo m-5"
                    src={logo.image}
                    alt={logo.brand}
                    onClick={() => handleLogoClick(logo.brand)}
                  />

                  {logos[index + 1] && (
                    <img
                      className="carousel-logo m-5"
                      src={logos[index + 1].image}
                      alt={logos[index + 1].brand}
                      onClick={() => handleLogoClick(logos[index + 1].brand)}
                    />
                  )}
                  {logos[index + 2] && (
                    <img
                      className="carousel-logo m-5"
                      src={logos[index + 2].image}
                      alt={logos[index + 2].brand}
                      onClick={() => handleLogoClick(logos[index + 2].brand)}
                    />
                  )}
                </div>
              </Carousel.Item>
            );
          }
          return null;
        })}
      </Carousel>
    </div>
  );
};
export default CarouselComp;
