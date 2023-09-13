/* react components */
import React from "react";
import PublierComp from "../components/PublierComp";
import NavbarComp from "../components/NavbarComp";
import FooterComp from "../components/FooterComp";

function LoginPage() {
  return (
    <div className="publier-page container-fluid bg-dark">
      <NavbarComp></NavbarComp>
      <PublierComp></PublierComp>
      <FooterComp></FooterComp>
    </div>
  );
}
export default LoginPage;
