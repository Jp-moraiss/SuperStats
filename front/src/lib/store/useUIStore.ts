import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface UIState {
  // Loading states
  isLoading: boolean;
  loadingMessage: string;
  
  // Modal states
  isModalOpen: boolean;
  modalContent: React.ReactNode | null;
  
  // Notification states
  notifications: Array<{
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
    duration?: number;
  }>;
  
  // Actions
  setLoading: (loading: boolean, message?: string) => void;
  openModal: (content: React.ReactNode) => void;
  closeModal: () => void;
  addNotification: (notification: Omit<UIState['notifications'][0], 'id'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

export const useUIStore = create<UIState>()(
  devtools(
    (set, get) => ({
      isLoading: false,
      loadingMessage: '',
      isModalOpen: false,
      modalContent: null,
      notifications: [],
      
      setLoading: (loading, message = '') => 
        set({ 
          isLoading: loading, 
          loadingMessage: message 
        }, false, 'setLoading'),
      
      openModal: (content) => 
        set({ 
          isModalOpen: true, 
          modalContent: content 
        }, false, 'openModal'),
      
      closeModal: () => 
        set({ 
          isModalOpen: false, 
          modalContent: null 
        }, false, 'closeModal'),
      
      addNotification: (notification) => {
        const id = Math.random().toString(36).substr(2, 9);
        const newNotification = { ...notification, id };
        
        set((state) => ({
          notifications: [...state.notifications, newNotification]
        }), false, 'addNotification');
        
        // Auto remove after duration
        if (notification.duration) {
          setTimeout(() => {
            get().removeNotification(id);
          }, notification.duration);
        }
      },
      
      removeNotification: (id) => 
        set((state) => ({
          notifications: state.notifications.filter(n => n.id !== id)
        }), false, 'removeNotification'),
      
      clearNotifications: () => 
        set({ notifications: [] }, false, 'clearNotifications'),
    }),
    {
      name: 'ui-store',
    }
  )
);
