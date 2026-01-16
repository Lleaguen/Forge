// import { createContext, ReactNode, useContext, useEffect, useState } from 'react'
// import { api } from '../../shared/api/axios'

// type User = {
//   id: string
//   email: string
// }

// type AuthContextType = {
//   user: User | null
//   loading: boolean
//   logout: () => Promise<void>
// }

// const AuthContext = createContext<AuthContextType | null>(null)

// export function AuthProvider({ children }: { children: ReactNode }) {
//   const [user, setUser] = useState<User | null>(null)
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     api.get('/auth/me')
//       .then(res => setUser(res.data))
//       .finally(() => setLoading(false))
//   }, [])

//   const logout = async () => {
//     await api.post('/auth/logout')
//     setUser(null)
//   }

//   return (
//     <AuthContext.Provider value={{ user, loading, logout }}>
//       {children}
//     </AuthContext.Provider>
//   )
// }

// export function useAuth() {
//   const ctx = useContext(AuthContext)
//   if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
//   return ctx
// }
// providers/AuthProvider.tsx (ejemplo mínimo de test)
import React, { createContext, useContext, useEffect, useState } from "react";

type AuthContext = {
  user: null | { id: string; name?: string };
  loading: boolean;
  setUser: (u: any) => void;
};

const AuthContext = createContext<AuthContext | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<null | { id: string }>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // simula lectura de storage / validación
    const t = setTimeout(() => {
      const stored = null; // cambiar a un objeto para simular user logueado
      setUser(stored);
      setLoading(false); // OBLIGATORIO: siempre setear false
    }, 300);

    return () => clearTimeout(t);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
