/* react components */
import React from "react";
import DetailVoitureComp from "../components/DetailVoitureComp";
import NavbarComp from "../components/NavbarComp";
import FooterComp from "../components/FooterComp";

function DetailVoiturePage() {
  return (
    <div className="bg-dark">
      <NavbarComp></NavbarComp>
      <DetailVoitureComp></DetailVoitureComp>
      <FooterComp></FooterComp>
    </div>
  );
}
export default DetailVoiturePage;
