
import React, { useState } from 'react';
import { ChatProvider } from '@/contexts/ChatContext';
import ChatInterface from '@/components/ChatInterface';
import ConversationSidebar from '@/components/ConversationSidebar';
import { useAuth } from '@/contexts/AuthContext';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarProvider,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { ChefHat, CalendarDays, BookOpen } from 'lucide-react';
import PantryPanel from '@/components/Pantry/PantryPanel';
import MealCalendar from '@/components/MealCalendar/MealCalendar';

const Index: React.FC = () => {
  const { user } = useAuth();
  const [currentView, setCurrentView] = useState<'chat' | 'pantry' | 'calendar'>('chat');
  const [showConversationSidebar, setShowConversationSidebar] = useState(true);
  
  const handleNewChat = () => {
    setCurrentView('chat');
  };
  
  const renderContent = () => {
    switch (currentView) {
      case 'pantry':
        return <PantryPanel />;
      case 'calendar':
        return <MealCalendar />;
      default:
        return (
          <ChatProvider>
            <div className="flex h-full">
              {/* Chat History Column */}
              {showConversationSidebar && (
                <div className="w-[270px] border-r border-border">
                  <ConversationSidebar onNewChat={handleNewChat} />
                </div>
              )}

              {/* Main Chat Area */}
              <div className="flex-1 relative">
                <ChatInterface />
              </div>
            </div>
          </ChatProvider>
        );
    }
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex h-screen w-full overflow-hidden bg-background">
        {/* Main Navigation Sidebar */}
        <Sidebar>
          <SidebarHeader className="h-14 flex items-center px-4">
            <ChefHat className="w-6 h-6 text-primary" />
            <span className="ml-2 font-semibold">Recipe Assistant</span>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => setCurrentView('chat')}
                  data-active={currentView === 'chat'}
                >
                  <BookOpen className="h-4 w-4" />
                  <span>Recipe Chat</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => setCurrentView('pantry')}
                  data-active={currentView === 'pantry'}
                >
                  <ChefHat className="h-4 w-4" />
                  <span>My Pantry</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => setCurrentView('calendar')}
                  data-active={currentView === 'calendar'}
                >
                  <CalendarDays className="h-4 w-4" />
                  <span>Meal Calendar</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className="p-4 text-xs text-muted-foreground">
            <div className="truncate">
              {user?.email}
            </div>
          </SidebarFooter>
        </Sidebar>
        <div className="flex-1 overflow-hidden">
          {renderContent()}
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;
