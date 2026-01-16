// import { ReactNode } from 'react'
// import { Navigate } from 'react-router-dom'
// import { useAuth } from '../providers/AuthProvider'

// export function AuthGuard({ children }: { children: ReactNode }) {
//   const { user, loading } = useAuth()

//   if (loading) {
//     return <div>Loading...</div> // o spinner
//   }

//   if (!user) {
//     return <Navigate to="/login" replace />
//   }

//   return <>{children}</>
// }
// export function GuestGuard({ children }: { children: ReactNode }) {
//   const { user, loading } = useAuth()

//   if (loading) return null
//   if (user) return <Navigate to="/dashboard" replace />

//   return <>{children}</>
// }   

import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider";

function DebugBox({ user, loading }: { user: any; loading: boolean }) {
  return (
    <div style={{ position: "fixed", right: 8, top: 8, zIndex: 9999, padding: 8, background: "white", border: "1px solid #eee" }}>
      <div><strong>Auth debug</strong></div>
      <div>loading: {String(loading)}</div>
      <div>user: {user ? "yes" : "no"}</div>
    </div>
  );
}

export function AuthGuard({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const loc = useLocation();

  // debug console
  console.log("[AuthGuard] location:", loc.pathname, "loading:", loading, "user:", user);

  if (loading) {
    return (
      <>
        <div>Loading auth…</div>
        <DebugBox user={user} loading={loading} />
      </>
    );
  }

  if (!user) {
    // si ya está en /login, no redirigir a /login (evita loop) — redirigir a /login solo si no estamos ya ahi
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      {children}
      <DebugBox user={user} loading={loading} />
    </>
  );
}

export function GuestGuard({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const loc = useLocation();

  console.log("[GuestGuard] location:", loc.pathname, "loading:", loading, "user:", user);

  if (loading) {
    return (
      <>
        <div>Loading auth…</div>
        <DebugBox user={user} loading={loading} />
      </>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <>
      {children}
      <DebugBox user={user} loading={loading} />
    </>
  );
}
