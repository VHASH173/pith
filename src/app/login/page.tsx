"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { auth, googleProvider } from "../../firebase"; 
import { signInWithPopup } from "firebase/auth";

export default function Login() {
  const router = useRouter(); // El teletransportador de Next.js
  
  // Función de Login + Redirección
  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      console.log("¡Logueado con éxito!", user.displayName);
      
      // Si salió bien, mandamos al usuario a la página principal del chat
      router.push("/");
      
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#151515] text-[#f0efec] font-sans selection:bg-[#898781]/30 relative overflow-x-hidden">
      
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-white/[0.02] blur-[120px] rounded-full pointer-events-none"></div>

      <header className="fixed top-0 left-0 w-full px-6 md:px-12 py-5 flex items-center justify-between z-50 bg-[#151515]/80 backdrop-blur-xl border-b border-[#ffffff0a]">
        <div className="flex items-center gap-3 cursor-pointer">
          <svg viewBox="0 0 100 100" className="w-[22px] h-[22px] fill-[#898781]">
             <path d="M50 0L53.5 35.5L85.5 14.5L64.5 46.5L100 50L64.5 53.5L85.5 85.5L53.5 64.5L50 100L46.5 64.5L14.5 85.5L35.5 53.5L0 50L35.5 46.5L14.5 14.5L46.5 35.5L50 0Z"/>
          </svg>
          <span className="font-serif font-medium text-[20px] tracking-tight">Pitch Black</span>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-[14px] text-[#a5a49a] font-medium">
          <a href="#" className="hover:text-[#f0efec] transition-colors flex items-center gap-1">
            Conoce Pitch Black <span className="text-[9px] opacity-60">▼</span>
          </a>
          <a href="#" className="hover:text-[#f0efec] transition-colors flex items-center gap-1">
            Plataforma <span className="text-[9px] opacity-60">▼</span>
          </a>
          <a href="#" className="hover:text-[#f0efec] transition-colors flex items-center gap-1">
            Precios <span className="text-[9px] opacity-60">▼</span>
          </a>
        </nav>

        <div>
          <button className="bg-[#f0efec] hover:bg-[#e1e0d9] text-[#151515] text-[14px] font-semibold px-5 py-2.5 rounded-xl transition-colors shadow-sm">
            Probar Pitch Black
          </button>
        </div>
      </header>

      <main className="relative w-full max-w-[1300px] mx-auto flex flex-col lg:flex-row items-center justify-between z-10 px-6 md:px-12 pt-36 pb-24 min-h-screen">
        <div className="w-full lg:w-[50%] flex flex-col items-start">
          <h1 className="text-[clamp(2.8rem,4vw+1rem,4.2rem)] font-serif mb-4 tracking-tight leading-[1.05] pitch-black-greeting">
            Cuestiona lo que viene
          </h1>
          <p className="text-[#a5a49a] text-[18px] md:text-[20px] mb-10 max-w-[90%] font-light leading-snug">
            Tu compañero de ideas para las ambiciones más oscuras y grandes.
          </p>

          <div className="w-full max-w-[380px] p-6 bg-[#1a1a19]/60 backdrop-blur-3xl border border-[#ffffff0f] rounded-[24px] shadow-2xl flex flex-col ring-1 ring-white/5">
            
            <button 
              onClick={handleGoogleSignIn}
              className="w-full flex items-center justify-center gap-3 bg-[#20201f] border border-[#ffffff0f] hover:bg-[#2a2a29] text-[#f0efec] text-[15px] font-medium py-3.5 rounded-[12px] transition-all shadow-lg hover:shadow-white/5"
            >
              <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continuar con Google
            </button>

            <div className="w-full mt-6 text-center">
               <p className="text-[12px] text-[#6d6b67] leading-relaxed px-2">
                 Al continuar, reconoces la <span className="underline decoration-[#6d6b67] underline-offset-4 cursor-pointer hover:text-[#a5a49a] transition-colors">Política de Privacidad</span> de Pitch Black.
               </p>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-[45%] flex justify-center lg:justify-end mt-16 lg:mt-0">
           <div className="relative w-full max-w-[460px] aspect-[4/5] rounded-[32px] overflow-hidden shadow-2xl ring-1 ring-white/5 bg-[#1a1a19]">
              {/* RUTA DIRECTA AL ARCHIVO EN PUBLIC */}
              <Image 
                src="/hero.jpg" 
                alt="Pitch Black IA" 
                fill 
                className="object-cover"
                priority
                unoptimized
              />
           </div>
        </div>
      </main>
    </div>
  );
}