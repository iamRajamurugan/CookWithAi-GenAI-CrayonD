
// Export interfaces and types using proper export syntax
export interface PantryItem {
  id?: string;
  user_id?: string; // Added user_id field for Supabase
  ingredient_name: string;
  quantity?: string;
  category?: string;
  created_at?: string;
}

export interface MealScheduleItem {
  id?: string;
  user_id?: string; // Added user_id field for Supabase
  date: string;
  meal_type: 'breakfast' | 'lunch' | 'dinner';
  recipe_id: string;
  recipe_name: string;
  notes?: string;
}

// Add these types to support the PreferencesSidebar component
export type DietaryPreference = 'vegan' | 'vegetarian' | 'pescatarian' | 'keto' | 'paleo' | 'low-carb' | 'gluten-free' | 'dairy-free' | 'none';
export type CuisineType = 'italian' | 'mexican' | 'chinese' | 'japanese' | 'indian' | 'thai' | 'mediterranean' | 'american' | 'french';
export type SkillLevel = 'beginner' | 'intermediate' | 'advanced';

// Expanded Recipe interface with required properties
export interface Recipe {
  id?: string;
  name: string;
  image?: string;
  ingredients: string[];
  cookTime?: string;
  nutrition?: {
    calories: string;
    protein: string;
  };
  dietaryCategories?: string[];
  cuisineType?: string;
  pantryMatch?: number;
}
