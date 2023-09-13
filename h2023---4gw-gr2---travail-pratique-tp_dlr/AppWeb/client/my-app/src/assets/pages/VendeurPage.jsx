/* react components */
import React from "react";
import NavbarComp from "../components/NavbarComp";
import VendeurComp from "../components/VendeurComp";
import FooterComp from "../components/FooterComp";

function VendeurPage() {
  return (
    <div className="bg-vendeur">
      <NavbarComp></NavbarComp>
      <VendeurComp></VendeurComp>
      <FooterComp></FooterComp>
    </div>
  );
}
export default VendeurPage;
