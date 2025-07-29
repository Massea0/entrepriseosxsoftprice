import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import {
  Search,
  Filter,
  Download,
  SortAsc,
  SortDesc,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Column<T> {
  key: keyof T;
  title: string;
  sortable?: boolean;
  filterable?: boolean;
  render?: (value: unknown, row: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  title?: string;
  searchable?: boolean;
  exportable?: boolean;
  actions?: {
    view?: (row: T) => void;
    edit?: (row: T) => void;
    delete?: (row: T) => void;
    custom?: Array<{
      label: string;
      icon?: React.ReactNode;
      onClick: (row: T) => void;
      variant?: 'default' | 'destructive';
    }>;
  };
  variant?: 'default' | 'enterprise' | 'minimal';
  className?: string;
  emptyState?: {
    title: string;
    description: string;
    action?: {
      label: string;
      onClick: () => void;
    };
  };
}

export function DataTable<T extends Record<string, unknown>>({
  data,
  columns,
  title,
  searchable = true,
  exportable = false,
  actions,
  variant = 'default',
  className,
  emptyState
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{
    key: keyof T | null;
    direction: 'asc' | 'desc';
  }>({ key: null, direction: 'asc' });
  const [filters, setFilters] = useState<Record<string, string>>({});

  // Filtrage et tri des données
  const processedData = useMemo(() => {
    let filtered = data;

    // Recherche globale
    if (searchTerm) {
      filtered = filtered.filter(row =>
        Object.values(row).some(value =>
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Filtres par colonne
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        filtered = filtered.filter(row =>
          String(row[key]).toLowerCase().includes(value.toLowerCase())
        );
      }
    });

    // Tri
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        const aValue = a[sortConfig.key!];
        const bValue = b[sortConfig.key!];
        
        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return filtered;
  }, [data, searchTerm, sortConfig, filters]);

  const handleSort = (key: keyof T) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleExport = () => {
    const csv = [
      columns.map(col => col.title).join(','),
      ...processedData.map(row =>
        columns.map(col => String(row[col.key] || '')).join(',')
      )
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title || 'data'}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'enterprise':
        return 'bg-gradient-to-br from-card via-card/95 to-card/90 border shadow-medium';
      case 'minimal':
        return 'bg-card border-border/50 shadow-sm';
      default:
        return 'bg-card border-border shadow-lg';
    }
  };

  const hasActions = actions && (actions.view || actions.edit || actions.delete || actions.custom?.length);

  return (
    <Card className={cn('overflow-hidden', getVariantStyles(), className)}>
      {(title || searchable || exportable) && (
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            {title && (
              <CardTitle className="text-xl font-semibold">{title}</CardTitle>
            )}
            
            <div className="flex items-center gap-3 w-full sm:w-auto">
              {searchable && (
                <div className="relative flex-1 sm:flex-initial">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full sm:w-64"
                  />
                </div>
              )}
              
              {exportable && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExport}
                  className="whitespace-nowrap"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Exporter
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
      )}

      <CardContent className="p-0">
        {processedData.length === 0 ? (
          <div className="text-center py-12">
            {emptyState ? (
              <div>
                <h3 className="text-lg font-medium text-muted-foreground mb-2">
                  {emptyState.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {emptyState.description}
                </p>
                {emptyState.action && (
                  <Button onClick={emptyState.action.onClick}>
                    {emptyState.action.label}
                  </Button>
                )}
              </div>
            ) : (
              <p className="text-muted-foreground">Aucune donnée disponible</p>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b">
                  {columns.map((column) => (
                    <TableHead
                      key={String(column.key)}
                      className={cn(
                        'font-semibold',
                        column.sortable && 'cursor-pointer hover:bg-muted/50 transition-colors',
                        column.className
                      )}
                      onClick={() => column.sortable && handleSort(column.key)}
                    >
                      <div className="flex items-center gap-2">
                        <span>{column.title}</span>
                        {column.sortable && (
                          <div className="flex flex-col">
                            <SortAsc className={cn(
                              'h-3 w-3',
                              sortConfig.key === column.key && sortConfig.direction === 'asc'
                                ? 'text-primary'
                                : 'text-muted-foreground'
                            )} />
                            <SortDesc className={cn(
                              'h-3 w-3 -mt-1',
                              sortConfig.key === column.key && sortConfig.direction === 'desc'
                                ? 'text-primary'
                                : 'text-muted-foreground'
                            )} />
                          </div>
                        )}
                      </div>
                    </TableHead>
                  ))}
                  {hasActions && <TableHead className="w-12">Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {processedData.map((row, index) => (
                  <TableRow
                    key={index}
                    className="border-b hover:bg-muted/30 transition-colors"
                  >
                    {columns.map((column) => (
                      <TableCell
                        key={String(column.key)}
                        className={cn('py-3', column.className)}
                      >
                        {column.render
                          ? column.render(row[column.key], row)
                          : String(row[column.key] || '')
                        }
                      </TableCell>
                    ))}
                    {hasActions && (
                      <TableCell className="py-3">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40">
                            {actions?.view && (
                              <DropdownMenuItem onClick={() => actions.view!(row)}>
                                <Eye className="h-4 w-4 mr-2" />
                                Voir
                              </DropdownMenuItem>
                            )}
                            {actions?.edit && (
                              <DropdownMenuItem onClick={() => actions.edit!(row)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Modifier
                              </DropdownMenuItem>
                            )}
                            {actions?.custom?.map((action, idx) => (
                              <DropdownMenuItem
                                key={idx}
                                onClick={() => action.onClick(row)}
                                className={action.variant === 'destructive' ? 'text-destructive' : ''}
                              >
                                {action.icon && <span className="mr-2">{action.icon}</span>}
                                {action.label}
                              </DropdownMenuItem>
                            ))}
                            {(actions?.view || actions?.edit || actions?.custom?.length) && actions?.delete && (
                              <DropdownMenuSeparator />
                            )}
                            {actions?.delete && (
                              <DropdownMenuItem
                                onClick={() => actions.delete!(row)}
                                className="text-destructive"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Supprimer
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}