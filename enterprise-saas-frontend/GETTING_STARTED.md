# 🚀 GUIDE DE DÉMARRAGE - ENTERPRISE SAAS FRONTEND

## 📋 Prérequis

### Outils Nécessaires
- Node.js 18+ (recommandé: 20.10.0)
- pnpm 8+ (plus rapide que npm/yarn)
- Git
- VS Code ou Cursor
- Chrome/Edge pour le développement

### Extensions VS Code Recommandées
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- TypeScript Vue Plugin
- Auto Rename Tag
- Error Lens

## 🎯 Étapes d'Initialisation

### 1. Créer le Projet Next.js

```bash
cd enterprise-saas-frontend
pnpx create-next-app@latest . --typescript --tailwind --app --src-dir --import-alias "@/*"

# Répondre aux questions:
# ✓ Would you like to use ESLint? → Yes
# ✓ Would you like to use `src/` directory? → Yes
# ✓ Would you like to use App Router? → Yes
# ✓ Would you like to customize the default import alias? → No
```

### 2. Installer les Dépendances Core

```bash
# Core dependencies
pnpm add @tanstack/react-query@5.17.0 zustand@4.4.7 @supabase/supabase-js@2.39.3
pnpm add react-hook-form@7.48.2 zod@3.22.4 @hookform/resolvers@3.3.4
pnpm add recharts@2.10.3 date-fns@3.0.6 clsx@2.1.0 tailwind-merge@2.2.0
pnpm add framer-motion@10.18.0 @radix-ui/react-slot@1.0.2

# Dev dependencies
pnpm add -D @types/node@20.10.6 prettier@3.1.1 eslint-config-prettier@9.1.0
pnpm add -D @storybook/react@7.6.7 @storybook/nextjs@7.6.7
pnpm add -D vitest@1.1.3 @vitejs/plugin-react@4.2.1 @testing-library/react@14.1.2
```

### 3. Configuration TypeScript Strict

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
    },
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true,
    "allowUnreachableCode": false,
    "allowUnusedLabels": false
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### 4. Structure de Dossiers

```bash
mkdir -p src/{app,components,lib,hooks,types,styles,services}
mkdir -p src/components/{ui,features,layouts}
mkdir -p src/lib/{api,utils,constants}
mkdir -p src/app/{(auth)/(dashboard)/(public),api}
```

### 5. Configuration Prettier

```json
// .prettierrc
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "all",
  "printWidth": 100,
  "plugins": ["prettier-plugin-tailwindcss"],
  "tailwindConfig": "./tailwind.config.ts"
}
```

### 6. Configuration ESLint

```json
// .eslintrc.json
{
  "extends": [
    "next/core-web-vitals",
    "prettier"
  ],
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-explicit-any": "error",
    "react/no-unescaped-entities": "off"
  }
}
```

### 7. Variables d'Environnement

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 🎨 Premiers Fichiers à Créer

### 1. Design Tokens CSS

```css
/* src/styles/tokens.css */
@layer base {
  :root {
    /* Colors */
    --color-background: 255 255 255;
    --color-foreground: 0 0 0;
    --color-primary: 59 130 246;
    --color-secondary: 107 114 128;
    --color-success: 34 197 94;
    --color-warning: 245 158 11;
    --color-error: 239 68 68;
    
    /* Spacing */
    --spacing-1: 0.25rem;
    --spacing-2: 0.5rem;
    --spacing-3: 0.75rem;
    --spacing-4: 1rem;
    --spacing-5: 1.25rem;
    --spacing-6: 1.5rem;
    --spacing-8: 2rem;
    
    /* Radius */
    --radius-sm: 0.125rem;
    --radius-md: 0.375rem;
    --radius-lg: 0.5rem;
    --radius-xl: 0.75rem;
    --radius-full: 9999px;
  }
  
  .dark {
    --color-background: 10 10 10;
    --color-foreground: 255 255 255;
  }
}
```

### 2. Utility Functions

```typescript
// src/lib/utils/cn.ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

### 3. Premier Composant Button

```typescript
// src/components/ui/button.tsx
import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils/cn';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        danger: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        sm: 'h-8 rounded-md px-3 text-xs',
        md: 'h-10 px-4 py-2',
        lg: 'h-12 rounded-md px-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
```

## 🚀 Commandes de Développement

```bash
# Développement
pnpm dev

# Build production
pnpm build

# Analyser le bundle
pnpm build && pnpm analyze

# Lancer Storybook
pnpm storybook

# Tests
pnpm test
pnpm test:watch

# Linting
pnpm lint
pnpm format
```

## 📊 Checklist de Démarrage

- [ ] Projet Next.js initialisé
- [ ] TypeScript strict configuré
- [ ] Dépendances installées
- [ ] Structure de dossiers créée
- [ ] ESLint & Prettier configurés
- [ ] Design tokens définis
- [ ] Premier composant créé
- [ ] Git repository initialisé
- [ ] README.md mis à jour

## 🎯 Prochaines Étapes

1. **Créer les composants primitifs**
   - Input, Select, Checkbox
   - Card, Container, Grid
   - Toast, Modal, Alert

2. **Setup Supabase Auth**
   - Client configuration
   - Auth context
   - Protected routes

3. **Créer le layout principal**
   - Sidebar navigation
   - Header avec user menu
   - Theme switcher

4. **Implémenter le premier dashboard**
   - Admin dashboard
   - Métriques principales
   - Graphiques temps réel

## 💡 Conseils

### Performance
- Utilisez `dynamic` imports pour le code splitting
- Optimisez les images avec `next/image`
- Utilisez `React.memo` avec parcimonie
- Préférez CSS aux animations JS

### Qualité
- Commitez souvent avec des messages clairs
- Écrivez des tests pour les composants critiques
- Documentez les décisions importantes
- Faites des code reviews régulières

### Architecture
- Gardez les composants simples et focused
- Évitez la sur-abstraction
- Utilisez des custom hooks pour la logique réutilisable
- Séparez la logique métier de l'UI

---

**Prêt à construire le futur du SaaS enterprise ! 🚀**