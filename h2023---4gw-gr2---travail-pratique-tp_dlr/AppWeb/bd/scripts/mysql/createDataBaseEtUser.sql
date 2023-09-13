CREATE DATABASE carfinderdata;

CREATE USER 'adminscott'@'%' IDENTIFIED WITH mysql_native_password BY 'oracle';

USE carfinderdata;

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

grant all on carfinderdata.* to 'adminscott'@'%';

FLUSH PRIVILEGES;

INSERT INTO utilisateur (
    courriel, mot_de_passe, type_utilisateur)
VALUES
    ('raed@gmail.com', '$2a$12$KI2.YmfQdTPPxws9WFV/du.NSYN9fttEnD6pyuQms5/JGTVBwHeHy', 'user'),
    ('dina@gmail.com', '$2a$12$HyVUjd4JAg5c/Mq8XT/CouPCIIxglI0n4S4GIphKzF4Tl/jaj7Qo2', 'user'),
    ('luis@gmail.com', '$2a$12$vQYqqB8MsZHTujUzuaZJvulGTT8VJRUXT1aFeB6t24SqWGqsv9k5q', 'user'),
    ('jfb@icloud.com', '$2a$12$XrDh5rxYF.WLsHBmEZnUtOyPhd8l0bQ0zjcGXojF/Rw/cldLBWXdu', 'user'),
    ('rami@gmail.com', '$2a$10$GhRY/1U5Z3dI/d.gWNx7h.ZWDtzbb.nybWeNoJFrfLyD6HLVwPRRS', 'user');


INSERT INTO client (
    id_client, prenom, nom, adresse, telephone, utilisateur_id_utilisateur)
VALUES
    (1, 'Raed', 'Alkhatib', '1438 Papineau Avenue', 5148929457, 1),
    (2, 'Dina', 'Andolsi', '4330 Duke Street', 5148123137, 2),
    (3, 'Luis', 'Pineda', '3619 rue de la Gauchetière', 5142377386, 3),
    (4, 'Jean-Francois', 'Brodeur', '2500 rue Ontario Ouest', 5149536524, 4),
    (5, 'Rami', 'Assi', '2807 rue Ontario Ouest', 5142832028, 5);


INSERT INTO utilisateur_voiture(id_utilisateur, id_voiture)
VALUES 
(1, "644d6bd4e2ddc24484ab505e"), 
(2, "644d6d0ce2ddc24484ab506d"), 
(3, "644d6e18e2ddc24484ab507c"),
(4, "644d6f47e2ddc24484ab508b"),
(5, "64665404a8a4973787a92699"),
(5, "6466549ea8a4973787a9269f");

COMMIT;