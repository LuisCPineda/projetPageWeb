import React from "react";
import NavbarComp from "../components/NavbarComp";
import MesMessagesComp from "../components/MesMessagesComp";
import FooterComp from "../components/FooterComp";

function MesMessagesPage() {
  return (
    <div className="bg-dark page-messages">
      <NavbarComp />
      <MesMessagesComp />
      <FooterComp />
    </div>
  );
}

export default MesMessagesPage;
