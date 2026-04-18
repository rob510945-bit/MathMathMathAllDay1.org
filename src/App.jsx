/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo, useEffect, useRef } from 'react';
import { Search, LayoutGrid, X, Maximize2, Microscope, ArrowRight, ChevronLeft, Menu, Calculator, Book, Sigma, Play, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { archiveData } from './data/archive';

const COLLECTIONS = ["Global", "Local", "Applied", "Technical", "Foundational"];

/* MINI-GAME: Snake (Javascript Edition) */
const SnakeGame = () => {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [highScore, setHighScore] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let snake = [{ x: 10, y: 10 }];
    let food = { x: 5, y: 5 };
    let dx = 0;
    let dy = 0;
    let nextDx = 1;
    let nextDy = 0;
    const gridSize = 20;
    const tileCount = 20;

    const handleKeydown = (e) => {
      if (e.key === 'ArrowUp' && dy === 0) { nextDx = 0; nextDy = -1; }
      if (e.key === 'ArrowDown' && dy === 0) { nextDx = 0; nextDy = 1; }
      if (e.key === 'ArrowLeft' && dx === 0) { nextDx = -1; nextDy = 0; }
      if (e.key === 'ArrowRight' && dx === 0) { nextDx = 1; nextDy = 0; }
    };

    window.addEventListener('keydown', handleKeydown);

    const gameLoop = setInterval(() => {
      dx = nextDx;
      dy = nextDy;
      const head = { x: snake[0].x + dx, y: snake[0].y + dy };

      // Wall collision
      if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        setGameOver(true);
        clearInterval(gameLoop);
        return;
      }

      // Self collision
      if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        setGameOver(true);
        clearInterval(gameLoop);
        return;
      }

      snake.unshift(head);

      // Food collision
      if (head.x === food.x && head.y === food.y) {
        setScore(s => s + 10);
        food = {
          x: Math.floor(Math.random() * tileCount),
          y: Math.floor(Math.random() * tileCount)
        };
      } else {
        snake.pop();
      }

      // Draw
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#22c55e';
      snake.forEach((segment, i) => {
        ctx.globalAlpha = 1 - (i / snake.length) * 0.5;
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
      });
      ctx.globalAlpha = 1;

      ctx.fillStyle = '#ef4444';
      ctx.fillRect(food.x * gridSize + 4, food.y * gridSize + 4, gridSize - 10, gridSize - 10);
    }, 100);

    return () => {
      clearInterval(gameLoop);
      window.removeEventListener('keydown', handleKeydown);
    };
  }, [gameOver]);

  return (
    <div className="flex flex-col items-center bg-slate-900 absolute inset-0 text-white p-4">
      <div className="flex justify-between w-full mb-4 px-4">
        <div className="text-sm font-mono tracking-tighter uppercase opacity-50">Local Protocol: Snake</div>
        <div className="text-xl font-black">SCORE: {score}</div>
      </div>
      
      <div className="relative bg-slate-800 rounded-lg overflow-hidden border-4 border-slate-700 shadow-2xl">
        <canvas 
          ref={canvasRef} 
          width={400} 
          height={400} 
          className="max-w-full aspect-square"
        />
        {gameOver && (
          <div className="absolute inset-0 bg-slate-900/90 flex flex-col items-center justify-center backdrop-blur-sm">
            <h3 className="text-4xl font-black text-white mb-2 tracking-tighter">SIMULATION ENDED</h3>
            <p className="text-slate-400 mb-8 font-mono">Final Delta: {score}</p>
            <button 
              onClick={() => { setScore(0); setGameOver(false); }}
              className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-full font-bold flex items-center gap-2 transition-all active:scale-95 shadow-lg"
            >
              <RotateCcw className="w-5 h-5" /> REINITIALIZE
            </button>
          </div>
        )}
      </div>
      <p className="mt-6 text-slate-500 text-xs font-mono uppercase tracking-widest animate-pulse">Use arrow keys to navigate</p>
    </div>
  );
};

