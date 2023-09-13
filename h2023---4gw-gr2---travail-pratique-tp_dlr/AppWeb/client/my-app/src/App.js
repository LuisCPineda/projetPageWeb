/* react */
import React from "react";

/* routeur */
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

/* stylesheets */
import "./assets/stylesheets/App.css";
import "bootstrap/dist/css/bootstrap.min.css";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/* context */
import { useAuthContext } from "./context/auth-context";

/* les pages du site */
import AccueilPage from "./assets/pages/AccueilPage";
import LoginPage from "./assets/pages/LoginPage";
import SignUpPage from "./assets/pages/SignUpPage";
import TermesConditionsPage from "./assets/pages/TermesConditionsPage";
import CataloguePage from "./assets/pages/CataloguePage";
import PublierPage from "./assets/pages/PublierPage";
import RechercherPage from "./assets/pages/RechercherPage";
import VoituresParMarquePage from "./assets/pages/VoituresParMarquePage";
import DetailVoiturePage from "./assets/pages/DetailVoiturePage";
import ProfilPage from "./assets/pages/ProfilPage";
import VendeurPage from "./assets/pages/VendeurPage";
import ResultatRecherche from "./assets/pages/ResultatRecherche";
import MesMessagesPage from "./assets/pages/MesMessagesPage";

function App() {
  const { utilisateur } = useAuthContext();

  return (
    <div className="App">
      <ToastContainer position="top-left" />
      <BrowserRouter>
        <Routes>
          {/* ROUTES PUBLIQUES */}
          <Route path="/" element={<AccueilPage />} />
          <Route path="/termes-conditions" element={<TermesConditionsPage />} />
          <Route path="/catalogue" element={<CataloguePage />} />
          <Route path="/rechercher" element={<RechercherPage />} />
          <Route
            path="/recherche/:marque"
            element={<VoituresParMarquePage />}
          />
          <Route path="/vendeur/:vendeurId" element={<VendeurPage />} />
          <Route path="/voiture/:voitureId" element={<DetailVoiturePage />} />
          <Route path="/resultatRecherche?" element={<ResultatRecherche />} />
          {/* ROUTES PROTEGÉES */}
          <Route
            path="/login"
            element={utilisateur ? <Navigate to="/" /> : <LoginPage />}
          />
          <Route
            path="/signup"
            element={utilisateur ? <Navigate to="/" /> : <SignUpPage />}
          />
          <Route
            path="/publier"
            element={utilisateur ? <PublierPage /> : <Navigate to="/login" />}
          />
          <Route
            path="/profil"
            element={utilisateur ? <ProfilPage /> : <Navigate to="/login" />}
          />
          <Route
            path="/mes-messages"
            element={
              utilisateur ? <MesMessagesPage /> : <Navigate to="/login" />
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
