import { Plus, FolderClosed, Layers, Code2, SlidersHorizontal, Mic, AudioLines, ChevronDown, ArrowUp, PenLine, GraduationCap, Coffee, Lightbulb } from "lucide-react";

export default function Home() {
  
  // Lista vacía para nuevos usuarios. 
  // Al usar un .map() abajo, el diseño no se romperá cuando Firebase inyecte los chats.
  const chatHistory: string[] = [];

  return (
    <div className="flex h-screen bg-[#151515] text-[#f0efec] font-sans selection:bg-[#898781]/30">
      
      {/* Barra Lateral Profesional */}
      <aside className="w-[288px] flex-shrink-0 bg-[#151515] hidden md:flex flex-col border-r border-[#ffffff0a]">
         {/* Cabecera y Botón Nuevo */}
         <div className="p-4 flex flex-col gap-4">
            <div className="flex items-center gap-3 px-2">
                {/* Estrella SVG como Icono Principal */}
                <svg viewBox="0 0 100 100" className="w-6 h-6 fill-[#898781]">
                   <path d="M50 0L53.5 35.5L85.5 14.5L64.5 46.5L100 50L64.5 53.5L85.5 85.5L53.5 64.5L50 100L46.5 64.5L14.5 85.5L35.5 53.5L0 50L35.5 46.5L14.5 14.5L46.5 35.5L50 0Z"/>
                </svg>
                <span className="font-serif font-bold text-xl pitch-black-logo">Pitch Black</span>
            </div>
            <button className="flex items-center gap-2 bg-[#20201f] hover:bg-[#2a2a29] text-[#f0efec] px-4 py-2.5 rounded-lg border border-[#ffffff1a] transition-colors text-sm font-medium shadow-md">
               <Plus className="w-4 h-4" />
               Nuevo Chat
            </button>
         </div>
         
         {/* Navegación Principal */}
         <nav className="flex flex-col px-4 space-y-1 mb-6">
            <button className="flex items-center gap-3 w-full text-left px-3 py-2 text-[#898781] hover:bg-[#20201f] hover:text-[#f0efec] text-[14px] rounded-lg transition-colors">
              <FolderClosed className="w-[18px] h-[18px]" /> Proyectos
            </button>
            <button className="flex items-center gap-3 w-full text-left px-3 py-2 text-[#898781] hover:bg-[#20201f] hover:text-[#f0efec] text-[14px] rounded-lg transition-colors">
              <Layers className="w-[18px] h-[18px]" /> Artefactos
            </button>
            <button className="flex items-center justify-between w-full px-3 py-2 text-[#f0efec] bg-[#20201f] text-[14px] rounded-lg transition-colors border border-[#ffffff1a]">
              <div className="flex items-center gap-3">
                 <Code2 className="w-[18px] h-[18px] text-[#898781]" /> Código
              </div>
              <span className="text-[11px] text-[#898781]">Actualizar</span>
            </button>
            <button className="flex items-center gap-3 w-full text-left px-3 py-2 text-[#898781] hover:bg-[#20201f] hover:text-[#f0efec] text-[14px] rounded-lg transition-colors">
              <SlidersHorizontal className="w-[18px] h-[18px]" /> Personalizar
            </button>
         </nav>

         {/* Historial (Limpio para nuevos usuarios) */}
         <div className="flex-1 overflow-y-auto px-4 pb-4">
            <div className="flex justify-between items-center px-3 mb-2">
               <span className="text-xs text-[#52514e] font-medium tracking-wide">TUS CHATS</span>
               <SlidersHorizontal className="w-3 h-3 text-[#52514e] cursor-pointer hover:text-[#f0efec] transition-colors" />
            </div>
            
            {chatHistory.length === 0 ? (
               <div className="flex flex-col items-center justify-center h-24 px-4 text-center mt-4">
                 <p className="text-[13px] text-[#52514e]">Aún no hay chats.</p>
                 <p className="text-[12px] text-[#52514e] mt-1">Empieza a escribir en la oscuridad.</p>
               </div>
            ) : (
               <div className="space-y-1">
                 {chatHistory.map((chatTitle, index) => (
                   <p key={index} className="text-[13px] text-[#898781] hover:bg-[#20201f] hover:text-[#f0efec] px-3 py-2 rounded-lg cursor-pointer truncate transition-colors">
                     {chatTitle}
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
             
             {/* Saludo Central (Estilo Pitch Black) */}
             <div className="text-center font-serif text-[clamp(2rem,1.5rem+3vw,3rem)] mb-8 font-light flex items-center justify-center gap-4 pitch-black-greeting">
               <svg viewBox="0 0 100 100" className="w-[0.8em] h-[0.8em] fill-[#898781] drop-shadow-lg opacity-80">
                  <path d="M50 0L53.5 35.5L85.5 14.5L64.5 46.5L100 50L64.5 53.5L85.5 85.5L53.5 64.5L50 100L46.5 64.5L14.5 85.5L35.5 53.5L0 50L35.5 46.5L14.5 14.5L46.5 35.5L50 0Z"/>
               </svg>
               En la oscuridad
             </div>

             {/* Caja de Texto Avanzada */}
             <div className="w-full bg-[#20201f] border border-[#ffffff0a] rounded-2xl shadow-2xl transition-colors relative flex flex-col ring-1 ring-white/5 focus-within:ring-white/10">
                
                {/* Opciones Superiores de la Caja */}
                <div className="flex items-center justify-between px-3 pt-3">
                   <button className="text-[#f0efec] bg-[#2a2a29] px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2 shadow-sm border border-white/5">
                     <Plus className="w-4 h-4" /> Chat
                   </button>
                   <span className="text-[#52514e] text-sm pr-2 font-medium">Cowork</span>
                </div>

                <textarea 
                  className="w-full bg-transparent resize-none text-[15px] outline-none placeholder-[#52514e] text-[#f0efec] px-4 py-4 max-h-96 min-h-[72px]"
                  placeholder="Habla con Pitch Black..."
                  rows={2}
                ></textarea>
                
                {/* Controles Inferiores de la Caja */}
                <div className="flex justify-between items-center px-3 pb-3">
                   <div className="flex gap-2">
                      <button className="text-[#52514e] hover:text-[#f0efec] transition-colors p-1"><Plus className="w-[18px] h-[18px]" /></button>
                   </div>
                   <div className="flex items-center gap-3">
                      <span className="text-[#52514e] text-[13px] font-medium hidden sm:block">Pitch Black 8B</span>
                      <Mic className="w-4 h-4 text-[#52514e] hover:text-[#f0efec] cursor-pointer transition-colors" />
                      <div className="flex items-center text-[#52514e] hover:text-[#f0efec] cursor-pointer transition-colors">
                         <AudioLines className="w-4 h-4" />
                         <ChevronDown className="w-3 h-3 ml-1" />
                      </div>
                      <button className="p-2 bg-[#f0efec] text-[#151515] rounded-lg hover:bg-[#e1e0d9] transition-colors ml-2 shadow-md">
                         <ArrowUp className="w-[18px] h-[18px]" />
                      </button>
                   </div>
                </div>
             </div>

             {/* Chips de Acción Inferiores */}
             <div className="flex flex-wrap justify-center gap-2 w-full px-2 mt-2">
                <button className="flex items-center gap-2 px-4 py-2 bg-[#20201f] border border-[#ffffff0a] hover:bg-[#2a2a29] rounded-xl text-[#a5a49a] text-[13px] font-medium transition-all hover:text-[#f0efec] shadow-sm">
                   <PenLine className="w-4 h-4 opacity-70" /> Escribir
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-[#20201f] border border-[#ffffff0a] hover:bg-[#2a2a29] rounded-xl text-[#a5a49a] text-[13px] font-medium transition-all hover:text-[#f0efec] shadow-sm">
                   <GraduationCap className="w-4 h-4 opacity-70" /> Aprender
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-[#20201f] border border-[#ffffff0a] hover:bg-[#2a2a29] rounded-xl text-[#a5a49a] text-[13px] font-medium transition-all hover:text-[#f0efec] shadow-sm">
                   <Code2 className="w-4 h-4 opacity-70" /> Código
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-[#20201f] border border-[#ffffff0a] hover:bg-[#2a2a29] rounded-xl text-[#a5a49a] text-[13px] font-medium transition-all hover:text-[#f0efec] shadow-sm">
                   <Coffee className="w-4 h-4 opacity-70" /> Vida personal
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-[#20201f] border border-[#ffffff0a] hover:bg-[#2a2a29] rounded-xl text-[#a5a49a] text-[13px] font-medium transition-all hover:text-[#f0efec] shadow-sm">
                   <Lightbulb className="w-4 h-4 opacity-70" /> Selección de Pitch Black
                </button>
             </div>
             
          </div>
        </div>
      </main>
    </div>
  );
}