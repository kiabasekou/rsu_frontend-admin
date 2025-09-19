# 🇬🇦 RSU Frontend Admin - Registre Social Unique Gabon

## 📋 Vue d'ensemble

Interface d'administration moderne pour le **Registre Social Unique (RSU)** du projet **Gabon Digital**. Cette application React TypeScript offre une interface intuitive pour la gestion des identités et programmes sociaux du Gabon.

### 🎯 Objectifs du Projet

- **Digitalisation** des services de protection sociale gabonais
- **Centralisation** des données des bénéficiaires
- **Modernisation** de l'interface utilisateur pour les agents
- **Interopérabilité** avec le système RBPP national

## 🏗️ Architecture Technique

### Stack Technologique

- **Frontend**: React 18+ TypeScript
- **UI Library**: Material-UI (MUI) v5
- **État Global**: TanStack Query
- **Routing**: React Router v6
- **API Client**: Axios
- **Forms**: React Hook Form + Yup
- **Charts**: Recharts
- **Build Tool**: Create React App

### Structure du Projet

```
src/
├── components/          # Composants réutilisables
│   ├── layout/         # Layout principal (AppLayout)
│   └── common/         # Composants communs
├── pages/              # Pages principales
│   ├── identity/       # Gestion des identités
│   ├── programs/       # Programmes sociaux
│   └── Dashboard.tsx   # Tableau de bord
├── services/           # Services API
├── types/             # Types TypeScript
├── hooks/             # Hooks personnalisés
├── utils/             # Utilitaires
└── theme/             # Thème Material-UI
```

## 🚀 Démarrage Rapide

### Prérequis

- Node.js 16+
- npm ou yarn
- Backend Django RSU en cours d'exécution (port 8000)

### Installation

```bash
# Clone du repository
git clone https://github.com/kiabasekou/rsu_frontend-admin.git
cd rsu_frontend-admin

# Installation des dépendances
npm install

# Configuration de l'environnement
cp .env.example .env
# Modifier les variables si nécessaire

# Démarrage en mode développement
npm start

# L'application sera accessible sur http://localhost:3000
```

### Variables d'Environnement

```env
REACT_APP_API_BASE_URL=http://localhost:8000
REACT_APP_APP_NAME=RSU Admin
REACT_APP_VERSION=1.0.0
```

## 📱 Fonctionnalités

### ✅ Implémentées

- **Tableau de bord** avec statistiques en temps réel
- **Gestion des identités** (listing avec DataGrid)
- **Gestion des programmes sociaux** (CRUD basique)
- **Navigation responsive** avec sidebar
- **Interface Material-UI moderne**
- **Gestion des erreurs API**
- **Loading states** et feedback utilisateur

### 🔄 En Cours de Développement

- **Formulaires de création/édition**
- **Recherche et filtres avancés**
- **Authentification utilisateur**
- **Permissions et rôles**
- **Import/Export de données**

### 🚀 Roadmap

- **Module d'éligibilité** avec scoring ML
- **Tableaux de bord analytiques**
- **Rapports automatisés**
- **Notifications en temps réel**
- **Mode hors ligne**

## 🔌 API Integration

### Configuration Backend

Le frontend communique avec l'API Django RSU. Assurez-vous que :

1. **Backend Django** fonctionne sur `http://localhost:8000`
2. **CORS** est configuré pour accepter `http://localhost:3000`
3. **Endpoints API** sont accessibles :
   - `GET /identity/persons/` - Liste des identités
   - `GET /programs/programs/` - Liste des programmes

### Structure des Données

```typescript
interface PersonIdentity {
  id: string;
  first_name: string;
  last_name: string;
  full_name: string;
  national_id: string;
  phone_number: string;
  city: string;
  province: string;
  is_validated: boolean;
  created_at: string;
}

interface SocialProgram {
  id: string;
  code: string;
  name: string;
  program_type: string;
  total_budget: number;
  allocated_budget: number;
  current_beneficiaries: number;
  status: string;
}
```

## 🧪 Tests et Qualité

### Commandes Utiles

```bash
# Tests unitaires
npm test

# Build de production
npm run build

# Analyse du bundle
npm run analyze

# Linting TypeScript
npm run lint

# Formatage du code
npm run format
```

### Standards de Qualité

- **TypeScript strict** activé
- **ESLint + Prettier** pour le formatage
- **Tests unitaires** avec Jest/React Testing Library
- **Performance** - Code splitting et lazy loading
- **Accessibilité** - Respect des standards WCAG

## 🌍 Déploiement

### Build de Production

```bash
# Créer le build optimisé
npm run build

# Le dossier build/ contient les fichiers statiques
# prêts pour déploiement
```

### Déploiement Recommandé

- **Netlify/Vercel** pour déploiement rapide
- **AWS S3 + CloudFront** pour production
- **Docker** containerisé avec Nginx
- **Azure Static Web Apps** pour intégration Microsoft

## 👥 Équipe et Contribution

### Développement

- **Lead Dev**: Souare Ahmed (@kiabasekou)
- **Project**: Gabon Digital - Composante 3.2
- **Client**: République Gabonaise
- **Financement**: Banque Mondiale

### Contribution

1. Fork le repository
2. Créer une branche feature (`git checkout -b feature/amazing-feature`)
3. Commit les changements (`git commit -m 'Add amazing feature'`)
4. Push vers la branche (`git push origin feature/amazing-feature`)
5. Ouvrir une Pull Request

### Standards de Code

- **Commits Conventionnels**: `feat:`, `fix:`, `docs:`, etc.
- **Branches**: `feature/`, `bugfix/`, `release/`
- **Reviews**: Toute PR doit être reviewée
- **Tests**: Couverture minimale 80%

## 📄 Licence

Ce projet est sous licence MIT - voir [LICENSE](LICENSE) pour plus de détails.

## 🆘 Support

### Documentation

- **Confluence**: Documentation technique détaillée
- **API Docs**: Swagger/OpenAPI du backend Django
- **Design System**: Figma avec composants MUI

### Contact

- **Email**: souare.ahmed@gmail.com
- **Teams**: Équipe Gabon Digital
- **Issues**: GitHub Issues pour bugs et features

## 🔄 Changelog

### v1.0.0 (2024-09-18)

#### ✨ Fonctionnalités
- Interface d'administration complète
- Gestion des identités avec DataGrid
- Dashboard avec métriques
- Thème Material-UI personnalisé

#### 🐛 Corrections
- Correction erreurs TypeScript MUI v5
- Optimisation performances DataGrid
- Gestion des erreurs API

#### 📚 Documentation
- README complet
- Types TypeScript
- Configuration déploiement

---

**🇬🇦 Développé avec ❤️ pour la transformation digitale du Gabon**
