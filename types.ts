export interface User {
  id: string;
  name: string;
  email: string;
  isPremium: boolean;
  joinedDate: string;
}

export interface Tool {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: ToolCategory;
  icon: string;
  isPopular?: boolean;
}

export enum ToolCategory {
  FINANCE = 'Salary & Finance',
  BUSINESS = 'GST & Business',
  STUDENT = 'Student Tools',
  PDF = 'PDF Tools',
  AI = 'AI Tools'
}

export interface CalculationHistory {
  id: string;
  toolId: string;
  toolName: string;
  date: string;
  result: string;
}

export type AuthContextType = {
  user: User | null;
  login: (email: string) => void;
  logout: () => void;
  usageCount: number;
  checkUsageLimit: () => boolean;
  history: CalculationHistory[];
  addToHistory: (entry: Omit<CalculationHistory, 'id' | 'date'>) => void;
  showLoginModal: boolean;
  setShowLoginModal: (show: boolean) => void;
};