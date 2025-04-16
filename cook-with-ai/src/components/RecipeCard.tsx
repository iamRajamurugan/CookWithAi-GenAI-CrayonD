import React, { useState } from 'react';
import { Recipe } from '@/contexts/PreferencesContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bookmark, Clock, Heart, PlusCircle, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePreferences } from '@/contexts/PreferencesContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';

interface RecipeCardProps {
  recipe: Recipe;
  compact?: boolean;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, compact = false }) => {
  const { 
    addSavedRecipe, 
    savedRecipes, 
    addPantryItem, 
    addMealToSchedule 
  } = usePreferences();
  
  const isRecipeSaved = savedRecipes.some(r => r.id === recipe.id);
  const [isPantryModalOpen, setIsPantryModalOpen] = useState(false);
  const [isMealCalendarOpen, setIsMealCalendarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedMealType, setSelectedMealType] = useState<'breakfast' | 'lunch' | 'dinner'>('lunch');

  const handleAddToPantry = () => {
    recipe.ingredients.forEach(ingredient => {
      addPantryItem({ 
        ingredient_name: ingredient, 
        quantity: '1', 
        category: 'Other' 
      });
    });
    setIsPantryModalOpen(false);
  };

  const handleAddToMealCalendar = () => {
    if (selectedDate) {
      addMealToSchedule({
        date: selectedDate.toISOString().split('T')[0],
        meal_type: selectedMealType,
        recipe_id: recipe.id || '',
        recipe_name: recipe.name
      });
      setIsMealCalendarOpen(false);
    }
  };

  const defaultImage = "/placeholder.svg";
  
  return (
    <>
      <Card className={cn("recipe-card", compact ? "max-w-xs" : "max-w-md")}>
        <div className="relative">
          <img 
            src={recipe.image || defaultImage}
            alt={recipe.name}
            className="w-full h-48 object-cover"
          />
          <button 
            className={cn(
              "absolute top-2 right-2 p-2 rounded-full bg-white/80 backdrop-blur-sm",
              isRecipeSaved ? "text-recipe-orange" : "text-muted-foreground"
            )}
            onClick={() => addSavedRecipe(recipe)}
          >
            <Heart className={cn("h-5 w-5", isRecipeSaved && "fill-recipe-orange")} />
          </button>
        </div>
        
        <CardHeader className="p-4 pb-2">
          <div className="flex justify-between items-start">
            <h3 className="font-bold text-lg line-clamp-2">{recipe.name}</h3>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span className="text-sm">{recipe.cookTime} min</span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-1 mt-2">
            {recipe.dietaryCategories.map((category) => (
              <Badge key={category} variant="outline" className="bg-recipe-sage/30">
                {category}
              </Badge>
            ))}
            <Badge className="bg-recipe-light-green/20">
              {recipe.cuisineType}
            </Badge>
          </div>
        </CardHeader>
        
        {!compact && (
          <CardContent className="p-4 pt-2">
            <div className="grid grid-cols-2 gap-4 mb-3">
              <div className="text-center p-2 bg-muted/30 rounded">
                <div className="text-sm text-muted-foreground">Calories</div>
                <div className="font-medium">{recipe.nutrition.calories}</div>
              </div>
              <div className="text-center p-2 bg-muted/30 rounded">
                <div className="text-sm text-muted-foreground">Protein</div>
                <div className="font-medium">{recipe.nutrition.protein}g</div>
              </div>
            </div>
            
            <h4 className="font-semibold text-sm mb-1">Ingredients</h4>
            <ul className="text-sm space-y-1 ml-5 list-disc">
              {recipe.ingredients.slice(0, 4).map((ingredient, idx) => (
                <li key={idx}>{ingredient}</li>
              ))}
              {recipe.ingredients.length > 4 && (
                <li className="text-muted-foreground">+ {recipe.ingredients.length - 4} more</li>
              )}
            </ul>
          </CardContent>
        )}
        
        <CardFooter className="p-4 pt-2 flex justify-between">
          <Button 
            variant="outline" 
            className="mr-2"
            onClick={() => setIsPantryModalOpen(true)}
          >
            <PlusCircle className="mr-2 h-4 w-4" /> Add to Pantry
          </Button>
          <Button 
            variant="default"
            onClick={() => setIsMealCalendarOpen(true)}
          >
            <Calendar className="mr-2 h-4 w-4" /> Add to Meal Plan
          </Button>
        </CardFooter>
      </Card>

      <Dialog open={isPantryModalOpen} onOpenChange={setIsPantryModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Ingredients to Pantry</DialogTitle>
            <DialogDescription>
              Add all ingredients from {recipe.name} to your pantry.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {recipe.ingredients.map((ingredient, index) => (
              <div key={index} className="flex items-center">
                {ingredient}
              </div>
            ))}
          </div>
          <Button onClick={handleAddToPantry}>Confirm Add to Pantry</Button>
        </DialogContent>
      </Dialog>

      <Dialog open={isMealCalendarOpen} onOpenChange={setIsMealCalendarOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add to Meal Calendar</DialogTitle>
            <DialogDescription>
              Select a date and meal type for {recipe.name}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <CalendarComponent 
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
            />
            <div className="flex justify-center space-x-2">
              {['breakfast', 'lunch', 'dinner'].map(mealType => (
                <Button 
                  key={mealType}
                  variant={selectedMealType === mealType ? 'default' : 'outline'}
                  onClick={() => setSelectedMealType(mealType as 'breakfast' | 'lunch' | 'dinner')}
                >
                  {mealType.charAt(0).toUpperCase() + mealType.slice(1)}
                </Button>
              ))}
            </div>
          </div>
          <Button onClick={handleAddToMealCalendar}>Add to Meal Plan</Button>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default RecipeCard;
