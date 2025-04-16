
import React from 'react';
import { format, startOfWeek, addDays } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MealScheduleItem } from '@/types/pantry';
import { useToast } from '@/hooks/use-toast';
import { pantryService } from '@/services/pantryService';

const MealCalendar: React.FC = () => {
  const [date, setDate] = React.useState<Date>(new Date());
  const [meals, setMeals] = React.useState<MealScheduleItem[]>([]);
  const { toast } = useToast();

  const loadMeals = async () => {
    try {
      const startDate = format(startOfWeek(date), 'yyyy-MM-dd');
      const endDate = format(addDays(startOfWeek(date), 6), 'yyyy-MM-dd');
      const data = await pantryService.getMealSchedule(startDate, endDate);
      
      // Convert data to ensure meal_type is properly typed
      const typedMeals: MealScheduleItem[] = data.map(meal => ({
        ...meal,
        meal_type: meal.meal_type as 'breakfast' | 'lunch' | 'dinner'
      }));
      
      setMeals(typedMeals);
    } catch (error) {
      console.error('Error loading meals:', error);
      toast({
        title: 'Error',
        description: 'Failed to load meal schedule.',
        variant: 'destructive',
      });
    }
  };

  React.useEffect(() => {
    loadMeals();
  }, [date]);

  return (
    <div className="flex flex-col h-full p-4">
      <div className="flex gap-4">
        <div className="flex-1">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(newDate) => newDate && setDate(newDate)}
            className="rounded-md border"
          />
        </div>
        <ScrollArea className="flex-1">
          <div className="space-y-4">
            {['breakfast', 'lunch', 'dinner'].map((mealType) => {
              const meal = meals.find(
                (m) => 
                  m.meal_type === mealType && 
                  format(new Date(m.date), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
              );

              return (
                <div
                  key={mealType}
                  className="p-4 rounded-lg border bg-card"
                >
                  <h3 className="font-semibold capitalize mb-2">{mealType}</h3>
                  {meal ? (
                    <div className="space-y-2">
                      <p>{meal.recipe_name}</p>
                      {meal.notes && (
                        <p className="text-sm text-muted-foreground">{meal.notes}</p>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No meal planned</p>
                  )}
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default MealCalendar;
