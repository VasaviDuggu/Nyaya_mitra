import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserProfile, UserDocument, authApi } from '../services/authApi';

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  userDocuments: UserDocument[];
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  setSession: (token: string, user: UserProfile) => void;
  logout: () => void;
  reloadUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('nyayamitra_token'));
  const [userDocuments, setUserDocuments] = useState<UserDocument[]>([]);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  const setSession = (newToken: string, newUser: UserProfile) => {
    localStorage.setItem('nyayamitra_token', newToken);
    setToken(newToken);
    setUser(newUser);
    closeAuthModal();
  };

  const logout = () => {
    localStorage.removeItem('nyayamitra_token');
    setToken(null);
    setUser(null);
    setUserDocuments([]);
  };

  const reloadUserData = async () => {
    const savedToken = localStorage.getItem('nyayamitra_token');
    if (!savedToken) return;
    try {
      const res = await authApi.fetchCurrentUser(savedToken);
      if (res.user) {
        setUser(res.user);
        if (res.documents) setUserDocuments(res.documents);
      }
    } catch (err) {
      console.warn("Session expired:", err);
      logout();
    }
  };

  useEffect(() => {
    if (token) {
      reloadUserData();
    }
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        userDocuments,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        setSession,
        logout,
        reloadUserData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