export default function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Global");
  const [activeModule, setActiveModule] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [unlockCount, setUnlockCount] = useState(0);

  // Reset scroll on unlock
  useEffect(() => {
    if (isUnlocked) {
      window.scrollTo(0, 0);
    }
  }, [isUnlocked]);

  // Unlock logic: 10 clicks on the copyright logo for ultimate protection
  useEffect(() => {
    if (unlockCount >= 10) {
      setIsUnlocked(true);
    } else if (unlockCount > 0) {
      const timer = setTimeout(() => {
        setUnlockCount(0);
      }, 5000); 
      return () => clearTimeout(timer);
    }
  }, [unlockCount]);

  const handleExternalLaunch = (url) => {
    // Roblox and similar high-security sites explicitly block being placed in any iframe
    // (even inside an about:blank window). To fix the 'Refused to Connect' error,
    // we must open the resource as a top-level document in a new tab.
    const win = window.open(url, '_blank', 'noopener,noreferrer');
    if (!win) {
      // Fallback for pop-up blockers
      const link = document.createElement('a');
      link.href = url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.click();
    }
  };

  const filteredModules = useMemo(() => {
    const data = Array.isArray(archiveData) ? archiveData : [];
    return data.filter(entry => {
      const matchesSearch = (entry.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
                            (entry.tags || []).some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const categoryMatch = selectedCategory === "Global" || 
                           (entry.category || "").toLowerCase() === selectedCategory.toLowerCase();
      
      return matchesSearch && categoryMatch;
    });
  }, [searchQuery, selectedCategory]);

  const toggleDisplay = () => {
    try {
      const frame = document.querySelector('iframe');
      if (frame?.requestFullscreen) frame.requestFullscreen();
    } catch (e) {}
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans selection:bg-blue-100 selection:text-blue-900 overflow-hidden">
      {!isUnlocked ? (
        /* CAMOUFLAGE UI: Ultra-Dry University Archive */
        <div className="flex-1 flex flex-col bg-[#FDFDFD] text-[#333] font-serif overflow-y-auto">
          <nav className="h-10 border-b border-gray-300 px-8 flex items-center justify-between bg-gray-100 text-[11px] uppercase tracking-widest font-sans text-gray-500">
            <div>Educational Systems Gateway v12.4.1</div>
            <div className="flex gap-4">
              <span>Network Status: Stable</span>
              <span>Regional Node: East-2</span>
            </div>
          </nav>
          
          <main className="max-w-4xl mx-auto py-24 px-12 space-y-20">
            <header className="border-b-2 border-slate-900 pb-12">
              <p className="text-[11px] uppercase tracking-[0.3em] text-blue-800 font-bold mb-4 font-sans">Official Record Repository</p>
              <h1 className="text-5xl font-black text-slate-900 tracking-tight leading-none mb-6">Current Curriculum Management & Instructional Standards Archive</h1>
              <p className="text-xl text-slate-500 italic max-w-2xl">A comprehensive digital index of regional teaching methodologies, behavioral standards, and administrative syllabi cycles for the 2026-2027 academic year.</p>
            </header>

            <article className="grid grid-cols-1 md:grid-cols-3 gap-12 text-sm leading-relaxed text-slate-700">
              <div className="md:col-span-2 space-y-8">
                <section>
                  <h2 className="text-xs uppercase tracking-widest font-black text-slate-400 mb-4 font-sans">I. System Overview</h2>
                  <p>The System Standards Repository (SSR) is the primary distribution point for verified instructional data. This portal utilizes encrypted indexing to maintain the integrity of regional educational records and ensures that all participating faculty have access to real-time syllabus updates.</p>
                </section>
                <section>
                  <h2 className="text-xs uppercase tracking-widest font-black text-slate-400 mb-4 font-sans">II. Resource Distribution</h2>
                  <p>By accessing this repository, users acknowledge their responsibility to maintain data confidentiality. The instructional modules contained within are categorized by foundational difficulty and specialized technical focus. All modules have been vetted by the regional board for alignment with national proficiency goals.</p>
                </section>
              </div>
              <aside className="p-6 bg-slate-50 border border-slate-200 rounded-sm font-mono text-[11px] space-y-6">
                <div>
                  <span className="text-slate-400 block mb-1 uppercase font-bold tracking-tight">// Node Identifier</span>
                  <div className="text-slate-900 truncate font-bold">ARC-SYS-044819581</div>
                </div>
                <div>
                  <span className="text-slate-400 block mb-1 uppercase font-bold tracking-tight">// Access Protocol</span>
                  <div className="text-slate-900 font-bold">Standard Administrative</div>
                </div>
                <div className="pt-4 border-t border-slate-200">
                  <div className="text-slate-400 italic">"The advancement of knowledge is the primary objective of this administrative record."</div>
                </div>
              </aside>
            </article>

            <div className="pt-24 pb-12 border-t border-slate-200 flex flex-col items-center">
              <p className="text-[10px] text-slate-400 font-sans tracking-[0.5em] mb-4">CONFIDENTIAL RECORD: 44-819-581</p>
              <button 
                onClick={() => setUnlockCount(prev => prev + 1)}
                className="text-[10px] text-slate-300 font-sans hover:text-slate-400 transition-colors"
                title="Legal Information"
              >
                © 2026 Board of Visual & Spatial Computation Management Systems • Policy 1.0.4
              </button>
            </div>
          </main>
        </div>
      ) : (
        /* TERMINAL UI: Research Index (Unlocked) */
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
                onClick={() => { setActiveModule(null); setSelectedCategory("Global"); setSearchQuery(""); }}
              >
                <div className="w-9 h-9 bg-blue-600 flex items-center justify-center rounded-lg shadow-lg shadow-blue-200">
                  <LayoutGrid className="text-white w-5 h-5" />
                </div>
                <span className="font-black text-xl tracking-tighter text-blue-600">ResourceHub</span>
              </div>
            </div>

            <div className="hidden md:block relative w-96">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text"
                placeholder="Search catalog..."
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
                Restrict Access
              </button>
              <div className="hidden sm:flex items-center gap-4 text-sm font-bold text-slate-500">
                <span className="cursor-pointer hover:text-blue-600">Revisions</span>
                <span className="cursor-pointer hover:text-blue-600">Account</span>
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
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Indices</div>
                <ul className="space-y-1.5">
                  {COLLECTIONS.map(cat => (
                    <li 
                      key={cat}
                      onClick={() => { setSelectedCategory(cat); setIsSidebarOpen(false); setActiveModule(null); }}
                      className={`
                        px-4 py-2.5 text-sm rounded-xl cursor-pointer transition-all flex items-center gap-3
                        ${selectedCategory === cat 
                          ? "text-blue-600 bg-blue-50 font-bold" 
                          : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"}
                      `}
                    >
                      <div className={`w-1.5 h-1.5 rounded-full ${selectedCategory === cat ? 'bg-blue-600' : 'bg-transparent'}`} />
                      {cat === "Global" ? "All Indices" : cat}
                    </li>
                  ))}
                </ul>

                <section className="mt-16 bg-slate-50 rounded-2xl p-5 border border-slate-100">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Traffic Telemetry</div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-end">
                      <span className="text-[10px] text-slate-500 uppercase font-bold">Packet Delay</span>
                      <span className="text-xs font-black text-green-500">12ms</span>
                    </div>
                    <div className="flex justify-between items-end">
                      <span className="text-[10px] text-slate-500 uppercase font-bold">Active Nodes</span>
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
                {!activeModule ? (
                  <motion.div 
                    key="content"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-10"
                  >
                    <header>
                      <h1 className="text-3xl font-black text-slate-900 tracking-tighter lowercase">
                        {selectedCategory === "Global" ? "Primary Indices" : `${selectedCategory} Sector`}
                      </h1>
                      <div className="h-0.5 w-12 bg-blue-600 mt-2 rounded-full" />
                    </header>

                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                      {filteredModules.length > 0 ? (
                        filteredModules.map((entry) => (
                          <motion.div
                            key={entry.id}
                            whileHover={{ y: -4 }}
                            onClick={() => setActiveModule(entry)}
                            className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl hover:border-blue-100 transition-all cursor-pointer flex flex-col h-full"
                          >
                            <div className="aspect-[16/10] bg-slate-100 relative overflow-hidden">
                              <img 
                                src={entry.thumbnail} 
                                alt={entry.title}
                                className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-500"
                                referrerPolicy="no-referrer"
                              />
                            </div>
                            <div className="p-6 flex-1 flex flex-col">
                              <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors text-lg tracking-tight">
                                {entry.title}
                              </h3>
                              <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">{entry.description}</p>
                              <div className="mt-6 flex items-center justify-between">
                                <span className="px-2.5 py-1 bg-slate-100 text-slate-500 text-[10px] font-black uppercase rounded-lg tracking-widest group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                  {entry.category}
                                </span>
                                <ArrowRight className="w-4 h-4 text-slate-200 group-hover:text-blue-400 transition-colors" />
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
                    key="viewer"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    className="max-w-5xl mx-auto space-y-8"
                  >
                    <header className="flex items-center justify-between border-b border-slate-200 pb-6">
                      <div className="flex items-center gap-5">
                        <button 
                          onClick={() => setActiveModule(null)}
                          className="w-11 h-11 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-slate-900 hover:border-slate-300 shadow-sm transition-all"
                        >
                          <ChevronLeft className="w-6 h-6" />
                        </button>
                        <div>
                          <h2 className="font-black text-2xl text-slate-900 tracking-tight lowercase">{activeModule.title}</h2>
                          <p className="text-[10px] text-blue-600 uppercase font-black tracking-widest">{activeModule.category} Sector</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={toggleDisplay}
                          className="p-3 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all shadow-xs"
                          title="Fullscreen"
                        >
                          <Maximize2 className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => setActiveModule(null)}
                          className="p-3 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all shadow-xs"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    </header>

                    <div className="aspect-[16/9] bg-slate-900 rounded-3xl overflow-hidden shadow-2xl relative ring-8 ring-white">
                      {activeModule.isLocal ? (
                        <SnakeGame />
                      ) : activeModule.forceNewWindow ? (
                        <div className="w-full h-full bg-slate-50 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-xl p-8 text-center">
                          <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6">
                            <Sigma className="w-10 h-10 text-blue-600 animate-pulse" />
                          </div>
                          <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-2 uppercase">External Calculus Simulation Required</h3>
                          <p className="text-slate-500 max-w-md mb-8 italic">This module requires high-performance computational resources that must be initialized in a isolated viewport to maintain operational integrity.</p>
                          <button 
                            onClick={() => handleExternalLaunch(activeModule.iframeUrl)}
                            className="bg-slate-900 hover:bg-slate-800 text-white px-10 py-4 rounded-full font-black tracking-widest uppercase text-xs flex items-center gap-3 transition-all active:scale-95 shadow-xl"
                          >
                            <Play className="w-4 h-4 fill-current" /> Initialize Remote Sandbox
                          </button>
                          <p className="mt-6 text-[10px] text-slate-300 font-bold uppercase tracking-widest">Calculus Practice Index: RBX-44819</p>
                        </div>
                      ) : (
                        <iframe 
                          src={activeModule.iframeUrl} 
                          className="w-full h-full border-none bg-white"
                          allowFullScreen
                          allow="fullscreen; keyboard-attribute; gyroscope; accelerometer; mid; payment"
                          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals allow-presentation"
                          title={activeModule.title}
                        />
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pt-4">
                      <div className="md:col-span-2 space-y-8">
                        <div>
                          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 border-b border-slate-200 pb-2">Operational Brief</h4>
                          <p className="text-slate-600 leading-relaxed text-base">
                            {activeModule.description}
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-2.5">
                          {(activeModule.tags || []).map(tag => (
                            <span key={tag} className="px-4 py-1.5 bg-white border border-slate-200 rounded-full text-[10px] text-slate-400 uppercase font-bold tracking-widest">#{tag}</span>
                          ))}
                        </div>
                      </div>
                      <aside className="space-y-8">
                        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden group">
                          <div className="absolute top-0 right-0 p-4 opacity-5">
                            <Microscope className="w-12 h-12 text-blue-600" />
                          </div>
                          <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Verification Layer</h5>
                          <div className="space-y-2">
                            <div className="text-sm font-bold text-slate-800">Operational Integrity</div>
                            <div className="text-[10px] text-slate-400 uppercase tracking-wider italic">Index synchronization active</div>
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
