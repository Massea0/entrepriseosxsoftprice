import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@/components/ui/command';
import {
  Home,
  Settings,
  Users,
  FileText,
  BarChart3,
  Search,
  ArrowRight,
  Sparkles,
  Clock,
  Star,
  Zap,
  Moon,
  Sun,
  ChevronRight
} from 'lucide-react';
import { useTheme } from 'next-themes';

interface CommandPaletteProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export function CommandPalette({ open, setOpen }: CommandPaletteProps) {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const [search, setSearch] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  const runCommand = useCallback((command: () => void) => {
    setOpen(false);
    command();
  }, [setOpen]);

  const saveRecentSearch = (query: string) => {
    if (!query.trim()) return;
    const updated = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <div className="relative">
        <CommandInput
          placeholder="Rechercher ou taper une commande..."
          value={search}
          onValueChange={setSearch}
          className="h-12 text-base"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
          <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-gray-200 dark:border-gray-700 bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100">
            <span className="text-xs">⌘</span>K
          </kbd>
        </div>
      </div>

      <CommandList className="max-h-[400px]">
        <CommandEmpty className="py-6 text-center text-sm">
          <div className="flex flex-col items-center gap-2">
            <Search className="h-8 w-8 text-muted-foreground/50" />
            <p>Aucun résultat trouvé</p>
            <p className="text-xs text-muted-foreground">
              Essayez une autre recherche
            </p>
          </div>
        </CommandEmpty>

        {/* Recent searches */}
        {!search && recentSearches.length > 0 && (
          <>
            <CommandGroup heading="Recherches récentes">
              {recentSearches.map((query, index) => (
                <CommandItem
                  key={index}
                  value={query}
                  onSelect={() => {
                    setSearch(query);
                    saveRecentSearch(query);
                  }}
                  className="group"
                >
                  <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span className="flex-1">{query}</span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
          </>
        )}

        {/* Quick actions */}
        <CommandGroup heading="Actions rapides">
          <CommandItem
            value="home dashboard"
            onSelect={() => runCommand(() => navigate('/admin/dashboard'))}
            className="group"
          >
            <Home className="mr-2 h-4 w-4" />
            <span className="flex-1">Aller au tableau de bord</span>
            <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
          </CommandItem>
          
          <CommandItem
            value="synapse ai voice"
            onSelect={() => runCommand(() => navigate('/synapse'))}
            className="group"
          >
            <Sparkles className="mr-2 h-4 w-4 text-purple-500" />
            <span className="flex-1">Ouvrir Synapse IA</span>
            <span className="ml-2 text-xs bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded-full">
              Nouveau
            </span>
          </CommandItem>

          <CommandItem
            value="settings configuration"
            onSelect={() => runCommand(() => navigate('/admin/config'))}
            className="group"
          >
            <Settings className="mr-2 h-4 w-4" />
            <span className="flex-1">Configuration système</span>
            <CommandShortcut>⌘S</CommandShortcut>
          </CommandItem>

          <CommandItem
            value="analytics reports"
            onSelect={() => runCommand(() => navigate('/admin/reports'))}
            className="group"
          >
            <BarChart3 className="mr-2 h-4 w-4" />
            <span className="flex-1">Voir les rapports</span>
            <CommandShortcut>⌘R</CommandShortcut>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        {/* Navigation */}
        <CommandGroup heading="Navigation">
          <CommandItem
            value="projects"
            onSelect={() => runCommand(() => navigate('/projects'))}
          >
            <FileText className="mr-2 h-4 w-4" />
            Projets
          </CommandItem>
          
          <CommandItem
            value="employees team"
            onSelect={() => runCommand(() => navigate('/employees'))}
          >
            <Users className="mr-2 h-4 w-4" />
            Équipe
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        {/* Theme */}
        <CommandGroup heading="Thème">
          <CommandItem
            value="light theme"
            onSelect={() => runCommand(() => setTheme('light'))}
          >
            <Sun className="mr-2 h-4 w-4" />
            <span className="flex-1">Mode clair</span>
            {theme === 'light' && <Star className="h-4 w-4 text-yellow-500" />}
          </CommandItem>
          
          <CommandItem
            value="dark theme"
            onSelect={() => runCommand(() => setTheme('dark'))}
          >
            <Moon className="mr-2 h-4 w-4" />
            <span className="flex-1">Mode sombre</span>
            {theme === 'dark' && <Star className="h-4 w-4 text-yellow-500" />}
          </CommandItem>
          
          <CommandItem
            value="system theme"
            onSelect={() => runCommand(() => setTheme('system'))}
          >
            <Zap className="mr-2 h-4 w-4" />
            <span className="flex-1">Thème système</span>
            {theme === 'system' && <Star className="h-4 w-4 text-yellow-500" />}
          </CommandItem>
        </CommandGroup>
      </CommandList>

      <div className="border-t p-2">
        <p className="text-xs text-muted-foreground text-center">
          Utilisez <kbd className="font-mono text-xs">↑</kbd> <kbd className="font-mono text-xs">↓</kbd> pour naviguer • 
          <kbd className="font-mono text-xs">↵</kbd> pour sélectionner • 
          <kbd className="font-mono text-xs">ESC</kbd> pour fermer
        </p>
      </div>
    </CommandDialog>
  );
}