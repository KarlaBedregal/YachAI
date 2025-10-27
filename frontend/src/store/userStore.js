import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useUserStore = create(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      
      logout: () => set({ user: null, isAuthenticated: false }),
      
      updateUserScore: (points) => {
        const currentUser = get().user;
        if (currentUser) {
          const newScore = currentUser.total_score + points;
          const newLevel = Math.max(1, Math.floor(newScore / 100) + 1);
          
          set({
            user: {
              ...currentUser,
              total_score: newScore,
              level: newLevel,
            },
          });
        }
      },
    }),
    {
      name: 'user-storage',
    }
  )
);
