export interface Tool {
  id: string;
  name: string;
  description: string;
  categoryId: string;
  icon: string; // Lucide icon name
  tags: string[];
  popular?: boolean;
  featured?: boolean;
  isRecent?: boolean;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string; // Lucide icon name
  color: string; // Tailwind accent color (e.g., 'blue', 'purple')
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface AppStats {
  totalTools: number;
  totalCategories: number;
  totalUsersServed: string;
  uptime: string;
}
