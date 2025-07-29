import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AIContextType {
  isLoading: boolean;
  suggestions: string[];
  currentModule: string;
  insights: any[];
  refreshContext: () => void;
}

const AIContext = createContext<AIContextType>({
  isLoading: false,
  suggestions: [],
  currentModule: 'general',
  insights: [],
  refreshContext: () => {}
});

export const useAIContext = () => useContext(AIContext);

interface AIContextProviderProps {
  children: ReactNode;
}

export const AIContextProvider: React.FC<AIContextProviderProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [currentModule, setCurrentModule] = useState('general');
  const [insights, setInsights] = useState<any[]>([]);

  const refreshContext = () => {
    setIsLoading(true);
    // Simulate AI context refresh
    setTimeout(() => {
      setSuggestions([
        'Optimiser les performances du dashboard',
        'Analyser les tendances des ventes',
        'Suggérer des améliorations UI'
      ]);
      setIsLoading(false);
    }, 1000);
  };

  useEffect(() => {
    refreshContext();
  }, []);

  return (
    <AIContext.Provider value={{
      isLoading,
      suggestions,
      currentModule,
      insights,
      refreshContext
    }}>
      {children}
    </AIContext.Provider>
  );
};