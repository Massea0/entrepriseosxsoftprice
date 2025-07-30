# 📦 INVENTAIRE COMPLET DES COMPOSANTS UI

## 🎨 Design System Foundation

### 🎯 Design Tokens
```css
/* Colors */
--gray-50: #f9fafb;
--gray-100: #f3f4f6;
--gray-200: #e5e7eb;
--gray-300: #d1d5db;
--gray-400: #9ca3af;
--gray-500: #6b7280;
--gray-600: #4b5563;
--gray-700: #374151;
--gray-800: #1f2937;
--gray-900: #111827;
--gray-950: #030712;

--blue-50: #eff6ff;
--blue-500: #3b82f6;
--blue-600: #2563eb;
--blue-700: #1d4ed8;

--green-50: #f0fdf4;
--green-500: #22c55e;
--green-600: #16a34a;

--red-50: #fef2f2;
--red-500: #ef4444;
--red-600: #dc2626;

--amber-50: #fffbeb;
--amber-500: #f59e0b;
--amber-600: #d97706;

/* Spacing */
--space-0: 0;
--space-1: 0.25rem;
--space-2: 0.5rem;
--space-3: 0.75rem;
--space-4: 1rem;
--space-5: 1.25rem;
--space-6: 1.5rem;
--space-8: 2rem;
--space-10: 2.5rem;
--space-12: 3rem;
--space-16: 4rem;

/* Typography */
--font-sans: 'Inter', -apple-system, system-ui, sans-serif;
--font-mono: 'JetBrains Mono', monospace;

--text-xs: 0.75rem;
--text-sm: 0.875rem;
--text-base: 1rem;
--text-lg: 1.125rem;
--text-xl: 1.25rem;
--text-2xl: 1.5rem;
--text-3xl: 1.875rem;
--text-4xl: 2.25rem;

/* Animations */
--duration-fast: 150ms;
--duration-normal: 300ms;
--duration-slow: 500ms;
--easing: cubic-bezier(0.4, 0, 0.2, 1);
```

## 🧩 Composants Primitifs

### 1. Button
```typescript
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'ghost' | 'danger' | 'link';
  size: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
}
```
**Utilisation**: Actions principales, formulaires, navigation

### 2. Input
```typescript
interface InputProps {
  type: 'text' | 'email' | 'password' | 'number' | 'date' | 'search';
  label?: string;
  placeholder?: string;
  error?: string;
  icon?: ReactNode;
  disabled?: boolean;
  required?: boolean;
}
```
**Utilisation**: Formulaires, recherche, filtres

### 3. Select
```typescript
interface SelectProps {
  options: Array<{ value: string; label: string }>;
  multiple?: boolean;
  searchable?: boolean;
  placeholder?: string;
  error?: string;
}
```
**Utilisation**: Sélection d'options, filtres

### 4. Checkbox
```typescript
interface CheckboxProps {
  label: string;
  description?: string;
  disabled?: boolean;
  indeterminate?: boolean;
}
```
**Utilisation**: Options multiples, préférences

### 5. Radio
```typescript
interface RadioProps {
  options: Array<{ value: string; label: string; description?: string }>;
  orientation?: 'horizontal' | 'vertical';
}
```
**Utilisation**: Sélection unique

### 6. Switch
```typescript
interface SwitchProps {
  label: string;
  description?: string;
  disabled?: boolean;
}
```
**Utilisation**: Activation/désactivation, préférences

### 7. Textarea
```typescript
interface TextareaProps {
  label?: string;
  placeholder?: string;
  rows?: number;
  maxLength?: number;
  error?: string;
}
```
**Utilisation**: Commentaires, descriptions longues

## 📊 Composants de Layout

### 8. Container
```typescript
interface ContainerProps {
  size: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  padding?: boolean;
}
```
**Utilisation**: Conteneur principal des pages

### 9. Grid
```typescript
interface GridProps {
  cols: 1 | 2 | 3 | 4 | 6 | 12;
  gap: 'sm' | 'md' | 'lg';
  responsive?: boolean;
}
```
**Utilisation**: Mise en page responsive

### 10. Stack
```typescript
interface StackProps {
  direction?: 'horizontal' | 'vertical';
  spacing: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  align?: 'start' | 'center' | 'end';
}
```
**Utilisation**: Espacement uniforme

