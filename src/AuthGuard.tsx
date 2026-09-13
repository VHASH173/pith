"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);

      // Si no hay usuario y no está en /login, lo pateamos a /login
      if (!currentUser && pathname !== "/login") {
        router.push("/login");
      }
      
      // Si ya hay usuario y está en /login, lo mandamos al chat
      if (currentUser && pathname === "/login") {
        router.push("/");
      }
    });

    return () => unsubscribe();
  }, [pathname, router]);

  // Mientras Firebase revisa si hay sesión, mostramos un fondo oscuro (evita el parpadeo blanco)
  if (loading) {
    return <div className="min-h-screen bg-[#151515] flex items-center justify-center">
        <svg viewBox="0 0 100 100" className="w-10 h-10 fill-[#898781] animate-pulse">
           <path d="M50 0L53.5 35.5L85.5 14.5L64.5 46.5L100 50L64.5 53.5L85.5 85.5L53.5 64.5L50 100L46.5 64.5L14.5 85.5L35.5 53.5L0 50L35.5 46.5L14.5 14.5L46.5 35.5L50 0Z"/>
        </svg>
    </div>;
  }

  // Si no está logueado y la ruta no es /login, no renderizamos nada (el useEffect ya lo está redirigiendo)
  if (!user && pathname !== "/login") return null;

  return <>{children}</>;
}