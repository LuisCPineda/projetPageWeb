/* react components */
import React from "react";
import ProfilComp from "../components/ProfilComp";
import NavbarComp from "../components/NavbarComp";
import FooterComp from "../components/FooterComp";

function ProfilPage() {
  return (
    <div className="profil-page bg-dark">
      <NavbarComp></NavbarComp>
      <ProfilComp></ProfilComp>
      <FooterComp></FooterComp>
    </div>
  );
}
export default ProfilPage;