### 11. Card
```typescript
interface CardProps {
  padding?: 'sm' | 'md' | 'lg';
  hover?: boolean;
  border?: boolean;
  shadow?: 'sm' | 'md' | 'lg';
}
```
**Utilisation**: Regroupement de contenu

### 12. Sidebar
```typescript
interface SidebarProps {
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  position?: 'left' | 'right';
  width?: number;
}
```
**Utilisation**: Navigation principale

### 13. Header
```typescript
interface HeaderProps {
  fixed?: boolean;
  transparent?: boolean;
  height?: number;
}
```
**Utilisation**: En-tête de l'application

## 🔔 Composants de Feedback

### 14. Toast
```typescript
interface ToastProps {
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  description?: string;
  duration?: number;
  action?: { label: string; onClick: () => void };
}
```
**Utilisation**: Notifications temporaires

### 15. Modal
```typescript
interface ModalProps {
  size: 'sm' | 'md' | 'lg' | 'xl';
  title?: string;
  description?: string;
  footer?: ReactNode;
  closeOnOverlay?: boolean;
}
```
**Utilisation**: Dialogues, confirmations

### 16. Alert
```typescript
interface AlertProps {
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  description?: string;
  closable?: boolean;
  icon?: boolean;
}
```
**Utilisation**: Messages importants persistants

### 17. Progress
```typescript
interface ProgressProps {
  value: number;
  max?: number;
  size: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  color?: 'primary' | 'success' | 'warning' | 'danger';
}
```
**Utilisation**: Indicateurs de progression

### 18. Skeleton
```typescript
interface SkeletonProps {
  variant: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave';
}
```
**Utilisation**: États de chargement

### 19. Spinner
```typescript
interface SpinnerProps {
  size: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'white';
}
```
**Utilisation**: Indicateur de chargement

## 📈 Composants de Données

### 20. Table
```typescript
interface TableProps {
  columns: Array<{
    key: string;
    label: string;
    sortable?: boolean;
    width?: string;
  }>;
  data: Array<Record<string, any>>;
  selectable?: boolean;
  pagination?: boolean;
  sorting?: boolean;
  filtering?: boolean;
}
```
**Utilisation**: Affichage de données tabulaires

### 21. Pagination
```typescript
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showFirstLast?: boolean;
  siblings?: number;
}
```
**Utilisation**: Navigation dans les données

### 22. Badge
```typescript
interface BadgeProps {
  variant: 'primary' | 'success' | 'warning' | 'danger' | 'neutral';
  size: 'sm' | 'md';
  dot?: boolean;
}
```
**Utilisation**: Statuts, labels

### 23. Avatar
```typescript
interface AvatarProps {
  src?: string;
  name?: string;
  size: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  shape?: 'circle' | 'square';
  status?: 'online' | 'offline' | 'busy' | 'away';
}
```
**Utilisation**: Photos de profil, initiales

### 24. Tabs
```typescript
interface TabsProps {
  tabs: Array<{
    key: string;
    label: string;
    icon?: ReactNode;
    badge?: number;
  }>;
  orientation?: 'horizontal' | 'vertical';
}
```
**Utilisation**: Navigation entre vues

### 25. Accordion
```typescript
interface AccordionProps {
  items: Array<{
    title: string;
    content: ReactNode;
    icon?: ReactNode;
  }>;
  multiple?: boolean;
  defaultOpen?: string[];
}
```
**Utilisation**: Contenu pliable

## 📊 Composants de Visualisation

### 26. Chart
```typescript
interface ChartProps {
  type: 'line' | 'bar' | 'pie' | 'area' | 'donut';
  data: any[];
  height?: number;
  responsive?: boolean;
  showLegend?: boolean;
  showTooltip?: boolean;
}
```
**Utilisation**: Graphiques de données

### 27. StatCard
```typescript
interface StatCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    type: 'increase' | 'decrease';
  };
  icon?: ReactNode;
  color?: string;
}
```
**Utilisation**: Métriques clés

### 28. Timeline
```typescript
interface TimelineProps {
  items: Array<{
    date: Date;
    title: string;
    description?: string;
    icon?: ReactNode;
    color?: string;
  }>;
  orientation?: 'vertical' | 'horizontal';
}
```
**Utilisation**: Historique, événements

