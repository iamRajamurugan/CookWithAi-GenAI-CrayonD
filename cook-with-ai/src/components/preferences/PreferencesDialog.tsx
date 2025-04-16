
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { useUserPreferences } from "@/contexts/UserPreferencesContext";

interface PreferencesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PreferencesDialog: React.FC<PreferencesDialogProps> = ({ open, onOpenChange }) => {
  const { preferences, updatePreference, savePreferences, resetPreferences } = useUserPreferences();

  const handleSave = async () => {
    await savePreferences();
    onOpenChange(false);
  };

  const handleReset = () => {
    resetPreferences();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>User Preferences</DialogTitle>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          {/* Theme Selection */}
          <div className="grid gap-2">
            <Label htmlFor="theme" className="text-left font-medium">
              Theme
            </Label>
            <RadioGroup
              value={preferences.theme}
              onValueChange={(value) => updatePreference("theme", value as "light" | "dark" | "system")}
              className="flex flex-col space-y-1"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="light" id="theme-light" />
                <Label htmlFor="theme-light">Light</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="dark" id="theme-dark" />
                <Label htmlFor="theme-dark">Dark</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="system" id="theme-system" />
                <Label htmlFor="theme-system">System Default</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Font Size */}
          <div className="grid gap-2">
            <Label htmlFor="fontSize" className="text-left font-medium">
              Font Size
            </Label>
            <RadioGroup
              value={preferences.fontSize}
              onValueChange={(value) => updatePreference("fontSize", value as "small" | "medium" | "large")}
              className="flex flex-col space-y-1"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="small" id="font-small" />
                <Label htmlFor="font-small">Small</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="medium" id="font-medium" />
                <Label htmlFor="font-medium">Medium</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="large" id="font-large" />
                <Label htmlFor="font-large">Large</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Response Style */}
          <div className="grid gap-2">
            <Label htmlFor="responseStyle" className="text-left font-medium">
              AI Response Style
            </Label>
            <RadioGroup
              value={preferences.responseStyle}
              onValueChange={(value) => updatePreference("responseStyle", value as "concise" | "detailed")}
              className="flex flex-col space-y-1"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="concise" id="response-concise" />
                <Label htmlFor="response-concise">Concise</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="detailed" id="response-detailed" />
                <Label htmlFor="response-detailed">Detailed</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Toggle Switches */}
          <div className="grid gap-4">
            {/* Show Timestamps */}
            <div className="flex items-center justify-between">
              <Label htmlFor="show-timestamps" className="font-medium">
                Show Message Timestamps
              </Label>
              <Switch
                id="show-timestamps"
                checked={preferences.showTimestamps}
                onCheckedChange={(checked) => updatePreference("showTimestamps", checked)}
              />
            </div>

            {/* Enable Markdown */}
            <div className="flex items-center justify-between">
              <Label htmlFor="enable-markdown" className="font-medium">
                Enable Markdown Formatting
              </Label>
              <Switch
                id="enable-markdown"
                checked={preferences.enableMarkdown}
                onCheckedChange={(checked) => updatePreference("enableMarkdown", checked)}
              />
            </div>
          </div>
        </div>

        <DialogFooter className="sm:justify-between">
          <Button variant="outline" onClick={handleReset} type="button">
            Reset to Default
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save Changes</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PreferencesDialog;
