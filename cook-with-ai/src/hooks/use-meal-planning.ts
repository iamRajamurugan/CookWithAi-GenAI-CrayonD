
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { pantryService } from '@/services/pantryService';
import { MealScheduleItem } from '@/types/pantry';

export const useMealPlanning = () => {
  const { toast } = useToast();
  const [isPlanning, setIsPlanning] = useState(false);

  const planMeal = async (recipeName: string, date: Date, mealType: 'breakfast' | 'lunch' | 'dinner' = 'dinner') => {
    setIsPlanning(true);
    try {
      const meal: MealScheduleItem = {
        recipe_name: recipeName,
        date: date.toISOString().split('T')[0],
        meal_type: mealType,
        recipe_id: `generated_${Date.now()}`, // Placeholder ID for generated recipes
      };

      await pantryService.addMealToSchedule(meal);

      toast({
        title: "Meal Planned!",
        description: `${recipeName} has been added to your meal calendar for ${meal.date}`,
      });

      return true;
    } catch (error) {
      console.error('Error planning meal:', error);
      toast({
        title: "Error",
        description: "Failed to plan meal. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsPlanning(false);
    }
  };

  return {
    planMeal,
    isPlanning
  };
};
