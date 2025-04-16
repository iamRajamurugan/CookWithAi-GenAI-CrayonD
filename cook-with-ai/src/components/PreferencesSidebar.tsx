
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ChevronRight, ChevronLeft, Settings, BookOpen, Heart } from 'lucide-react';
import { usePreferences } from '@/contexts/PreferencesContext';
import type { DietaryPreference, CuisineType, SkillLevel } from '@/types/pantry';
import { Card, CardHeader } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import RecipeCard from './RecipeCard';

interface PreferencesSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const PreferencesSidebar: React.FC<PreferencesSidebarProps> = ({ isOpen, onToggle }) => {
  const { 
    dietaryPreferences, 
    favoriteCuisines, 
    skillLevel, 
    savedRecipes,
    setDietaryPreferences,
    setFavoriteCuisines,
    setSkillLevel 
  } = usePreferences();
  
  const [activeTab, setActiveTab] = useState('preferences');
  
  const dietaryOptions: { value: DietaryPreference; label: string }[] = [
    { value: 'vegan', label: 'Vegan' },
    { value: 'vegetarian', label: 'Vegetarian' },
    { value: 'pescatarian', label: 'Pescatarian' },
    { value: 'keto', label: 'Keto' },
    { value: 'paleo', label: 'Paleo' },
    { value: 'low-carb', label: 'Low Carb' },
    { value: 'gluten-free', label: 'Gluten Free' },
    { value: 'dairy-free', label: 'Dairy Free' },
    { value: 'none', label: 'No Restrictions' }
  ];
  
  const cuisineOptions: { value: CuisineType; label: string }[] = [
    { value: 'italian', label: 'Italian' },
    { value: 'mexican', label: 'Mexican' },
    { value: 'chinese', label: 'Chinese' },
    { value: 'japanese', label: 'Japanese' },
    { value: 'indian', label: 'Indian' },
    { value: 'thai', label: 'Thai' },
    { value: 'mediterranean', label: 'Mediterranean' },
    { value: 'american', label: 'American' },
    { value: 'french', label: 'French' }
  ];
  
  const skillLevelOptions: { value: SkillLevel; label: string }[] = [
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' }
  ];
  
  const handleDietaryChange = (value: DietaryPreference, checked: boolean) => {
    if (checked) {
      // If selecting "none", clear all other options
      if (value === 'none') {
        setDietaryPreferences(['none']);
      } else {
        // If selecting any other option, remove "none" if it exists
        const newPrefs = dietaryPreferences.filter(p => p !== 'none');
        
        // Add the new preference
        setDietaryPreferences([...newPrefs, value]);
      }
    } else {
      setDietaryPreferences(dietaryPreferences.filter(p => p !== value));
    }
  };
  
  const handleCuisineChange = (value: CuisineType, checked: boolean) => {
    if (checked) {
      setFavoriteCuisines([...favoriteCuisines, value]);
    } else {
      setFavoriteCuisines(favoriteCuisines.filter(c => c !== value));
    }
  };
  
  return (
    <div className={cn(
      "fixed top-0 right-0 h-full bg-sidebar transition-all duration-300 border-l overflow-hidden z-10",
      isOpen ? "w-80" : "w-0"
    )}>
      <div className="h-full flex flex-col min-w-[320px]">
        <div className="flex items-center justify-between p-4">
          <h2 className="font-semibold text-lg">User Preferences</h2>
          <Button variant="ghost" size="icon" onClick={onToggle}>
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
        
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="flex-1 flex flex-col"
        >
          <TabsList className="grid grid-cols-3 mx-4">
            <TabsTrigger value="preferences">
              <Settings className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Preferences</span>
            </TabsTrigger>
            <TabsTrigger value="recipes">
              <BookOpen className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Recipes</span>
            </TabsTrigger>
            <TabsTrigger value="saved">
              <Heart className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Saved</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="preferences" className="flex-1 overflow-auto p-4">
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-medium mb-2">Dietary Restrictions</h3>
                <div className="grid grid-cols-2 gap-y-2">
                  {dietaryOptions.map(option => (
                    <div key={option.value} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`dietary-${option.value}`}
                        checked={dietaryPreferences.includes(option.value)}
                        onCheckedChange={(checked) => 
                          handleDietaryChange(option.value, checked === true)
                        }
                      />
                      <Label htmlFor={`dietary-${option.value}`} className="text-sm">
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-base font-medium mb-2">Favorite Cuisines</h3>
                <div className="grid grid-cols-2 gap-y-2">
                  {cuisineOptions.map(option => (
                    <div key={option.value} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`cuisine-${option.value}`}
                        checked={favoriteCuisines.includes(option.value)}
                        onCheckedChange={(checked) => 
                          handleCuisineChange(option.value, checked === true)
                        }
                      />
                      <Label htmlFor={`cuisine-${option.value}`} className="text-sm">
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-base font-medium mb-2">Cooking Skill Level</h3>
                <RadioGroup value={skillLevel} onValueChange={(value) => setSkillLevel(value as SkillLevel)}>
                  {skillLevelOptions.map(option => (
                    <div key={option.value} className="flex items-center space-x-2">
                      <RadioGroupItem value={option.value} id={`skill-${option.value}`} />
                      <Label htmlFor={`skill-${option.value}`} className="text-sm">
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="recipes" className="flex-1 overflow-auto p-4">
            <p className="text-muted-foreground mb-4">Here are some recipe suggestions based on your preferences.</p>
            <div className="space-y-4">
              {/* Sample recipes - in a real app these would be fetched based on preferences */}
              <Card>
                <CardHeader className="p-3">
                  <h3 className="font-medium">Based on your preferences</h3>
                </CardHeader>
                <div className="px-3 pb-3">No preferences set yet</div>
              </Card>
              
              <Card>
                <CardHeader className="p-3">
                  <h3 className="font-medium">Popular recipes</h3>
                </CardHeader>
                <div className="px-3 pb-3">Loading popular recipes...</div>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="saved" className="flex-1 overflow-auto p-4">
            <h3 className="font-medium mb-2">Saved Recipes</h3>
            {savedRecipes.length > 0 ? (
              <div className="grid gap-4">
                {savedRecipes.map(recipe => (
                  <RecipeCard key={recipe.id} recipe={recipe} compact />
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">
                You haven't saved any recipes yet. When you find recipes you like, save them for easy access.
              </p>
            )}
          </TabsContent>
        </Tabs>
      </div>
      
      <Button 
        variant="outline" 
        size="icon"
        className={cn(
          "absolute top-1/2 -left-4 -translate-y-1/2 rounded-full shadow h-8 w-8 bg-background",
          !isOpen && "flex"
        )}
        onClick={onToggle}
        style={{ display: isOpen ? 'none' : 'flex' }}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default PreferencesSidebar;
