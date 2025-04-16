
import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PantryItem } from '@/types/pantry';
import { useToast } from '@/hooks/use-toast';
import { pantryService } from '@/services/pantryService';

const PantryPanel: React.FC = () => {
  const [items, setItems] = React.useState<PantryItem[]>([]);
  const [newItem, setNewItem] = React.useState({ ingredient_name: '', quantity: '' });
  const { toast } = useToast();

  const loadPantryItems = async () => {
    try {
      const data = await pantryService.getPantryItems();
      setItems(data);
    } catch (error) {
      console.error('Error loading pantry items:', error);
      toast({
        title: 'Error',
        description: 'Failed to load pantry items.',
        variant: 'destructive',
      });
    }
  };

  React.useEffect(() => {
    loadPantryItems();
  }, []);

  const handleAddItem = async () => {
    if (!newItem.ingredient_name.trim()) return;

    try {
      await pantryService.addPantryItem(newItem);
      setNewItem({ ingredient_name: '', quantity: '' });
      loadPantryItems();
      toast({
        title: 'Success',
        description: 'Item added to pantry.',
      });
    } catch (error) {
      console.error('Error adding pantry item:', error);
      toast({
        title: 'Error',
        description: 'Failed to add item to pantry.',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteItem = async (id: string) => {
    try {
      await pantryService.deletePantryItem(id);
      loadPantryItems();
      toast({
        title: 'Success',
        description: 'Item removed from pantry.',
      });
    } catch (error) {
      console.error('Error deleting pantry item:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete item from pantry.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="flex flex-col h-full p-4">
      <div className="flex gap-4 mb-6">
        <div className="flex-1 space-y-2">
          <Label htmlFor="ingredient">Ingredient</Label>
          <Input
            id="ingredient"
            placeholder="Add ingredient..."
            value={newItem.ingredient_name}
            onChange={(e) => setNewItem(prev => ({ ...prev, ingredient_name: e.target.value }))}
          />
        </div>
        <div className="flex-1 space-y-2">
          <Label htmlFor="quantity">Quantity</Label>
          <Input
            id="quantity"
            placeholder="Optional quantity..."
            value={newItem.quantity}
            onChange={(e) => setNewItem(prev => ({ ...prev, quantity: e.target.value }))}
          />
        </div>
        <Button 
          className="self-end"
          onClick={handleAddItem}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="space-y-2">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/10"
            >
              <div>
                <p className="font-medium">{item.ingredient_name}</p>
                {item.quantity && (
                  <p className="text-sm text-muted-foreground">{item.quantity}</p>
                )}
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => item.id && handleDeleteItem(item.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default PantryPanel;