## 🎯 Composants Métier

### 29. KanbanBoard
```typescript
interface KanbanBoardProps {
  columns: Array<{
    id: string;
    title: string;
    cards: Array<any>;
  }>;
  onCardMove: (cardId: string, fromColumn: string, toColumn: string) => void;
}
```
**Utilisation**: Gestion de projets

### 30. Calendar
```typescript
interface CalendarProps {
  view: 'month' | 'week' | 'day';
  events: Array<{
    id: string;
    title: string;
    start: Date;
    end: Date;
    color?: string;
  }>;
  onEventClick?: (event: any) => void;
}
```
**Utilisation**: Planning, événements

### 31. FileUploader
```typescript
interface FileUploaderProps {
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
  onUpload: (files: File[]) => void;
  dragAndDrop?: boolean;
}
```
**Utilisation**: Upload de fichiers

### 32. SearchBar
```typescript
interface SearchBarProps {
  placeholder?: string;
  suggestions?: string[];
  onSearch: (query: string) => void;
  filters?: ReactNode;
}
```
**Utilisation**: Recherche globale

### 33. CommandPalette
```typescript
interface CommandPaletteProps {
  commands: Array<{
    id: string;
    label: string;
    icon?: ReactNode;
    shortcut?: string;
    action: () => void;
  }>;
  hotkey?: string;
}
```
**Utilisation**: Actions rapides (Cmd+K)

### 34. EmptyState
```typescript
interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
}
```
**Utilisation**: États vides

### 35. ErrorBoundary
```typescript
interface ErrorBoundaryProps {
  fallback?: ReactNode;
  onError?: (error: Error) => void;
}
```
**Utilisation**: Gestion d'erreurs

## 📱 Composants Responsive

### 36. MobileMenu
```typescript
interface MobileMenuProps {
  items: MenuItem[];
  logo?: ReactNode;
}
```
**Utilisation**: Navigation mobile

### 37. BottomSheet
```typescript
interface BottomSheetProps {
  title?: string;
  snapPoints?: number[];
  onClose: () => void;
}
```
**Utilisation**: Actions mobiles

## 🎨 Composants d'Animation (Subtils)

### 38. FadeIn
```typescript
interface FadeInProps {
  duration?: number;
  delay?: number;
  children: ReactNode;
}
```
**Utilisation**: Apparition progressive

### 39. SlideIn
```typescript
interface SlideInProps {
  direction: 'left' | 'right' | 'top' | 'bottom';
  duration?: number;
  children: ReactNode;
}
```
**Utilisation**: Entrée glissante

### 40. ScaleIn
```typescript
interface ScaleInProps {
  duration?: number;
  children: ReactNode;
}
```
**Utilisation**: Effet de zoom

## 🔐 Composants d'Authentification

### 41. LoginForm
```typescript
interface LoginFormProps {
  onSubmit: (credentials: LoginCredentials) => void;
  showRememberMe?: boolean;
  showSocialLogin?: boolean;
}
```
**Utilisation**: Connexion

### 42. RegisterForm
```typescript
interface RegisterFormProps {
  onSubmit: (data: RegisterData) => void;
  passwordRequirements?: PasswordRequirements;
}
```
**Utilisation**: Inscription

### 43. PasswordStrength
```typescript
interface PasswordStrengthProps {
  password: string;
  requirements?: PasswordRequirements;
}
```
**Utilisation**: Indicateur de force

## 🎯 Estimation de Développement

### Phase 1: Composants Primitifs (1 semaine)
- Button, Input, Select, Checkbox, Radio, Switch, Textarea
- Card, Container, Grid, Stack
- Toast, Alert, Spinner, Skeleton

### Phase 2: Composants de Layout (3 jours)
- Sidebar, Header
- Modal, Tabs, Accordion

### Phase 3: Composants de Données (1 semaine)
- Table, Pagination
- Chart, StatCard
- Avatar, Badge

### Phase 4: Composants Métier (1 semaine)
- KanbanBoard, Calendar
- FileUploader, SearchBar
- CommandPalette

### Phase 5: Finalisation (3 jours)
- Tests unitaires
- Documentation Storybook
- Optimisation performances

---

**Total estimé: ~25 jours pour l'ensemble du design system**