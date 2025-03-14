import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    isAdmin: boolean;
    directAdminLogin: (password: string) => Promise<void>;
    register: (email: string, password: string, name: string, displayName: string) => Promise<void>;
    resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    login: async () => { },
    logout: () => { },
    isAdmin: false,
    directAdminLogin: async () => { },
    register: async () => { },
    resetPassword: async () => { },
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(() => {
        const storedUser = localStorage.getItem('delvind_user');
        return storedUser ? JSON.parse(storedUser) : null;
    });
    const [loading, setLoading] = useState(false);

    const login = async (email: string, password: string) => {
        try {
            const users = JSON.parse(localStorage.getItem('delvind_users') || '[]');
            const foundUser = users.find((u: User) => u.email === email);

            if (!foundUser) {
                throw new Error('Usuário não encontrado');
            }

            setUser(foundUser);
            localStorage.setItem('delvind_user', JSON.stringify(foundUser));
        } catch (error) {
            console.error('Login error:', error);
            throw new Error('Credenciais inválidas');
        }
    };

    const directAdminLogin = async (password: string) => {
        if (password === 'delvind@2025') {
            const adminUser: User = {
                id: 'admin',
                email: 'admin@delvind.com',
                name: 'Administrador',
                displayName: 'Admin',
                role: 'admin',
            };

            setUser(adminUser);
            localStorage.setItem('delvind_user', JSON.stringify(adminUser));
        } else {
            throw new Error('Senha administrativa incorreta');
        }
    };

    const register = async (email: string, password: string, name: string, displayName: string) => {
        try {
            const users = JSON.parse(localStorage.getItem('delvind_users') || '[]');

            if (users.some((u: User) => u.email === email)) {
                throw new Error('Email já cadastrado');
            }

            const newUser: User = {
                id: Date.now().toString(),
                email,
                name,
                displayName,
                role: 'user',
            };

            users.push(newUser);
            localStorage.setItem('delvind_users', JSON.stringify(users));

            
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    };

    const resetPassword = async (email: string) => {
        alert('Em um ambiente real, você receberia um email para redefinir sua senha.');
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('delvind_user');
        if (user) {
            localStorage.removeItem(`delvind_reports_${user.id}`);
            localStorage.removeItem(`delvind_tasks_${user.id}`);
            localStorage.removeItem(`delvind_tickets_${user.id}`);
            localStorage.removeItem(`delvind_alerts_${user.id}`);
        }
    };

    useEffect(() => {
      const storedUser = localStorage.getItem('delvind_user');
  
      if (storedUser) {
          // Você pode adicionar uma verificação adicional, se necessário
          setUser(JSON.parse(storedUser));
      }
  }, []);


    return (
        <AuthContext.Provider value={{
            user,
            loading,
            login,
            logout,
            isAdmin: user?.role === 'admin',
            directAdminLogin,
            register,
            resetPassword
        }}>
            {children}
        </AuthContext.Provider>
    );
};