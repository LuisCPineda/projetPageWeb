#!/bin/bash

# Demarer le serveur mongo
docker start mongo-server

# Changer le répertoire courant au répertoire du serveur
cd ./api

# Télécharger les dépendances du serveur
npm install

# Remplir la base de données
npm run seed

# Commencer le serveur
npm start &

# Changer le répertoire courant au répertoire de l'application
cd ../client/my-app

# Télécharger les dépendances de l'application
npm install

# Commencer l'application
npm start