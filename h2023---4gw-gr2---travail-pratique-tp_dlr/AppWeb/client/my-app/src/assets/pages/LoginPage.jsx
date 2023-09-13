/* react components */
import React from "react";
import LoginComp from "../components/LoginComp";
import NavbarComp from "../components/NavbarComp";
import FooterComp from "../components/FooterComp";

function LoginPage() {
  return (
    <div className="page-auth">
      <NavbarComp></NavbarComp>
      <LoginComp></LoginComp>
      <FooterComp></FooterComp>
    </div>
  );
}
export default LoginPage;
