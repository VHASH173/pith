"use client";

import { useState, useEffect } from "react";
import { auth, db } from "../firebase"; 
import { collection, addDoc, serverTimestamp, query, orderBy, onSnapshot } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { 
  Plus, FolderClosed, Layers, Code2, SlidersHorizontal, 
  Mic, ArrowUp, ChevronDown, PenLine 
} from "lucide-react";

// Definimos a nuestros 5 genios
const personas = [
  { id: "hydra", name: "Hydra", role: "Ingeniería & Desarrollo", icon: Code2, color: "text-blue-400" },
  { id: "kali", name: "Kali", role: "Diseño, 3D & Gaming", icon: Layers, color: "text-purple-400" },
  { id: "magnus", name: "Magnus", role: "Negocios & Finanzas", icon: FolderClosed, color: "text-emerald-400" },
  { id: "may", name: "May", role: "Academia & Ciencia", icon: PenLine, color: "text-amber-400" },
  { id: "aura", name: "Aura", role: "Marketing & Copywriting", icon: Mic, color: "text-rose-400" },
];

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [inputValue, setInputValue] = useState("");
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const [activePersona, setActivePersona] = useState(personas[0]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // 1. Detectar quién es el usuario logueado
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // 2. Escuchar la base de datos en tiempo real para cargar el historial en la barra lateral
  useEffect(() => {
    if (!user) return;

    // Buscamos los chats específicos de este usuario, ordenados por fecha
    const q = query(collection(db, "users", user.uid, "chats"), orderBy("createdAt", "desc"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const chats = snapshot.docs.map(doc => ({
        id: doc.id,
        title: doc.data().title || "Nuevo Chat",
        ...doc.data()
      }));
      setChatHistory(chats);
    });

    return () => unsubscribe();
  }, [user]);

  // 3. Función para guardar un nuevo mensaje en Firebase
  const handleSendMessage = async () => {
    if (!inputValue.trim() || !user) return;
    
    const messageText = inputValue;
    setInputValue(""); // Limpiamos la caja de texto al instante

    try {
      // Guardamos en la base de datos
      await addDoc(collection(db, "users", user.uid, "chats"), {
        title: messageText.substring(0, 30) + (messageText.length > 30 ? "..." : ""), // El título será el inicio del mensaje
        persona: activePersona.id,
        createdAt: serverTimestamp(),
        messages: [{ role: "user", content: messageText }]
      });
      console.log("Chat guardado exitosamente");
    } catch (error) {
      console.error("Error al guardar el chat:", error);
    }
  };

  // 4. Permitir enviar con la tecla Enter
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex h-screen bg-[#151515] text-[#f0efec] font-sans selection:bg-[#898781]/30">
      
      {/* Barra Lateral Profesional */}
      <aside className="w-[288px] flex-shrink-0 bg-[#151515] hidden md:flex flex-col border-r border-[#ffffff0a]">
         <div className="p-4 flex flex-col gap-4">
            <div className="flex items-center gap-3 px-2">
                <svg viewBox="0 0 100 100" className="w-6 h-6 fill-[#898781]">
                   <path d="M50 0L53.5 35.5L85.5 14.5L64.5 46.5L100 50L64.5 53.5L85.5 85.5L53.5 64.5L50 100L46.5 64.5L14.5 85.5L35.5 53.5L0 50L35.5 46.5L14.5 14.5L46.5 35.5L50 0Z"/>
                </svg>
                <span className="font-serif font-bold text-xl tracking-tight">Pitch Black</span>
            </div>
            <button className="flex items-center gap-2 bg-[#20201f] hover:bg-[#2a2a29] text-[#f0efec] px-4 py-2.5 rounded-lg border border-[#ffffff1a] transition-colors text-sm font-medium shadow-md">
               <Plus className="w-4 h-4" /> Nuevo Chat
            </button>
         </div>
         
         <div className="flex-1 overflow-y-auto px-4 pb-4 mt-6">
            <div className="flex justify-between items-center px-3 mb-2">
               <span className="text-xs text-[#52514e] font-medium tracking-wide">TUS CHATS</span>
               <SlidersHorizontal className="w-3 h-3 text-[#52514e] cursor-pointer hover:text-[#f0efec] transition-colors" />
            </div>
            
            {/* AQUÍ SE RENDERIZAN LOS CHATS DESDE FIREBASE */}
            {chatHistory.length === 0 ? (
               <div className="flex flex-col items-center justify-center h-24 px-4 text-center mt-4">
                 <p className="text-[13px] text-[#52514e]">Aún no hay chats.</p>
               </div>
            ) : (
               <div className="space-y-1">
                 {chatHistory.map((chat) => (
                   <p key={chat.id} className="text-[13px] text-[#898781] hover:bg-[#20201f] hover:text-[#f0efec] px-3 py-2 rounded-lg cursor-pointer truncate transition-colors flex items-center gap-2">
                     <span className={`w-1.5 h-1.5 rounded-full ${personas.find(p => p.id === chat.persona)?.color.replace('text-', 'bg-') || 'bg-[#898781]'}`}></span>
                     {chat.title}
                   </p>
                 ))}
               </div>
            )}
         </div>
      </aside>

      {/* Área Principal */}
      <main className="flex-1 flex flex-col relative h-full bg-[#151515]">
        <div className="flex-1 overflow-y-auto p-4 md:p-8 flex flex-col items-center justify-center">
          <div className="w-full max-w-[44rem] flex flex-col gap-6 items-center">
             
             <div className="text-center font-serif text-[clamp(2rem,1.5rem+3vw,3rem)] mb-8 font-light flex items-center justify-center gap-4 transition-all">
               <activePersona.icon className={`w-[0.8em] h-[0.8em] ${activePersona.color} drop-shadow-lg opacity-80`} />
               Habla con {activePersona.name}
             </div>

             <div className="w-full bg-[#20201f] border border-[#ffffff0a] rounded-2xl shadow-2xl transition-colors relative flex flex-col ring-1 ring-white/5 focus-within:ring-white/10">
                
                <div className="flex items-center justify-between px-3 pt-3 relative">
                   <button 
                     onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                     className="text-[#f0efec] bg-[#2a2a29] px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2 shadow-sm border border-white/5 hover:bg-[#333332] transition-colors"
                   >
                     <activePersona.icon className={`w-4 h-4 ${activePersona.color}`} /> 
                     {activePersona.name}
                     <ChevronDown className="w-3 h-3 text-[#898781] ml-1" />
                   </button>

                   {isDropdownOpen && (
                     <div className="absolute top-12 left-3 w-64 bg-[#1a1a19] border border-[#ffffff1a] rounded-xl shadow-2xl z-50 overflow-hidden ring-1 ring-black/50">
                        <div className="px-3 py-2 border-b border-[#ffffff0a]">
                           <p className="text-xs text-[#898781] font-semibold tracking-wide">SELECCIONA UN ESPECIALISTA</p>
                        </div>
                        <div className="flex flex-col p-1">
                           {personas.map((p) => (
                              <button 
                                key={p.id}
                                onClick={() => { setActivePersona(p); setIsDropdownOpen(false); }}
                                className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-left transition-colors ${activePersona.id === p.id ? 'bg-[#2a2a29]' : 'hover:bg-[#20201f]'}`}
                              >
                                 <div className="flex items-center gap-3">
                                    <p.icon className={`w-[18px] h-[18px] ${p.color}`} />
                                    <div>
                                       <p className="text-[#f0efec] text-sm font-medium">{p.name}</p>
                                       <p className="text-[#898781] text-xs">{p.role}</p>
                                    </div>
                                 </div>
                              </button>
                           ))}
                        </div>
                     </div>
                   )}
                </div>

                <textarea 
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full bg-transparent resize-none text-[15px] outline-none placeholder-[#52514e] text-[#f0efec] px-4 py-4 max-h-96 min-h-[72px]"
                  placeholder={`Pídele a ${activePersona.name} que cree algo increíble...`}
                  rows={2}
                ></textarea>
                
                <div className="flex justify-between items-center px-3 pb-3">
                   <div className="flex gap-2">
                      <button className="text-[#52514e] hover:text-[#f0efec] transition-colors p-1"><Plus className="w-[18px] h-[18px]" /></button>
                   </div>
                   <div className="flex items-center gap-3">
                      <span className="text-[#52514e] text-[13px] font-medium hidden sm:block">Modo: {activePersona.role}</span>
                      <button 
                        onClick={handleSendMessage}
                        className={`p-2 rounded-lg transition-colors ml-2 shadow-md ${inputValue.trim() ? 'bg-[#f0efec] text-[#151515] hover:bg-[#e1e0d9]' : 'bg-[#2a2a29] text-[#52514e] cursor-not-allowed'}`}
                      >
                         <ArrowUp className="w-[18px] h-[18px]" />
                      </button>
                   </div>
                </div>
             </div>
             
          </div>
        </div>
      </main>
    </div>
  );
}