# 🚀 Modern Frontend - Enterprise OS SaaS

## 📋 Vue d'Ensemble

Ce dossier contient le **nouveau frontend moderne** pour Enterprise OS, conçu from scratch avec les meilleures pratiques de l'industrie. Architecture inspirée des géants tech (Microsoft, Spaceship) mais adaptée pour un SaaS CRM/ERP stable et performant.

## 🏗️ Architecture

```
modern-frontend/
├── docs/                      # Documentation complète
│   ├── ARCHITECTURE.md       # Architecture détaillée
│   ├── DESIGN_SYSTEM.md      # Guide du design system
│   ├── COMPONENTS.md         # Documentation des composants
│   └── TODOS.md             # Liste des tâches complète
├── src/
│   ├── app/                 # Core de l'application
│   ├── features/           # Modules par fonctionnalité
│   ├── components/         # Composants réutilisables
│   ├── hooks/             # React hooks personnalisés
│   ├── utils/             # Fonctions utilitaires
│   ├── styles/            # Styles globaux et thèmes
│   ├── assets/            # Assets statiques
│   ├── types/             # Types TypeScript
│   └── lib/               # Intégrations tierces
├── public/                # Fichiers publics
├── tests/                 # Tests unitaires et E2E
└── config/               # Configurations
```

## 🛠️ Stack Technologique

### Core
- **React 18.3** - UI library moderne
- **TypeScript 5.5** - Type safety strict
- **Vite 5** - Build tool ultra-rapide

### Styling
- **Tailwind CSS 3.4** - Utility-first CSS
- **Framer Motion** - Animations fluides
- **Radix UI** - Composants accessibles

### State & Data
- **TanStack Query v5** - Server state management
- **Zustand** - Client state léger
- **Valtio** - State réactif local

### Routing & Forms
- **TanStack Router** - Type-safe routing
- **React Hook Form** - Gestion des formulaires
- **Zod** - Validation des schémas

### Testing & Quality
- **Vitest** - Tests unitaires
- **Playwright** - Tests E2E
- **ESLint** - Linting
- **Prettier** - Formatage

## 🎨 Design System

### Principes
1. **Stabilité avant tout** - Pas d'effets extravagants
2. **Performance optimale** - 60fps, < 1s chargement
3. **Accessibilité totale** - WCAG AAA
4. **Cohérence absolue** - Design uniforme

### Couleurs
- **Primary**: Indigo (#4f46e5)
- **Neutral**: Palette de gris équilibrée
- **Semantic**: Success, Warning, Error, Info
- **Dark/Light**: Thème adaptatif complet

### Composants (100+)
Voir `docs/COMPONENTS.md` pour la liste complète

## 🚀 Démarrage Rapide

```bash
# Installation
npm install

# Développement
npm run dev

# Build production
npm run build

# Tests
npm run test
npm run test:e2e

# Linting
npm run lint
npm run format
```

## 📁 Structure des Composants

Chaque composant suit cette structure :

```
components/ui/button/
├── button.tsx          # Composant principal
├── button.types.ts     # Types TypeScript
├── button.test.tsx     # Tests unitaires
├── button.stories.tsx  # Storybook
└── index.ts           # Exports
```

## 🔧 Configuration

### Variables d'Environnement
```env
VITE_API_URL=http://localhost:5000
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### VS Code Extensions Recommandées
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- TypeScript Vue Plugin

## 📋 Conventions de Code

### Naming
- **Composants**: PascalCase (`Button.tsx`)
- **Hooks**: useCamelCase (`useAuth.ts`)
- **Utils**: camelCase (`formatDate.ts`)
- **Types**: PascalCase avec prefix (`TUser`, `IProps`)

### Imports
```tsx
// 1. React/External
import React from 'react'
import { motion } from 'framer-motion'

// 2. Internal absolute
import { Button } from '@/components/ui'
import { useAuth } from '@/hooks'

// 3. Types
import type { ButtonProps } from './button.types'

// 4. Styles
import './button.css'
```

## 🧪 Tests

### Unit Tests
```bash
npm run test
```

### E2E Tests
```bash
npm run test:e2e
```

### Coverage
```bash
npm run test:coverage
```

## 📈 Performance

### Objectifs
- First Contentful Paint: < 1s
- Time to Interactive: < 2s
- Lighthouse Score: > 95
- Bundle Size: < 300KB initial

### Optimisations
- Code splitting par route
- Lazy loading des composants
- Images optimisées (WebP)
- Service Worker pour PWA

## 🔒 Sécurité

- JWT avec refresh tokens
- RBAC (Role-Based Access Control)
- Content Security Policy
- HTTPS obligatoire
- Sanitization des inputs

## 📚 Documentation

- `docs/ARCHITECTURE.md` - Architecture détaillée
- `docs/DESIGN_SYSTEM.md` - Guide du design system
- `docs/COMPONENTS.md` - Documentation des composants
- `docs/TODOS.md` - Liste des tâches
- `docs/API.md` - Guide d'intégration API

## 🤝 Contribution

1. Créer une branche feature
2. Commiter avec conventional commits
3. Écrire des tests
4. Créer une PR avec description

## 📄 License

Propriétaire - Enterprise OS © 2025