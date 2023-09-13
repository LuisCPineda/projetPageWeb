CREATE TABLE utilisateur (
    id_utilisateur    INTEGER NOT NULL AUTO_INCREMENT,
    courriel          VARCHAR(100) NOT NULL,
    mot_de_passe      VARCHAR(100) NOT NULL,
    type_utilisateur  VARCHAR(15) NOT NULL,
    PRIMARY KEY (`id_utilisateur`)
);

CREATE TABLE client (
    id_client                   INTEGER NOT NULL AUTO_INCREMENT,
    prenom                      VARCHAR(30) NOT NULL,
    nom                         VARCHAR(30) NOT NULL,
    adresse                     VARCHAR(100) NOT NULL,
    telephone                   VARCHAR(30) NOT NULL,
    utilisateur_id_utilisateur  INTEGER,
    PRIMARY KEY (`id_client`),
    FOREIGN KEY (utilisateur_id_utilisateur) REFERENCES utilisateur(id_utilisateur)
);

CREATE UNIQUE INDEX client__idx ON
    client (
        utilisateur_id_utilisateur
    ASC );

CREATE TABLE utilisateur_voiture (
    id_utilisateur_voiture      INTEGER NOT NULL AUTO_INCREMENT,
    id_utilisateur              INTEGER NOT NULL,
    id_voiture                  VARCHAR(24) NOT NULL,  -- MongoDB ObjectId is a 24-char hexadecimal string
    PRIMARY KEY (`id_utilisateur_voiture`),
    FOREIGN KEY (id_utilisateur) REFERENCES utilisateur(id_utilisateur)
);
