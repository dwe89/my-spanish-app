'use client';  // Add this directive to make this a client component

import React, { createContext, useContext, ReactNode, useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface UserStats {
  streak: number;
  level: number;
  xp: number;
  nextLevel: number;
  dailyGoal: number;
  totalCardsLearned: number;
  weakestCategories: string[];
  strongestCategories: string[];
  lastLoginDate?: string;
}

interface Achievement {
  id: number;
  name: string;
  description: string;
  achieved: boolean;
  date?: string;
}

interface UserContextType {
  stats: UserStats;
  updateStats: (updates: Partial<UserStats>) => void;
  achievements: Achievement[];
  unlockAchievement: (id: number) => void;
  checkDailyStreak: () => void;
  showAchievement: Achievement | null;
  setShowAchievement: React.Dispatch<React.SetStateAction<Achievement | null>>;
}

const defaultStats: UserStats = {
  streak: 0,
  level: 1,
  xp: 0,
  nextLevel: 1000,
  dailyGoal: 0,
  totalCardsLearned: 0,
  weakestCategories: [],
  strongestCategories: []
};

const defaultAchievements: Achievement[] = [
  { 
    id: 1, 
    name: '7 Day Streak', 
    description: 'Login for 7 consecutive days',
    achieved: false 
  },
  // Add more achievements as needed...
];

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [stats, setStats] = useLocalStorage<UserStats>('userStats', defaultStats);
  const [achievements, setAchievements] = useLocalStorage<Achievement[]>('achievements', defaultAchievements);
  const [showAchievement, setShowAchievement] = useState<Achievement | null>(null);

  const updateStats = (updates: Partial<UserStats>) => {
    setStats(current => {
      const newStats = { ...current, ...updates };
      
      // Check for level up
      if (newStats.xp >= newStats.nextLevel) {
        newStats.level += 1;
        newStats.nextLevel = Math.floor(newStats.nextLevel * 1.5);
      }
      
      return newStats;
    });
  };

  const unlockAchievement = (id: number) => {
    setAchievements(current =>
      current.map(achievement =>
        achievement.id === id
          ? { ...achievement, achieved: true, date: new Date().toISOString() }
          : achievement
      )
    );
    
    // Set the achievement to show
    const unlockedAchievement = achievements.find(a => a.id === id);
    if (unlockedAchievement) {
      setShowAchievement(unlockedAchievement);

      // Hide achievement after 3 seconds
      setTimeout(() => setShowAchievement(null), 3000);
    }
  };

  const checkDailyStreak = () => {
    const today = new Date().toDateString();
    
    if (stats.lastLoginDate) {
      const lastLogin = new Date(stats.lastLoginDate);
      const daysDiff = Math.floor((new Date().getTime() - lastLogin.getTime()) / (1000 * 3600 * 24));
      
      if (daysDiff === 1) {
        updateStats({ 
          streak: stats.streak + 1, 
          lastLoginDate: today 
        });
        
        // Check for streak achievement
        if (stats.streak + 1 === 7) {
          unlockAchievement(1);
        }
      } else if (daysDiff > 1) {
        updateStats({ 
          streak: 1, 
          lastLoginDate: today 
        });
      }
    } else {
      updateStats({ 
        streak: 1, 
        lastLoginDate: today 
      });
    }
  };

  return (
    <UserContext.Provider value={{
      stats,
      updateStats,
      achievements,
      unlockAchievement,
      checkDailyStreak,
      showAchievement,
      setShowAchievement
    }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
