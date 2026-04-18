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
  const [unlockCount, setUnlockCount] = useState(0);
  const [isUnlocked, setIsUnlocked] = useState(false);

  // Auto-reset unlock count if not reached within 1 second
  useEffect(() => {
    if (unlockCount > 0 && unlockCount < 3) {
      const timer = setTimeout(() => setUnlockCount(0), 1000);
      return () => clearTimeout(timer);
    }
    if (unlockCount >= 3) {
      setIsUnlocked(true);
      try {
        sessionStorage.setItem('portal_unlocked', 'true');
      } catch (e) {}
    }
  }, [unlockCount]);

  // Load persistence
  useEffect(() => {
    try {
      if (sessionStorage.getItem('portal_unlocked') === 'true') {
        setIsUnlocked(true);
      }
    } catch (e) {}
  }, []);

  const filteredGames = useMemo(() => {
    if (!Array.isArray(gamesData)) return [];
    return gamesData.filter(game => {
      const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            game.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = selectedCategory === "All" || game.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const toggleFullscreen = () => {
    const iframe = document.querySelector('iframe');
    if (iframe?.requestFullscreen) {
      iframe.requestFullscreen();
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FA]">
      {!isUnlocked ? (
        <div className="flex-1 flex flex-col bg-[#FAFAFA] text-[#2D3436] font-serif overflow-y-auto antialiased">
          <nav className="border-b border-gray-200 p-4 flex justify-between bg-white items-center sticky top-0 z-50">
            <div className="flex items-center gap-2 select-none">
              <div className="w-8 h-8 bg-gray-50 flex items-center justify-center rounded border border-gray-100">
                <Book className="text-gray-400 w-5 h-5" />
              </div>
              <span className="font-bold text-lg text-gray-700 tracking-tight transition-opacity duration-300">Student Archive & Reference</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-[10px] text-gray-400 font-sans uppercase tracking-[0.2em] hidden sm:block">Volume 14 • Academic Repository</div>
              <button 
                onClick={() => setUnlockCount(prev => prev + 1)}
                className="text-[10px] text-gray-300 hover:text-gray-400 font-sans uppercase tracking-widest transition-colors py-1 px-2 border border-transparent hover:border-gray-100 rounded"
              >
                Researcher Auth
              </button>
            </div>
          </nav>
          
          <main className="max-w-4xl mx-auto py-16 px-8 space-y-16">
            <section className="space-y-6">
              <h1 className="text-4xl font-light border-b border-gray-100 pb-6 mb-8 text-gray-900 leading-tight">Mathematics: Theoretical Foundations & Applied Calculus</h1>
              <div className="text-[11px] text-gray-400 mb-8 uppercase tracking-widest font-sans">Published by Global Education Network • Digital Edition 2026.4</div>
              
              <div className="text-gray-600 space-y-6 max-w-none leading-relaxed text-lg">
                <p>Mathematical modeling through calculus is recognized as the structural base for every branch of the physical sciences, computer science, and engineering. It provides the necessary tools for investigating the rate of change of physical quantities and the accumulation of data over time.</p>
                
                <div className="bg-white p-8 border border-gray-100 rounded shadow-sm font-mono text-xs sm:text-sm leading-relaxed overflow-x-auto text-gray-700">
                  <div className="text-gray-400 mb-2 border-b border-gray-50 pb-1 italic">Section 1.1: The Evaluation Theorem</div>
                  <div className="py-2">∫ _{a} ^{b} f(x) dx = F(b) - F(a)</div>
                  <div className="mt-6 text-gray-400 mb-2 border-b border-gray-50 pb-1 italic">Section 1.2: General Power Rule</div>
                  <div className="py-2">d/dx [u^n] = n * u^(n-1) * (du/dx)</div>
                </div>

                <p>The concepts of differentiation and integration are intrinsically linked through the fundamental theorem. Modern analysis leverages these principles to optimize complex systems starting from civil engineering to algorithmic data compression.</p>
              </div>
            </section>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-8">
              <div className="p-8 border border-gray-100 rounded bg-white hover:border-blue-100 transition-all duration-300 group">
                <Calculator className="w-6 h-6 text-gray-300 mb-4 group-hover:text-blue-400 transition-colors" />
                <h3 className="font-bold text-gray-800 mb-2 uppercase text-[11px] tracking-widest font-sans">Differential Equations</h3>
                <p className="text-xs text-gray-500 leading-relaxed italic">Applications involving functions that relate physical quantities and their derivatives.</p>
              </div>
              <div className="p-8 border border-gray-100 rounded bg-white hover:border-blue-100 transition-all duration-300 group">
                <Sigma className="w-6 h-6 text-gray-300 mb-4 group-hover:text-blue-400 transition-colors" />
                <h3 className="font-bold text-gray-800 mb-2 uppercase text-[11px] tracking-widest font-sans">Infinite Series</h3>
                <p className="text-xs text-gray-500 leading-relaxed italic">Analysis of the sum of the terms of infinite sequences, critical for digital signal analysis.</p>
              </div>
            </div>

            <section className="space-y-8 pt-12">
              <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] border-b border-gray-100 pb-3 flex items-center gap-2">
                <Hash className="w-3 h-3" /> Technical Index
              </h2>
              <div className="grid grid-cols-1 gap-8">
                {[
                  { term: "Derivative", def: "A function representing the instantaneous rate of change of a physical quantity." },
                  { term: "Antiderivative", def: "A differentiable function whose derivative is equivalent to the original function." },
                  { term: "Asymptote", def: "A line such that the distance between a curve and the line approaches zero as they move toward infinity." }
                ].map((item, i) => (
                  <div key={i} className="border-l-2 border-gray-100 pl-6 py-1">
                    <span className="font-bold text-gray-800 text-sm block mb-2">{item.term}</span>
                    <p className="text-xs text-gray-500 leading-relaxed">{item.def}</p>
                  </div>
                ))}
              </div>
            </section>

            <footer className="pt-24 pb-12 text-[10px] text-gray-300 text-center uppercase tracking-[0.4em] font-sans">
              Archive Serial ID: 99x-A512-Ref • System Security: Verified 
            </footer>
          </main>
        </div>
      ) : (
        <>
          <nav className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-50">
            <div className="flex items-center gap-4">
              <button 
                className="lg:hidden p-2 text-gray-500 hover:text-gray-900"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              >
                <Menu className="w-5 h-5" />
              </button>
              <div 
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => { setActiveGame(null); setSelectedCategory("All"); setSearchQuery(""); }}
              >
                <div className="w-8 h-8 bg-blue-600 flex items-center justify-center rounded">
                  <Gamepad2 className="text-white w-5 h-5" />
                </div>
                <span className="font-bold text-lg tracking-tight text-blue-600">PortalGames</span>
              </div>
            </div>

            <div className="hidden md:block relative w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text"
                placeholder="Find a game..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-50 border-none rounded-md py-2 pl-10 pr-4 text-sm focus:ring-1 focus:ring-blue-500 transition-all text-gray-900 placeholder:text-gray-400"
              />
            </div>

            <div className="flex items-center gap-6 text-sm font-medium text-gray-600 h-full">
              <button 
                onClick={() => {
                  try {
                    sessionStorage.removeItem('portal_unlocked');
                  } catch (e) {}
                  setIsUnlocked(false);
                  setUnlockCount(0);
                }}
                className="text-[9px] text-gray-400 hover:text-gray-600 uppercase font-bold tracking-widest border border-gray-100 px-2 py-1 rounded transition-colors"
              >
                Lock Portal
              </button>
              <span className="cursor-pointer hover:text-blue-600 transition-colors">History</span>
              <span className="cursor-pointer hover:text-blue-600 transition-colors">Profile</span>
            </div>
          </nav>

          <div className="flex flex-1 overflow-hidden relative">
            <aside className={`
              fixed lg:relative z-40 lg:z-0
              w-64 bg-white border-r border-gray-200 h-[calc(100vh-64px)] overflow-y-auto
              transition-transform duration-300 ease-in-out
              ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
              <div className="p-6">
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-4">Navigations</div>
                <ul className="space-y-1">
                  {CATEGORIES.map(cat => (
                    <li 
                      key={cat}
                      onClick={() => { setSelectedCategory(cat); setIsSidebarOpen(false); setActiveGame(null); }}
                      className={`
                        px-3 py-2 text-sm rounded cursor-pointer transition-all
                        ${selectedCategory === cat 
                          ? "text-blue-600 bg-blue-50 font-bold" 
                          : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"}
                      `}
                    >
                      {cat === "All" ? "All Content" : cat}
                    </li>
                  ))}
                </ul>

                <div className="mt-12 bg-gray-50 p-4 rounded-lg">
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Live Metrics</div>
                  <div className="space-y-4">
                    <div>
                      <div className="text-[10px] text-gray-400 mb-1">Active Users</div>
                      <div className="text-sm font-bold text-gray-800">1,204 Online</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-gray-400 mb-1">Server Latency</div>
                      <div className="text-sm font-bold text-green-600">12ms • Operational</div>
                    </div>
                  </div>
                </div>
              </div>
            </aside>

            {isSidebarOpen && (
              <div 
                onClick={() => setIsSidebarOpen(false)}
                className="fixed inset-0 bg-black/10 backdrop-blur-xs z-30 lg:hidden"
              />
            )}

            <main className="flex-1 overflow-y-auto p-8 lg:p-12 bg-gray-50/30">
              <AnimatePresence mode="wait">
                {!activeGame ? (
                  <motion.div 
                    key="grid"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <div className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                      <div>
                        <h1 className="text-3xl font-black text-gray-900 tracking-tight lowercase">{selectedCategory === "All" ? "Vault" : selectedCategory}</h1>
                        <p className="text-gray-500 text-sm mt-1">Verified secure access to standard library modules.</p>
                      </div>
                      <div className="h-px flex-1 bg-gray-200 hidden sm:block mx-8 mb-4"></div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                      {filteredGames.length > 0 ? (
                        filteredGames.map((game) => (
                          <motion.div
                            key={game.id}
                            whileHover={{ scale: 1.02 }}
                            onClick={() => setActiveGame(game)}
                            className="group bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col h-full"
                          >
                            <div className="aspect-[16/9] bg-gray-100 relative overflow-hidden">
                              <img 
                                src={game.thumbnail} 
                                alt={game.title}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                                referrerPolicy="no-referrer"
                              />
                              <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/10 transition-colors" />
                            </div>
                            <div className="p-6 flex-1 flex flex-col">
                              <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors text-lg">
                                {game.title}
                              </h3>
                              <p className="text-xs text-gray-400 mt-1 line-clamp-1">{game.description}</p>
                              <div className="mt-6 flex items-center justify-between">
                                <span className="inline-block px-2 py-0.5 bg-gray-100 text-gray-500 text-[9px] font-black uppercase rounded tracking-widest group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                  {game.category}
                                </span>
                                <div className="p-2 rounded-full bg-gray-50 group-hover:bg-blue-50 transition-colors">
                                  <Zap className="w-3 h-3 text-gray-300 group-hover:text-blue-600" />
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))
                      ) : (
                        <div className="col-span-full py-32 text-center text-gray-300">
                          <p className="text-lg font-light">No modules identified in this sector.</p>
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
                    className="flex flex-col gap-6 max-w-5xl mx-auto"
                  >
                    <div className="flex items-center justify-between border-b border-gray-200 pb-6 mb-2">
                      <div className="flex items-center gap-4">
                        <button 
                          onClick={() => setActiveGame(null)}
                          className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-gray-100 text-gray-400 hover:text-gray-900 hover:border-gray-300 transition-all"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <div>
                          <h2 className="font-black text-2xl text-gray-900 tracking-tight lowercase">{activeGame.title}</h2>
                          <p className="text-[10px] text-blue-600 uppercase font-black tracking-[0.2em]">{activeGame.category}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={toggleFullscreen}
                          className="p-3 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                          title="Fullscreen"
                        >
                          <Maximize2 className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => setActiveGame(null)}
                          className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    <div className="w-full aspect-video bg-black rounded-2xl overflow-hidden border-4 border-white shadow-xl relative ring-1 ring-gray-200">
                      <iframe 
                        src={activeGame.iframeUrl} 
                        className="w-full h-full border-none bg-white"
                        allowFullScreen
                        allow="autoplay; fullscreen; keyboard-attribute; gyroscope; accelerometer; mid; payment"
                        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals allow-presentation"
                        title={activeGame.title}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-8">
                      <div className="md:col-span-2 space-y-6">
                        <div>
                          <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-4">Module Specification</h4>
                          <p className="text-gray-600 leading-relaxed text-sm antialiased">
                            {activeGame.description}
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {activeGame.tags.map(tag => (
                            <span key={tag} className="px-3 py-1 bg-white border border-gray-100 rounded-full text-[9px] text-gray-400 uppercase font-black tracking-widest">#{tag}</span>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-6">
                        <div className="flex items-center gap-2 text-gray-900 border-b border-gray-100 pb-4">
                          <Trophy className="w-4 h-4 text-blue-600" />
                          <span className="font-black text-[10px] uppercase tracking-[0.2em]">Live Ranking</span>
                        </div>
                        <div className="text-[11px] text-gray-400 bg-gray-100/50 p-4 rounded-lg italic text-center">
                          Metric synchronization in progress...
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </main>
          </div>

          <footer className="h-10 bg-white border-t border-gray-100 flex items-center justify-between px-8 text-[9px] text-gray-300 font-bold uppercase tracking-widest">
            <div>v2.5.0 • Educational Portal • Secured</div>
            <div className="flex gap-6">
              <span className="hover:text-gray-500 cursor-pointer transition-colors">Academic Use Only</span>
              <span className="hover:text-gray-500 cursor-pointer transition-colors">Data Privacy</span>
            </div>
          </footer>
        </>
      )}
    </div>
  );
}
