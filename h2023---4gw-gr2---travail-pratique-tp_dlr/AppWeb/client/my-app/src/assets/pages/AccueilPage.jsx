/* react components */
import React from "react";
import { Container } from "react-bootstrap";

import TitreComp from "../components/TitreComp";
import CarouselComp from "../components/CarouselComp";
import FooterComp from "../components/FooterComp";

function AccueilPage() {
  return (
    <div className="page-principale">
      <TitreComp></TitreComp>
      <Container className="carousel-page-principale">
        <CarouselComp></CarouselComp>
      </Container>
      <FooterComp></FooterComp>
    </div>
  );
}
export default AccueilPage;
