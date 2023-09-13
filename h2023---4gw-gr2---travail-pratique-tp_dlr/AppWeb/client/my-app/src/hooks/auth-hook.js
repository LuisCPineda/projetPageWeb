import { useState, useCallback, useEffect } from "react";
import jwtDecode from "jwt-decode";

const useAuth = () => {
  // on utilise le hook useState pour stocker l'utilisateur authentifié
  const [utilisateur, setUtilisateur] = useState(
    JSON.parse(localStorage.getItem("utilisateur")) || null
  );

  //function qui permet de se connecter
  const login = async (values) => {
    try {
      //requete vers la bd
      const reponse = await fetch("http://localhost:8000/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
        credentials: "include", //pour permettre l'acces aux cookies
      });
      const reponseData = await reponse.json();
      reponseData.ok = reponse.ok;

      //si la connexion est reussie (status 200), on mets a jour le state utilisateur avec ses infos
      if (reponse.ok) {
        setUtilisateur(reponseData);
      }
      return reponseData;
    } catch (err) {
      console.log(err);
    }
  };

  //function qui verifie si le token est expiré
  const isTokenExpired = (token) => {
    try {
      const decoded = jwtDecode(token);
      if (decoded.exp < Date.now() / 1000) {
        // verifie si la date d'expiration est inferieure à la date actuelle
        return true;
      } else return false;
    } catch (err) {
      return false;
    }
  };

  //function qui permet de se deconnecter
  const logout = useCallback(() => {
    try {
      fetch("http://localhost:8000/user/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error(err);
    }
    // on vide le state utilisateur
    setUtilisateur(null);
  }, []);

  //on verifie si le token est expiré et si oui, on logout
  useEffect(() => {
    if (utilisateur && isTokenExpired(utilisateur.token)) {
      logout();
    }
  }, [utilisateur, logout]);

  //mets a jour le state utilisateur dans le localStorage a chaque fois que celui-ci change
  useEffect(() => {
    localStorage.setItem("utilisateur", JSON.stringify(utilisateur));
  }, [utilisateur]);

  return { utilisateur, login, logout };
};

export default useAuth;
