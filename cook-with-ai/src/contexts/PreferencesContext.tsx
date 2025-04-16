
import React, { createContext, useState, useContext } from 'react';
import type { PantryItem, MealScheduleItem, Recipe, DietaryPreference, CuisineType, SkillLevel } from '@/types/pantry';

interface PreferencesContextType {
  savedRecipes: Recipe[];
  pantryItems: PantryItem[];
  mealSchedule: MealScheduleItem[];
  dietaryPreferences: DietaryPreference[];
  favoriteCuisines: CuisineType[];
  skillLevel: SkillLevel;
  addSavedRecipe: (recipe: Recipe) => void;
  addPantryItem: (item: PantryItem) => void;
  removePantryItem: (itemId: string) => void;
  addMealToSchedule: (meal: MealScheduleItem) => void;
  removeMealFromSchedule: (mealId: string) => void;
  setDietaryPreferences: (preferences: DietaryPreference[]) => void;
  setFavoriteCuisines: (cuisines: CuisineType[]) => void;
  setSkillLevel: (level: SkillLevel) => void;
}

export const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined);

export const PreferencesProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([]);
  const [pantryItems, setPantryItems] = useState<PantryItem[]>([]);
  const [mealSchedule, setMealSchedule] = useState<MealScheduleItem[]>([]);
  const [dietaryPreferences, setDietaryPreferences] = useState<DietaryPreference[]>([]);
  const [favoriteCuisines, setFavoriteCuisines] = useState<CuisineType[]>([]);
  const [skillLevel, setSkillLevel] = useState<SkillLevel>('intermediate');

  const addSavedRecipe = (recipe: Recipe) => {
    setSavedRecipes([...savedRecipes, recipe]);
  };

  const addPantryItem = (item: PantryItem) => {
    setPantryItems([...pantryItems, item]);
  };

  const removePantryItem = (itemId: string) => {
    setPantryItems(pantryItems.filter(item => item.id !== itemId));
  };

  const addMealToSchedule = (meal: MealScheduleItem) => {
    setMealSchedule([...mealSchedule, meal]);
  };

  const removeMealFromSchedule = (mealId: string) => {
    setMealSchedule(mealSchedule.filter(meal => meal.id !== mealId));
  };

  return (
    <PreferencesContext.Provider 
      value={{
        savedRecipes, 
        pantryItems,
        mealSchedule,
        dietaryPreferences,
        favoriteCuisines,
        skillLevel,
        addSavedRecipe,
        addPantryItem,
        removePantryItem,
        addMealToSchedule,
        removeMealFromSchedule,
        setDietaryPreferences,
        setFavoriteCuisines,
        setSkillLevel
      }}
    >
      {children}
    </PreferencesContext.Provider>
  );
};

export const usePreferences = () => {
  const context = useContext(PreferencesContext);
  if (context === undefined) {
    throw new Error('usePreferences must be used within a PreferencesProvider');
  }
  return context;
};

// Re-export types from pantry.ts for convenience
export type { DietaryPreference, CuisineType, SkillLevel, Recipe } from '@/types/pantry';
