
import React, { useState } from 'react';
import { Header } from './Header';
import { EnhancedGlobalVoiceAssistant } from '@/components/ai/EnhancedGlobalVoiceAssistant';
import { useAuth } from '@/contexts/AuthContext';
import FloatingSidebar from './FloatingSidebar';
import { CommandPalette } from '@/components/ui/CommandPalette';

interface AppLayoutProps {
  children: React.ReactNode;
}

function AppLayout({ children }: AppLayoutProps) {
  const { user } = useAuth();
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  // Global keyboard shortcut for command palette
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCommandPaletteOpen((open) => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0A0B0E]">
      <FloatingSidebar />
      <div className="ml-[312px] transition-all duration-300">
        <Header />
        <main className="p-6">
          {children}
        </main>
      </div>
      
      {/* Assistant vocal global */}
      <EnhancedGlobalVoiceAssistant userId={user?.id} />
      
      {/* Command Palette Global */}
      <CommandPalette open={commandPaletteOpen} setOpen={setCommandPaletteOpen} />
    </div>
  );
}

export { AppLayout };
export default AppLayout;
