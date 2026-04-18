/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo, useEffect } from 'react';
import { Search, Gamepad2, X, Maximize2, Trophy, Zap, ChevronLeft, Menu, Calculator, Book, Sigma } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import gamesData from './data/games.json';

const CATEGORIES = ["All", "Action", "Puzzle", "Arcade", "Classic", "Strategy"];

export default function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [activeGame, setActiveGame] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [unlockCount, setUnlockCount] = useState(0);

  // Robust session persistence
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem('portal_unlocked');
      if (saved === 'true') {
        setIsUnlocked(true);
      }
    } catch (err) {
      console.warn("Storage access failed");
    }
  }, []);

  // Unlock logic
  useEffect(() => {
    if (unlockCount >= 3) {
      setIsUnlocked(true);
      try {
        sessionStorage.setItem('portal_unlocked', 'true');
      } catch (err) {}
    } else if (unlockCount > 0) {
      const timer = setTimeout(() => {
        setUnlockCount(0);
        console.log("Unlock sequence timed out");
      }, 3000); // Increased to 3 seconds for easier entry
      return () => clearTimeout(timer);
    }
  }, [unlockCount]);

  const filteredGames = useMemo(() => {
    const data = Array.isArray(gamesData) ? gamesData : [];
    return data.filter(game => {
      const matchesSearch = (game.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
                            (game.tags || []).some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = selectedCategory === "All" || game.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const toggleFullscreen = () => {
    try {
      const iframe = document.querySelector('iframe');
      if (iframe?.requestFullscreen) iframe.requestFullscreen();
    } catch (e) {}
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans selection:bg-blue-100 selection:text-blue-900 overflow-hidden">
      {!isUnlocked ? (
        /* CAMOUFLAGE UI: Student Reference Library */
        <div className="flex-1 flex flex-col bg-white text-slate-800 font-serif overflow-y-auto">
          <nav className="h-14 border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md z-50">
            <div className="flex items-center gap-3 select-none">
              <div className="w-8 h-8 flex items-center justify-center bg-slate-100 rounded border border-slate-200">
                <Book className="w-5 h-5 text-slate-400" />
              </div>
              <span className="font-bold text-base tracking-tight text-slate-700">Student Digital Archive</span>
            </div>
            <div className="flex items-center gap-6">
              <div className="hidden sm:block text-[10px] font-sans font-bold text-slate-400 uppercase tracking-widest">Repository v4.2.0</div>
              <button 
                onClick={() => setUnlockCount(prev => prev + 1)}
                className="text-[10px] font-sans font-bold text-slate-300 hover:text-slate-500 transition-colors uppercase tracking-[0.2em]"
              >
                Researcher Auth
              </button>
            </div>
          </nav>
          
          <main className="max-w-3xl mx-auto py-20 px-8 space-y-16">
            <header className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-700">
              <h1 className="text-4xl font-light text-slate-900 tracking-tight leading-tight">Mathematics: Theoretical Frameworks & Analysis</h1>
              <p className="text-slate-500 font-sans text-xs uppercase tracking-widest">Academic Press • Revised Edition 2026</p>
            </header>

            <article className="prose prose-slate max-w-none space-y-8 text-lg leading-relaxed text-slate-600">
              <p>The study of calculus provides the fundamental tools required for understanding the change and motion of complex physical systems. By linking differentiation and integration, the fundamental theorem allows for the computation of precisely modeled outcomes across various scientific disciplines.</p>

              <div className="p-8 border border-slate-100 rounded-lg bg-slate-50/50 font-mono text-sm space-y-6 text-slate-700">
                <div className="space-y-2">
                  <span className="text-slate-400 text-xs block mb-1 font-sans font-bold uppercase tracking-wider">// Fundamental Identity</span>
                  <div className="pl-4">∫ _{a} ^{b} f(x) dx = F(b) - F(a)</div>
                </div>
                <div className="h-px bg-slate-200/50" />
                <div className="space-y-2">
                  <span className="text-slate-400 text-xs block mb-1 font-sans font-bold uppercase tracking-wider">// Chain Rule Property</span>
                  <div className="pl-4">d/dx [f(g(x))] = f'(g(x))g'(x)</div>
                </div>
              </div>

              <p>Modern applications of these principles extend into discrete computational modeling, where differential equations assist in the prediction of data trends and economic fluctuations.</p>
            </article>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-8">
              <div className="p-8 border border-slate-100 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow group">
                <Calculator className="w-8 h-8 text-slate-300 mb-6 group-hover:text-amber-500 transition-colors" />
                <h3 className="font-bold text-xs uppercase tracking-widest mb-3 font-sans text-slate-800">Branch II: Differential Modeling</h3>
                <p className="text-sm text-slate-500 italic leading-relaxed">Understanding the relationships between physical quantities and their instantaneous rates of change.</p>
              </div>
              <div className="p-8 border border-slate-100 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow group">
                <Sigma className="w-8 h-8 text-slate-300 mb-6 group-hover:text-blue-500 transition-colors" />
                <h3 className="font-bold text-xs uppercase tracking-widest mb-3 font-sans text-slate-800">Branch III: Infinite Summation</h3>
                <p className="text-sm text-slate-500 italic leading-relaxed">The systematic evaluation of series convergence within bounded and unbounded domains.</p>
              </div>
            </div>

            <footer className="pt-24 pb-8 border-t border-slate-50 flex flex-col items-center gap-4">
              <div className="text-[10px] text-slate-400 font-sans font-bold uppercase tracking-[0.4em]">Educational Resource ID: 44-819-581</div>
              <p className="text-[10px] text-slate-300">Verified System Connectivity: Passive Monitoring Active</p>
            </footer>
          </main>
        </div>
      ) : (
        /* PORTAL UI: Gaming Hub (Unlocked) */
        <>
          <nav className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-50">
            <div className="flex items-center gap-4">
              <button 
                className="lg:hidden p-2 text-slate-400 hover:text-slate-900"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              >
                <Menu className="w-5 h-5" />
              </button>
              <div 
                className="flex items-center gap-2 cursor-pointer transition-transform active:scale-95"
                onClick={() => { setActiveGame(null); setSelectedCategory("All"); setSearchQuery(""); }}
              >
                <div className="w-9 h-9 bg-blue-600 flex items-center justify-center rounded-lg shadow-lg shadow-blue-200">
                  <Gamepad2 className="text-white w-5 h-5" />
                </div>
                <span className="font-black text-xl tracking-tighter text-blue-600">PortalGames</span>
              </div>
            </div>

            <div className="hidden md:block relative w-96">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text"
                placeholder="Find a game..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-100 border-none rounded-full py-2.5 pl-11 pr-4 text-sm focus:ring-2 focus:ring-blue-100 transition-all text-slate-900 placeholder:text-slate-400"
              />
            </div>

            <div className="flex items-center gap-6">
              <button 
                onClick={() => {
                  try { sessionStorage.removeItem('portal_unlocked'); } catch (e) {}
                  setIsUnlocked(false);
                  setUnlockCount(0);
                }}
                className="text-[9px] text-slate-400 hover:text-red-500 uppercase font-bold tracking-[0.2em] px-3 py-1.5 border border-slate-100 rounded-full transition-all"
              >
                Lock Portal
              </button>
              <div className="hidden sm:flex items-center gap-4 text-sm font-bold text-slate-500">
                <span className="cursor-pointer hover:text-blue-600">History</span>
                <span className="cursor-pointer hover:text-blue-600">Profile</span>
              </div>
            </div>
          </nav>

          <div className="flex flex-1 overflow-hidden">
            <aside className={`
              fixed lg:relative z-40 lg:z-0
              w-64 bg-white border-r border-slate-200 h-[calc(100vh-64px)] overflow-y-auto
              transition-transform duration-300 ease-in-out
              ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
              <div className="p-8">
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Navigation</div>
                <ul className="space-y-1.5">
                  {CATEGORIES.map(cat => (
                    <li 
                      key={cat}
                      onClick={() => { setSelectedCategory(cat); setIsSidebarOpen(false); setActiveGame(null); }}
                      className={`
                        px-4 py-2.5 text-sm rounded-xl cursor-pointer transition-all flex items-center gap-3
                        ${selectedCategory === cat 
                          ? "text-blue-600 bg-blue-50 font-bold" 
                          : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"}
                      `}
                    >
                      <div className={`w-1.5 h-1.5 rounded-full ${selectedCategory === cat ? 'bg-blue-600' : 'bg-transparent'}`} />
                      {cat === "All" ? "Library" : cat}
                    </li>
                  ))}
                </ul>

                <section className="mt-16 bg-slate-50 rounded-2xl p-5 border border-slate-100">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Network Activity</div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-end">
                      <span className="text-[10px] text-slate-500 uppercase font-bold">Latency</span>
                      <span className="text-xs font-black text-green-500">12ms</span>
                    </div>
                    <div className="flex justify-between items-end">
                      <span className="text-[10px] text-slate-500 uppercase font-bold">Players</span>
                      <span className="text-xs font-black text-slate-700">1,204</span>
                    </div>
                  </div>
                </section>
              </div>
            </aside>

            {isSidebarOpen && (
              <div 
                onClick={() => setIsSidebarOpen(false)}
                className="fixed inset-0 bg-slate-900/10 backdrop-blur-sm z-30 lg:hidden"
              />
            )}

            <main className="flex-1 overflow-y-auto bg-slate-50/50 p-6 lg:p-10">
              <AnimatePresence mode="wait">
                {!activeGame ? (
                  <motion.div 
                    key="content"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-10"
                  >
                    <header>
                      <h1 className="text-3xl font-black text-slate-900 tracking-tighter lowercase">
                        {selectedCategory === "All" ? "Featured Archive" : `${selectedCategory} Sector`}
                      </h1>
                      <div className="h-0.5 w-12 bg-blue-600 mt-2 rounded-full" />
                    </header>

                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                      {filteredGames.length > 0 ? (
                        filteredGames.map((game) => (
                          <motion.div
                            key={game.id}
                            whileHover={{ y: -4 }}
                            onClick={() => setActiveGame(game)}
                            className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl hover:border-blue-100 transition-all cursor-pointer flex flex-col h-full"
                          >
                            <div className="aspect-[16/10] bg-slate-100 relative overflow-hidden">
                              <img 
                                src={game.thumbnail} 
                                alt={game.title}
                                className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-500"
                                referrerPolicy="no-referrer"
                              />
                            </div>
                            <div className="p-6 flex-1 flex flex-col">
                              <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors text-lg tracking-tight">
                                {game.title}
                              </h3>
                              <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">{game.description}</p>
                              <div className="mt-6 flex items-center justify-between">
                                <span className="px-2.5 py-1 bg-slate-100 text-slate-500 text-[10px] font-black uppercase rounded-lg tracking-widest group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                  {game.category}
                                </span>
                                <Zap className="w-4 h-4 text-slate-200 group-hover:text-blue-400 transition-colors" />
                              </div>
                            </div>
                          </motion.div>
                        ))
                      ) : (
                        <div className="col-span-full py-40 text-center">
                          <p className="text-slate-300 font-black uppercase tracking-[0.3em] text-xs">No active modules in this sector</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="player"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    className="max-w-5xl mx-auto space-y-8"
                  >
                    <header className="flex items-center justify-between border-b border-slate-200 pb-6">
                      <div className="flex items-center gap-5">
                        <button 
                          onClick={() => setActiveGame(null)}
                          className="w-11 h-11 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-slate-900 hover:border-slate-300 shadow-sm transition-all"
                        >
                          <ChevronLeft className="w-6 h-6" />
                        </button>
                        <div>
                          <h2 className="font-black text-2xl text-slate-900 tracking-tight lowercase">{activeGame.title}</h2>
                          <p className="text-[10px] text-blue-600 uppercase font-black tracking-widest">{activeGame.category} Sector</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={toggleFullscreen}
                          className="p-3 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all shadow-xs"
                          title="Fullscreen"
                        >
                          <Maximize2 className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => setActiveGame(null)}
                          className="p-3 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all shadow-xs"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    </header>

                    <div className="aspect-video bg-slate-900 rounded-3xl overflow-hidden shadow-2xl relative ring-8 ring-white">
                      <iframe 
                        src={activeGame.iframeUrl} 
                        className="w-full h-full border-none bg-white"
                        allowFullScreen
                        allow="autoplay; fullscreen; keyboard-attribute; gyroscope; accelerometer; mid; payment"
                        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals allow-presentation"
                        title={activeGame.title}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pt-4">
                      <div className="md:col-span-2 space-y-8">
                        <div>
                          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 border-b border-slate-200 pb-2">Module Protocol</h4>
                          <p className="text-slate-600 leading-relaxed text-base">
                            {activeGame.description}
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-2.5">
                          {(activeGame.tags || []).map(tag => (
                            <span key={tag} className="px-4 py-1.5 bg-white border border-slate-200 rounded-full text-[10px] text-slate-400 uppercase font-bold tracking-widest">#{tag}</span>
                          ))}
                        </div>
                      </div>
                      <aside className="space-y-8">
                        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden group">
                          <div className="absolute top-0 right-0 p-4 opacity-5">
                            <Trophy className="w-12 h-12 text-blue-600" />
                          </div>
                          <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Service Status</h5>
                          <div className="space-y-2">
                            <div className="text-sm font-bold text-slate-800">System Nominal</div>
                            <div className="text-[10px] text-slate-400 uppercase tracking-wider italic">Ranking sync active</div>
                          </div>
                        </div>
                      </aside>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </main>
          </div>

          <footer className="h-10 bg-white border-t border-slate-200 flex items-center justify-between px-8 text-[9px] text-slate-300 font-bold uppercase tracking-[0.2em] antialiased">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              <span>Network Protocol v2.6.0 Stable</span>
            </div>
            <div className="flex gap-6">
              <span className="hover:text-slate-600 cursor-pointer">Security Terms</span>
              <span className="hover:text-slate-600 cursor-pointer">Archive Privacy</span>
            </div>
          </footer>
        </>
      )}
    </div>
  );
}
