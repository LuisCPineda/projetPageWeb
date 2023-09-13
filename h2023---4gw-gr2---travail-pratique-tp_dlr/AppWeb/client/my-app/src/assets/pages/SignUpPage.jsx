/* react components */
import React from "react";
import SignUpComp from "../components/SignUpComp";
import NavbarComp from "../components/NavbarComp";
import FooterComp from "../components/FooterComp";

function SignUpPage() {
  return (
    <div className="page-auth">
      <NavbarComp></NavbarComp>
      <SignUpComp></SignUpComp>
      <FooterComp></FooterComp>
    </div>
  );
}
export default SignUpPage;
