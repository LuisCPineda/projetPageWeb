# CarFinder

## Objectif

CarFinder est une plateforme en ligne dédiée à la vente de voitures d'occasion. Elle offre une interface conviviale qui permet aux utilisateurs de publier des annonces de voitures, de rechercher des voitures et d'interagir avec les vendeurs.
Fonctionnalités

- S'inscrire / Se connecter : Les utilisateurs peuvent créer un compte et se connecter pour accéder à toutes les fonctionnalités.
- Publier une voiture : Les utilisateurs peuvent créer une nouvelle annonce pour une voiture qu'ils souhaitent vendre.
- Consulter les voitures : Les voitures disponibles à la vente peuvent être consultées sur la plateforme.
- Rechercher une voiture : Les utilisateurs peuvent rechercher une voiture en fonction de différents critères.
- Modifier/Supprimer un compte : Les utilisateurs peuvent modifier ou supprimer leur compte.
- Modifier/Supprimer une voiture : Les annonces de voitures peuvent être modifiées ou supprimées par les utilisateurs.
- Envoyer un message à un vendeur : Les utilisateurs intéressés peuvent contacter directement les vendeurs via la plateforme.

## Installation

### Étape 1: Clonage du dépôt

#### Clonez ce dépôt sur votre machine locale en utilisant la commande suivante :

`git clone https://github.com/BdeB-2CW/h2023---4gw-gr2---travail-pratique-tp_dlr.git`

#### Accédez au dossier du projet :

`cd h2023---4gw-gr2---travail-pratique-tp_dlr`

### Étape 2: Démarrage des conteneurs Docker

#### Assurer vous d'avoir Docker, la dernière version, téléchargé. Si vous ne l'avez pas déjà fait, vous pouvez le télécharger [ici](https://www.docker.com/products/docker-desktop/).

#### Pour installer le conteneur MySQL, exécutez les commandes suivantes dans le terminal :

```
docker pull mysql/mysql-server:latest
docker run -d -p 3306:3306 --name mysql-server -e MYSQL_ROOT_PASSWORD=oracle -e MYSQL_DATABASE=scott -e MYSQL_USER=scott -e MYSQL_PASSWORD=oracle mysql/mysql-server:latest
```

#### Ensuite, exécutez le script CreateDatabasesEtUser qui se trouve dans le répertoire mysql pour configurer votre base de données.

`docker exec -i mysql-server mysql -u root -p root < path/on/host/to/h2023---4gw-gr2---travail-pratique-tp_dlr/bd/scripts/mysql/createDataBaseEtUser.sql`

#### Ou vous pouvez copier-coller le script qui se trouve dans bd/scripts/mysql/ dans le shell de votre conteneur MYSQL

```
cd bd/scripts/mysql/
createDataBaseEtUser.sql <!-- Copier le script qui se trouve ici -->
docker exec -it mysql-server bash
mysql -u root -p
<!-- Coller votre script ici -->
```

#### Pour démarrer le conteneur MongoDB, exécutez les commandes suivantes :

```
docker pull mongo:latest
docker run -d -p 27017:27017 --name=mongo-server mongo:latest
```

#### Accédez au répertoire api et exécutez la commande suivante pour peupler votre base de données :

```
cd /AppWeb/api/
npm run seed
```

### Étape 3: Démarrage du serveur et du client

#### Assurer vous d'avoir node js, la dernière version, téléchargé. Si vous ne l'avez pas déjà fait, vous pouvez le télécharger [ici](https://nodejs.org/en/download).

#### Accédez au répertoire api et exécutez les commandes suivantes pour démarrer le serveur :

```
cd /AppWeb/api
npm install
npm start
```

#### Ensuite, accédez au répertoire client et exécutez les mêmes commandes pour démarrer le client React :

```
cd /AppWeb/client/app-web
npm install
npm start
```

#### Enfin, ouvrez votre navigateur et accédez à http://localhost:3000 pour voir l'application en action.

## Technologies utilisées

- Docker
- React.js
- Node.js
- Express.js
- MongoDB
- MySQL

## Contact

#### Si vous avez des questions, n'hésitez pas à nous contacter sur carfinderDEV@carfinder.com
