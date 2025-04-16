
import { supabase } from "@/integrations/supabase/client";
import { PantryItem, MealScheduleItem } from "@/types/pantry";

export const pantryService = {
  // Pantry Items
  async addPantryItem(item: PantryItem) {
    const { data: userData } = await supabase.auth.getUser();
    const user_id = userData.user?.id;
    
    if (!user_id) throw new Error("User must be logged in to add pantry items");
    
    const itemWithUserId = { ...item, user_id };
    
    const { data, error } = await supabase
      .from('pantry_items')
      .insert(itemWithUserId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getPantryItems() {
    const { data: userData } = await supabase.auth.getUser();
    const user_id = userData.user?.id;
    
    if (!user_id) throw new Error("User must be logged in to view pantry items");
    
    const { data, error } = await supabase
      .from('pantry_items')
      .select('*')
      .eq('user_id', user_id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async deletePantryItem(itemId: string) {
    const { error } = await supabase
      .from('pantry_items')
      .delete()
      .eq('id', itemId);

    if (error) throw error;
  },

  // Meal Schedule
  async addMealToSchedule(meal: MealScheduleItem) {
    const { data: userData } = await supabase.auth.getUser();
    const user_id = userData.user?.id;
    
    if (!user_id) throw new Error("User must be logged in to add meal to schedule");
    
    const mealWithUserId = { ...meal, user_id };
    
    const { data, error } = await supabase
      .from('meal_schedule')
      .insert(mealWithUserId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getMealSchedule(startDate?: string, endDate?: string) {
    const { data: userData } = await supabase.auth.getUser();
    const user_id = userData.user?.id;
    
    if (!user_id) throw new Error("User must be logged in to view meal schedule");
    
    let query = supabase
      .from('meal_schedule')
      .select('*')
      .eq('user_id', user_id)
      .order('date', { ascending: true });

    if (startDate && endDate) {
      query = query
        .gte('date', startDate)
        .lte('date', endDate);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data;
  },

  async deleteMealFromSchedule(mealId: string) {
    const { error } = await supabase
      .from('meal_schedule')
      .delete()
      .eq('id', mealId);

    if (error) throw error;
  }
};
