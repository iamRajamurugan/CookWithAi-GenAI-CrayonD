
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { UserPreferences, defaultPreferences } from '@/types/preferences';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from './AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface PreferencesContextType {
  preferences: UserPreferences;
  updatePreference: <K extends keyof UserPreferences>(key: K, value: UserPreferences[K]) => void;
  resetPreferences: () => void;
  savePreferences: () => Promise<void>;
}

const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined);

export const UserPreferencesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadUserPreferences();
    } else {
      // If no user, load from local storage
      const savedPreferences = localStorage.getItem('user_preferences');
      if (savedPreferences) {
        try {
          setPreferences({ ...defaultPreferences, ...JSON.parse(savedPreferences) });
        } catch (error) {
          console.error('Error parsing stored preferences:', error);
        }
      }
    }
  }, [user]);

  // Load preferences from Supabase if user is logged in
  const loadUserPreferences = async () => {
    if (!user) return;
    
    try {
      // Try to get preferences from user meta data
      const { data, error } = await supabase.auth.getUser();
      
      if (data.user && data.user.user_metadata && data.user.user_metadata.preferences) {
        setPreferences({
          ...defaultPreferences,
          ...data.user.user_metadata.preferences
        });
      } else {
        // If no preferences found, use default and save them
        savePreferencesToStorage(defaultPreferences);
      }
    } catch (error) {
      console.error('Error loading user preferences:', error);
    }
  };

  const updatePreference = <K extends keyof UserPreferences>(
    key: K, 
    value: UserPreferences[K]
  ) => {
    setPreferences(prev => {
      const updated = { ...prev, [key]: value };
      savePreferencesToStorage(updated);
      return updated;
    });
  };

  const savePreferencesToStorage = (prefs: UserPreferences) => {
    // Always save to local storage for quick access
    localStorage.setItem('user_preferences', JSON.stringify(prefs));
  };

  const savePreferences = async () => {
    try {
      if (user) {
        // Save to Supabase user metadata if logged in
        const { error } = await supabase.auth.updateUser({
          data: { preferences }
        });

        if (error) throw error;
      }

      // Save to local storage regardless of login state
      savePreferencesToStorage(preferences);

      toast({
        title: "Success",
        description: "Your preferences have been saved.",
      });
      
      return Promise.resolve();
    } catch (error) {
      console.error('Error saving preferences:', error);
      
      toast({
        title: "Error",
        description: "Failed to save preferences. Please try again.",
        variant: "destructive",
      });
      
      return Promise.reject(error);
    }
  };

  const resetPreferences = () => {
    setPreferences(defaultPreferences);
    savePreferencesToStorage(defaultPreferences);
  };

  return (
    <PreferencesContext.Provider value={{ 
      preferences, 
      updatePreference,
      resetPreferences,
      savePreferences
    }}>
      {children}
    </PreferencesContext.Provider>
  );
};

export const useUserPreferences = () => {
  const context = useContext(PreferencesContext);
  if (context === undefined) {
    throw new Error('useUserPreferences must be used within a UserPreferencesProvider');
  }
  return context;
};
