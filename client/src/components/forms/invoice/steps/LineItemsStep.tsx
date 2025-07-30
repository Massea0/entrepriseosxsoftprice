import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Trash2, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unit_price: number;
  total: number;
}

interface LineItemsStepProps {
  data: any;
  onChange: (data: any) => void;
}

export function LineItemsStep({ data, onChange }: LineItemsStepProps) {
  const [items, setItems] = useState<LineItem[]>(data.items || []);

  const addItem = () => {
    const newItem: LineItem = {
      id: `item-${Date.now()}`,
      description: '',
      quantity: 1,
      unit_price: 0,
      total: 0
    };
    const updatedItems = [...items, newItem];
    setItems(updatedItems);
    onChange({ items: updatedItems });
  };

  const updateItem = (id: string, field: keyof LineItem, value: any) => {
    const updatedItems = items.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };
        // Recalculer le total si nécessaire
        if (field === 'quantity' || field === 'unit_price') {
          updated.total = updated.quantity * updated.unit_price;
        }
        return updated;
      }
      return item;
    });
    setItems(updatedItems);
    onChange({ items: updatedItems });
  };

  const removeItem = (id: string) => {
    const updatedItems = items.filter(item => item.id !== id);
    setItems(updatedItems);
    onChange({ items: updatedItems });
  };

  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const taxAmount = subtotal * (data.tax_rate || 20) / 100;
  const total = subtotal + taxAmount;

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {items.length === 0 ? (
          <div className="text-center py-12 bg-muted/30 rounded-lg">
            <p className="text-muted-foreground mb-4">Aucun article ajouté</p>
            <Button onClick={addItem} variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Ajouter un article
            </Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-12 gap-4 text-sm font-medium text-muted-foreground mb-2">
              <div className="col-span-5">Description</div>
              <div className="col-span-2 text-right">Quantité</div>
              <div className="col-span-2 text-right">Prix unitaire</div>
              <div className="col-span-2 text-right">Total</div>
              <div className="col-span-1"></div>
            </div>

            {items.map((item, index) => (
              <div key={item.id} className="grid grid-cols-12 gap-4 items-center">
                <div className="col-span-5">
                  <Input
                    value={item.description}
                    onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                    placeholder="Description de l'article..."
                  />
                </div>
                <div className="col-span-2">
                  <Input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                    className="text-right"
                  />
                </div>
                <div className="col-span-2">
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.unit_price}
                    onChange={(e) => updateItem(item.id, 'unit_price', parseFloat(e.target.value) || 0)}
                    className="text-right"
                  />
                </div>
                <div className="col-span-2 text-right font-medium">
                  {item.total.toFixed(2)} €
                </div>
                <div className="col-span-1 text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeItem(item.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}

            <Button
              onClick={addItem}
              variant="outline"
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Ajouter un article
            </Button>
          </>
        )}
      </div>

      <div className="border-t pt-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Sous-total HT</span>
          <span className="font-medium">{subtotal.toFixed(2)} €</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">TVA ({data.tax_rate || 20}%)</span>
          <span className="font-medium">{taxAmount.toFixed(2)} €</span>
        </div>
        <div className="flex justify-between text-lg font-semibold pt-2 border-t">
          <span>Total TTC</span>
          <span>{total.toFixed(2)} €</span>
        </div>
      </div>
    </div>
  );
}