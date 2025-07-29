# 📋 Analyse du Projet EcoDeli - Compte Rendu Structuré

## 🎯 **Résumé Fonctionnel du Projet**

**EcoDeli** est une plateforme de crowdshipping créée en 2018 à Paris, proposant une solution de livraison collaborative où les particuliers participent au transport de colis. La société met en relation des expéditeurs (particuliers ou entreprises) avec des livreurs occasionnels validés pour assurer tout ou partie des livraisons.

**Objectifs principaux :**
- Réduire l'impact environnemental de la livraison
- Favoriser le pouvoir d'achat des livreurs
- Lutter contre l'isolement social
- Moderniser le système d'information existant

**Périmètre du projet :** Réorganisation complète du système d'information via 3 lots (gestion, services supplémentaires, infrastructure) dans le cadre d'un appel d'offre lancé le 20 février 2025.

---

## 👥 **Rôles Utilisateurs et Leurs Droits**

### **1. Livreurs Occasionnels**
- **Inscription et validation** : Dépôt de demande avec pièces justificatives
- **Gestion des annonces** : Consulter et répondre aux demandes de livraison
- **Planification** : Indiquer trajets à l'avance, gérer planning et déplacements
- **Suivi des livraisons** : Gérer toutes formes de livraisons assignées
- **Facturation** : Accès aux paiements et gestion financière personnelle

### **2. Clients Particuliers**
- **Dépôt d'annonces** : Poster des demandes de livraison avec détails
- **Réservation de services** : Accès aux prestations EcoDeli
- **Gestion des rendez-vous** : Planification avec prestataires
- **Suivi des commandes** : Traçabilité en temps réel des colis
- **Accès storage** : Informations sur les box de stockage temporaire
- **Tutorial intégré** : Guide d'utilisation lors de la première connexion

### **3. Commerçants Partenaires**
- **Gestion contractuelle** : Suivi et gestion des contrats avec EcoDeli
- **Publication d'annonces** : Proposer des services de livraison
- **Facturation** : Gestion de la facturation des services demandés
- **Suivi financier** : Accès aux paiements et historique
- **Service "lâcher de chariot"** : Livraison à domicile pour clients magasin

### **4. Prestataires de Services**
- **Validation et sélection** : Processus de recrutement et vérification des habilitations
- **Gestion du calendrier** : Disponibilités et affectation des demandes clients
- **Suivi des évaluations** : Notes et retours clients sur les prestations
- **Interventions diverses** : Gestion de tous types de services à la personne
- **Facturation automatique** : Génération mensuelle avec virement automatique

### **5. Administration Générale**
- **Supervision globale** : Vue d'ensemble de toute l'activité EcoDeli
- **Gestion utilisateurs** : Validation et administration de tous les profils
- **Suivi financier** : Revenus, charges et gestion comptable
- **Configuration système** : Paramétrage et maintenance de la plateforme

---

## ⚙️ **Fonctionnalités Principales**

### **Gestion des Livraisons**
- **Annonces de livraison** : Système de publication et consultation des demandes de transport
- **Matching automatique** : Notification aux livreurs lors de correspondance avec leurs trajets
- **Suivi temps réel** : Traçabilité complète des colis en cours de livraison
- **Livraison partielle** : Gestion des étapes intermédiaires avec stockage temporaire
- **Validation de livraison** : Système de codes de confirmation pour finaliser les livraisons

### **Services à la Personne**
- **Transport de personnes** : Accompagnement médical, déplacements quotidiens
- **Transferts aéroport** : Service de navette départ/arrivée
- **Courses personnalisées** : Achat et livraison selon liste fournie
- **Achats à l'étranger** : Import de produits spécifiques non disponibles localement
- **Services domicile** : Garde d'animaux, travaux ménagers/jardinage pendant transport

### **Gestion Financière**
- **Paiements Stripe** : Intégration complète pour toutes les transactions
- **Système d'escrow** : Conservation des fonds jusqu'à confirmation de livraison
- **Facturation automatique** : Génération PDF mensuelle pour prestataires avec virement
- **Formules d'abonnement** : Free, Starter (9,90€), Premium (19,99€) avec avantages progressifs
- **Gestion des assurances** : Couverture jusqu'à 3000€ selon formule

### **Communication et Notifications**
- **Notifications push** : Alertes via OneSignal pour activités utilisateurs
- **Système multilingue** : Support de langues multiples sans Google Translate
- **Génération PDF** : Documents automatiques (factures, contrats, devis)
- **Messagerie interne** : Communication entre utilisateurs de la plateforme

### **Outils d'Administration**
- **Validation utilisateurs** : Processus d'approbation pour livreurs et prestataires
- **Gestion des entrepôts** : 6 sites de stockage (Paris, Marseille, Lyon, Lille, Montpellier, Rennes)
- **Reporting avancé** : Tableaux de bord et statistiques d'activité
- **Support client** : Outils de gestion des demandes et incidents

---

## 🛠️ **Vue d'Ensemble Technique**

### **Architecture Applicative**
- **Application Web principale** : JavaScript/PHP avec frameworks et API
- **Back-office dédié** : Interface d'administration centralisée
- **API REST complète** : Gestion intégrale des traitements métier
- **Application mobile Android** : Accès client aux livraisons et prestations

### **Intégrations Tierces**
- **Stripe** : Traitement des paiements et transactions
- **Datadog** : Gestion des logs et monitoring
- **Services Cloud** : Stockage et infrastructure distante

### **Spécifications Techniques**
- **Serveur Web personnel** : Configuration avec réécriture d'URL et gestion d'erreurs
- **Support multilingue** : Système sans dépendance Google pour ajout de langues
- **Génération PDF** : Documents automatiques avec archivage
- **Tutorial interactif** : Overlays bloquants pour première connexion

