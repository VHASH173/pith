"use client";

import { useState, useEffect, useRef } from "react";
import { auth, db } from "../firebase"; 
import { collection, addDoc, serverTimestamp, query, orderBy, onSnapshot, doc, updateDoc, arrayUnion } from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { 
  Plus, FolderClosed, Layers, Code2, SlidersHorizontal, 
  Mic, ArrowUp, ChevronDown, PenLine, LogOut, Settings
} from "lucide-react";

// --- IMPORTACIONES PARA MARKDOWN Y CÓDIGO ---
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';

const personas = [
  { id: "hydra", name: "Hydra", role: "Ingeniería & Desarrollo", icon: Code2, color: "text-blue-400" },
  { id: "kali", name: "Kali", role: "Diseño, 3D & Gaming", icon: Layers, color: "text-purple-400" },
  { id: "magnus", name: "Magnus", role: "Negocios & Finanzas", icon: FolderClosed, color: "text-emerald-400" },
  { id: "may", name: "May", role: "Academia & Ciencia", icon: PenLine, color: "text-amber-400" },
  { id: "aura", name: "Aura", role: "Marketing & Copywriting", icon: Mic, color: "text-rose-400" },
];

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [inputValue, setInputValue] = useState("");
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [activePersona, setActivePersona] = useState(personas[0]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll al último mensaje
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => setUser(currentUser));
    return () => unsubscribe();
  }, []);

  // Cargar lista de chats
  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, "users", user.uid, "chats"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const chats = snapshot.docs.map(doc => ({ id: doc.id, title: doc.data().title || "Nuevo Chat", ...doc.data() }));
      setChatHistory(chats);
    });
    return () => unsubscribe();
  }, [user]);

  // Cargar mensajes del chat actual
  useEffect(() => {
    if (!user || !currentChatId) {
      setMessages([]);
      return;
    }
    const unsubscribe = onSnapshot(doc(db, "users", user.uid, "chats", currentChatId), (docSnap) => {
      if (docSnap.exists()) {
        setMessages(docSnap.data().messages || []);
        const savedPersona = personas.find(p => p.id === docSnap.data().persona);
        if (savedPersona) setActivePersona(savedPersona);
      }
    });
    return () => unsubscribe();
  }, [user, currentChatId]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !user) return;
    const messageText = inputValue;
    setInputValue("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";

    if (currentChatId) {
      // Agregar mensaje a un chat existente
      try {
        await updateDoc(doc(db, "users", user.uid, "chats", currentChatId), {
          messages: arrayUnion({ role: "user", content: messageText })
        });
      } catch (error) { console.error("Error:", error); }
    } else {
      // Crear chat nuevo
      try {
        const docRef = await addDoc(collection(db, "users", user.uid, "chats"), {
          title: messageText.substring(0, 30) + (messageText.length > 30 ? "..." : ""),
          persona: activePersona.id,
          createdAt: serverTimestamp(),
          messages: [{ role: "user", content: messageText }]
        });
        setCurrentChatId(docRef.id);
      } catch (error) { console.error("Error:", error); }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  const handleLogout = async () => {
    try { await signOut(auth); router.push("/login"); } catch (error) { console.error(error); }
  };

  return (
    <div className="flex h-screen bg-[#151515] text-[#f0efec] font-sans selection:bg-[#898781]/30">
      
      {/* BARRA LATERAL */}
      <aside className="w-[288px] flex-shrink-0 bg-[#151515] hidden md:flex flex-col border-r border-[#ffffff0a] relative">
         <div className="p-4 flex flex-col gap-4">
            <div className="flex items-center gap-3 px-2">
                <svg viewBox="0 0 100 100" className="w-6 h-6 fill-[#898781]">
                   <path d="M50 0L53.5 35.5L85.5 14.5L64.5 46.5L100 50L64.5 53.5L85.5 85.5L53.5 64.5L50 100L46.5 64.5L14.5 85.5L35.5 53.5L0 50L35.5 46.5L14.5 14.5L46.5 35.5L50 0Z"/>
                </svg>
                <span className="font-serif font-bold text-xl tracking-tight">Pitch Black</span>
            </div>
            <button onClick={() => { setCurrentChatId(null); setInputValue(""); }} className="flex items-center gap-2 bg-[#20201f] hover:bg-[#2a2a29] text-[#f0efec] px-4 py-2.5 rounded-lg border border-[#ffffff1a] transition-colors text-sm font-medium shadow-md">
               <Plus className="w-4 h-4" /> Nuevo Chat
            </button>
         </div>

         <nav className="flex flex-col px-4 space-y-1 mb-6">
            <button className="flex items-center gap-3 w-full text-left px-3 py-2 text-[#898781] hover:bg-[#20201f] hover:text-[#f0efec] text-[14px] rounded-lg transition-colors">
              <FolderClosed className="w-[18px] h-[18px]" /> Proyectos
            </button>
            <button className="flex items-center gap-3 w-full text-left px-3 py-2 text-[#898781] hover:bg-[#20201f] hover:text-[#f0efec] text-[14px] rounded-lg transition-colors">
              <Layers className="w-[18px] h-[18px]" /> Artefactos
            </button>
         </nav>
         
         <div className="flex-1 overflow-y-auto px-4 pb-20">
            <div className="flex justify-between items-center px-3 mb-2">
               <span className="text-xs text-[#52514e] font-medium tracking-wide">TUS CHATS</span>
               <SlidersHorizontal className="w-3 h-3 text-[#52514e] cursor-pointer hover:text-[#f0efec] transition-colors" />
            </div>
            {chatHistory.length === 0 ? (
               <div className="flex flex-col items-center justify-center h-24 text-center mt-4"><p className="text-[13px] text-[#52514e]">Aún no hay chats.</p></div>
            ) : (
               <div className="space-y-1">
                 {chatHistory.map((chat) => (
                   <button key={chat.id} onClick={() => setCurrentChatId(chat.id)} className={`w-full text-left text-[13px] px-3 py-2 rounded-lg cursor-pointer truncate transition-colors flex items-center gap-2 ${currentChatId === chat.id ? 'bg-[#2a2a29] text-[#f0efec]' : 'text-[#898781] hover:bg-[#20201f] hover:text-[#f0efec]'}`}>
                     <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${personas.find(p => p.id === chat.persona)?.color.replace('text-', 'bg-') || 'bg-[#898781]'}`}></span>
                     {chat.title}
                   </button>
                 ))}
               </div>
            )}
         </div>

         <div className="absolute bottom-0 left-0 w-full p-2 bg-[#151515] border-t border-[#ffffff0a]">
            {isUserMenuOpen && (
               <div className="absolute bottom-[3.5rem] left-2 w-[256px] bg-[#20201f] border border-[#ffffff1a] rounded-xl shadow-2xl p-1 z-50">
                  <div className="px-3 py-2 mb-1 border-b border-[#ffffff0a]"><p className="text-[13px] text-[#898781] truncate">{user?.email}</p></div>
                  <button className="flex items-center justify-between w-full text-left px-3 py-2 text-[#f0efec] hover:bg-[#2a2a29] text-[13px] rounded-lg transition-colors">
                     <div className="flex items-center gap-3"><Settings className="w-4 h-4" /> Ajustes</div>
                  </button>
                  <button onClick={handleLogout} className="flex items-center gap-3 w-full text-left px-3 py-2 text-rose-400 hover:bg-[#2a2a29] text-[13px] rounded-lg transition-colors mt-1">
                     <LogOut className="w-4 h-4" /> Cerrar sesión
                  </button>
               </div>
            )}
            <button onClick={() => setIsUserMenuOpen(!isUserMenuOpen)} className="flex items-center justify-between w-full px-2 py-2 rounded-lg hover:bg-[#20201f] transition-colors">
               <div className="flex items-center gap-2">
                 <div className="w-6 h-6 rounded bg-[#333332] flex items-center justify-center text-[#f0efec] text-xs font-medium uppercase">{user?.displayName?.charAt(0) || "U"}</div>
                 <p className="text-[13px] text-[#f0efec] font-medium">{user?.displayName?.split(' ')[0].toLowerCase() || "user"} <span className="text-[#898781] font-normal ml-1">· Free</span></p>
               </div>
               <ChevronDown className="w-3 h-3 text-[#898781]" />
            </button>
         </div>
      </aside>

      {/* ÁREA PRINCIPAL - ESTILO CLAUDE */}
      <main className="flex-1 flex flex-col relative h-full bg-[#151515]">
        
        {/* Cabecera superior si hay un chat activo */}
        {currentChatId && (
          <header className="flex items-center justify-between px-6 py-3 border-b border-[#ffffff0a]">
             <div className="flex items-center gap-2 cursor-pointer hover:bg-[#20201f] px-2 py-1 rounded-md transition-colors">
                <span className="text-[#f0efec] text-[15px] font-medium">{chatHistory.find(c => c.id === currentChatId)?.title || "Chat"}</span>
                <ChevronDown className="w-4 h-4 text-[#898781]" />
             </div>
             <div className="flex items-center gap-4">
                <span className="text-[#898781] text-sm">Plan gratuito · <span className="text-blue-400 hover:underline cursor-pointer">Actualizar</span></span>
                <button className="bg-[#20201f] hover:bg-[#2a2a29] text-[#f0efec] px-4 py-1.5 rounded-lg text-sm transition-colors border border-[#ffffff1a]">Compartir</button>
             </div>
          </header>
        )}

        {/* Zona de Mensajes */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 flex flex-col items-center">
          <div className="w-full max-w-[48rem] flex flex-col gap-6 pb-10">
            
            {!currentChatId || messages.length === 0 ? (
               // Estado Vacío (Nuevo Chat)
               <div className="flex flex-col items-center justify-center h-[50vh] transition-all">
                  <activePersona.icon className={`w-12 h-12 ${activePersona.color} mb-6 opacity-80`} />
                  <h2 className="text-center font-serif text-[clamp(1.5rem,1.5rem+1.5vw,2.5rem)] font-light text-[#f0efec]">
                     ¡Hola! ¿En qué puede ayudarte {activePersona.name} hoy?
                  </h2>
               </div>
            ) : (
               // Lista de Mensajes (CON SOPORTE MARKDOWN Y CÓDIGO)
               messages.map((msg, idx) => (
                 <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`px-5 py-3.5 max-w-[85%] text-[15px] leading-relaxed overflow-hidden ${msg.role === 'user' ? 'bg-[#2a2a29] text-[#f0efec] rounded-2xl rounded-tr-sm' : 'text-[#f0efec]'}`}>
                       {msg.role !== 'user' && (
                          <div className="flex items-center gap-2 mb-4">
                             <activePersona.icon className={`w-4 h-4 ${activePersona.color}`} />
                             <span className="font-semibold text-sm">{activePersona.name}</span>
                          </div>
                       )}
                       
                       {/* MAGIA DE MARKDOWN */}
                       <div className="prose prose-invert max-w-none">
                         <ReactMarkdown
                           remarkPlugins={[remarkGfm]}
                           components={{
                             code({node, inline, className, children, ...props}: any) {
                               const match = /language-(\w+)/.exec(className || '')
                               return !inline && match ? (
                                 <div className="rounded-xl overflow-hidden my-4 border border-[#ffffff1a]">
                                   <div className="flex items-center justify-between px-4 py-1.5 bg-[#1a1a19] text-[#898781] text-xs font-mono border-b border-[#ffffff1a]">
                                     <span>{match[1]}</span>
                                     <button className="hover:text-[#f0efec] transition-colors">Copiar</button>
                                   </div>
                                   <SyntaxHighlighter
                                     {...props}
                                     style={vscDarkPlus}
                                     language={match[1]}
                                     PreTag="div"
                                     customStyle={{ margin: 0, padding: '1rem', background: '#151515', fontSize: '0.85rem' }}
                                   >
                                     {String(children).replace(/\n$/, '')}
                                   </SyntaxHighlighter>
                                 </div>
                               ) : (
                                 <code {...props} className="bg-[#2a2a29] text-rose-300 px-1.5 py-0.5 rounded-md text-[0.85em] font-mono">
                                   {children}
                                 </code>
                               )
                             }
                           }}
                         >
                           {msg.content}
                         </ReactMarkdown>
                       </div>
                       
                    </div>
                 </div>
               ))
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Caja de Texto Anclada al Fondo */}
        <div className="w-full max-w-[52rem] mx-auto px-4 pb-6 relative shrink-0">
           
           {/* Selector Flotante de Modelos */}
           {isDropdownOpen && !currentChatId && (
              <div className="absolute bottom-[4.5rem] right-6 w-56 bg-[#1a1a19] border border-[#ffffff1a] rounded-xl shadow-2xl z-50 overflow-hidden ring-1 ring-black/50">
                 <div className="flex flex-col p-1">
                    {personas.map((p) => (
                       <button key={p.id} onClick={() => { setActivePersona(p); setIsDropdownOpen(false); }} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${activePersona.id === p.id ? 'bg-[#2a2a29]' : 'hover:bg-[#20201f]'}`}>
                          <p.icon className={`w-4 h-4 ${p.color}`} />
                          <span className="text-[#f0efec] text-sm">{p.name}</span>
                       </button>
                    ))}
                 </div>
              </div>
           )}

           <div className="w-full bg-[#20201f] border border-[#ffffff0a] rounded-2xl shadow-lg flex flex-col relative focus-within:ring-1 focus-within:ring-[#ffffff1a] transition-all">
              <div className="flex items-end px-3 py-3 gap-2">
                 <button className="p-2 text-[#898781] hover:text-[#f0efec] transition-colors"><Plus className="w-[20px] h-[20px]" /></button>
                 <textarea 
                    ref={textareaRef}
                    value={inputValue}
                    onChange={handleInput}
                    onKeyDown={handleKeyDown}
                    className="w-full bg-transparent resize-none text-[15px] outline-none placeholder-[#898781] text-[#f0efec] py-2 max-h-48 min-h-[40px]"
                    placeholder={`Escribe un mensaje para ${activePersona.name}...`}
                    rows={1}
                 ></textarea>
                 
                 <div className="flex items-center gap-1 pb-0.5">
                    <button className="p-2 text-[#898781] hover:text-[#f0efec] transition-colors"><Mic className="w-[18px] h-[18px]" /></button>
                    <button onClick={handleSendMessage} className={`p-2 rounded-xl transition-colors ${inputValue.trim() ? 'bg-[#f0efec] text-[#151515] hover:bg-[#e1e0d9]' : 'text-[#52514e] cursor-not-allowed'}`}>
                       <ArrowUp className="w-[18px] h-[18px]" />
                    </button>
                 </div>
              </div>
           </div>
           
           {/* Pie de página pequeño */}
           <div className="flex justify-between items-center mt-3 px-2 text-[11px] text-[#52514e]">
              <p>Pitch Black es una IA y puede cometer errores. Comprueba las respuestas.</p>
              {!currentChatId && (
                <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex items-center gap-1.5 hover:text-[#898781] transition-colors">
                   <span className="font-medium text-[#898781]">{activePersona.name}</span>
                   <span>Medio</span>
                </button>
              )}
           </div>
        </div>

      </main>
    </div>
  );
}