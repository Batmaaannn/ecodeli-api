## Prérequis

- Node 18+
- Docker

## Installation

```bash
git clone git@github.com:Batmaaannn/ecodeli-api.git
```

Ajouter le CSV dans le dossier data :

- [Prestations]() <br />

```bash
make dev-setup
```

Afin de faire fonctionner l'upload de fichier, se connecter au container de Minio et créer un bucket nommé `ecodeli-dev`

## Makefile Commandes

```bash
# Démarrer le container
make dev-setup

# Stop le container
make dev-stop

# Purger le système
make dev-clean
```

## Seeds / Factories

```bash
# Pour run les fakes datas ( Prestations )
npm run seed:run
```

Pour créer des fakes datas, n'hésitez pas à suivre la procédure du lien juste en dessous ⬇️

[Pour en apprendre plus sur les seeds et factories](https://www.npmjs.com/package/typeorm-seeding)

## Guards ( Customer / ServiceAgent / DeliveryAgent / Merchant )

Par défaut toutes les routes sont sécurisées, il faut donc utiliser le decorator `@Public()` pour rendre une route disponible sans Auth.

```js
import { Public } from './auth/decorator/public.decorator';

@Public()
@Get()
getHello(): string {
return this.appService.getHello();
}
```

Il y'a également un decorator `@Roles()` qui permet de définir quel rôle est autorisé à accéder à cette route ( Customer / ServiceAgent / DeliveryAgent / Merchant )

```js
@Roles(UserType.CUSTOMER)
@Get()
findAll() {
    return this.usersService.findAll();
}
```

## Utilitaire

```bash
# Pour supprimer toutes les tables
npm run schema:drop

# Pour sync toutes les tables
npm run schema:sync
```

Il y'a également un Makefile qui peut être modifié afin d'y ajouter des commandes répétitives si nécessaire.

## Informations

### NestJs

> <http://localhost:3000>

### Swagger

> <http://localhost:3000/api>

### Minio

[Minio](https://min.io/) est un S3-like permettant de simuler le storage S3 d'OVH Cloud (ou d'AWS) <br />
Pour se connecter à l'interface graphique, se rendre sur : <br />

> <http://localhost:9000>

Les credentials sont les suivants: <br />

- username : minio
- password : minio123

Attention, il faut un bucket nommé `ecodeli-dev`
