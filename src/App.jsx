/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from 'react';
import { Search, Gamepad2, X, Maximize2, Trophy, Zap, ChevronLeft, Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import gamesData from './data/games.json';

const CATEGORIES = ["All", "Action", "Puzzle", "Arcade", "Classic", "Strategy"];

export default function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [activeGame, setActiveGame] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const filteredGames = useMemo(() => {
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
    <div className="min-h-screen flex flex-col bg-bg-main">
      {/* Navigation */}
      <nav className="h-16 bg-surface border-b border-border flex items-center justify-between px-6 sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <button 
            className="lg:hidden p-2 -ml-2 text-text-secondary hover:text-text-main"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <Menu className="w-5 h-5" />
          </button>
          <div 
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => { setActiveGame(null); setSelectedCategory("All"); setSearchQuery(""); }}
          >
            <div className="w-8 h-8 bg-accent flex items-center justify-center rounded-md">
              <Gamepad2 className="text-white w-5 h-5" />
            </div>
            <span className="font-bold text-lg tracking-tight text-accent">ArcadeBase</span>
          </div>
        </div>

        <div className="hidden md:block relative w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input 
            type="text"
            placeholder="Search games..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-bg-main border-none rounded-md py-2 pl-10 pr-4 text-sm text-text-main placeholder:text-text-muted focus:ring-1 focus:ring-accent transition-all"
          />
        </div>

        <div className="flex items-center gap-6 text-sm font-medium text-text-main h-full">
          <span className="cursor-pointer hover:text-accent border-b-2 border-transparent hover:border-accent h-full flex items-center px-1">Leaderboards</span>
          <span className="cursor-pointer hover:text-accent border-b-2 border-transparent hover:border-accent h-full flex items-center px-1">Community</span>
        </div>
      </nav>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Sidebar */}
        <aside className={`
          fixed lg:relative z-40 lg:z-0
          w-64 bg-surface border-r border-border h-[calc(100vh-64px)] overflow-y-auto
          transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <div className="p-6">
            <div className="text-[11px] font-bold text-text-muted uppercase tracking-wider mb-4">Categories</div>
            <ul className="space-y-1">
              {CATEGORIES.map(cat => (
                <li 
                  key={cat}
                  onClick={() => { setSelectedCategory(cat); setIsSidebarOpen(false); setActiveGame(null); }}
                  className={`
                    px-3 py-2 text-sm rounded-md cursor-pointer transition-colors
                    ${selectedCategory === cat 
                      ? "text-accent bg-accent/5 font-semibold" 
                      : "text-text-secondary hover:text-text-main hover:bg-bg-main"}
                  `}
                >
                  {cat === "All" ? "All Games" : cat}
                </li>
              ))}
            </ul>

            <div className="mt-12">
              <div className="text-[11px] font-bold text-text-muted uppercase tracking-wider mb-4">Stats</div>
              <div className="text-xs text-text-secondary space-y-2">
                <div className="flex justify-between">
                  <span>Active Players</span>
                  <span className="font-medium text-text-main">1,204</span>
                </div>
                <div className="flex justify-between">
                  <span>Games Hosted</span>
                  <span className="font-medium text-text-main">86</span>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Mobile Sidebar Overlay */}
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 lg:hidden"
            />
          )}
        </AnimatePresence>

        {/* Main Area */}
        <main className="flex-1 overflow-y-auto p-8 lg:p-12">
          <AnimatePresence mode="wait">
            {!activeGame ? (
              <motion.div 
                key="grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="mb-8">
                  <h1 className="text-2xl font-bold mb-1">{selectedCategory === "All" ? "Trending Now" : selectedCategory}</h1>
                  <p className="text-text-secondary text-sm">Selected unblocked games from our library.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                  {filteredGames.length > 0 ? (
                    filteredGames.map((game) => (
                      <motion.div
                        key={game.id}
                        layoutId={game.id}
                        onClick={() => setActiveGame(game)}
                        className="group bg-surface rounded-xl border border-border overflow-hidden hover:shadow-md transition-all cursor-pointer flex flex-col h-full"
                      >
                        <div className="aspect-[16/10] bg-zinc-100 flex items-center justify-center text-3xl">
                          <img 
                            src={game.thumbnail} 
                            alt={game.title}
                            className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all opacity-90 group-hover:opacity-100"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div className="p-5 flex-1 flex flex-col">
                          <h3 className="font-semibold text-text-main group-hover:text-accent transition-colors mb-0.5">
                            {game.title}
                          </h3>
                          <div className="text-xs text-text-secondary mb-3 flex items-center gap-1">
                            By {game.tags[0] || 'Unknown'} 
                          </div>
                          <div className="mt-auto">
                            <span className="inline-block px-2 py-1 bg-accent/10 text-accent text-[10px] font-bold uppercase rounded tracking-wide">
                              {game.category}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="col-span-full py-20 text-center text-text-muted">
                      <p className="text-sm">No games found in this category.</p>
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
                <div className="flex items-center justify-between border-b border-border pb-4 mb-2">
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => setActiveGame(null)}
                      className="p-2 -ml-2 text-text-secondary hover:text-text-main transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <div>
                      <h2 className="font-bold text-xl">{activeGame.title}</h2>
                      <p className="text-xs text-text-secondary uppercase font-semibold tracking-wider">{activeGame.category}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={toggleFullscreen}
                      className="p-2 text-text-secondary hover:text-accent transition-colors"
                      title="Fullscreen"
                    >
                      <Maximize2 className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => setActiveGame(null)}
                      className="p-2 text-text-secondary hover:text-red-500 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="w-full aspect-video bg-zinc-200 rounded-xl overflow-hidden border border-border shadow-sm relative">
                  <iframe 
                    src={activeGame.iframeUrl} 
                    className="w-full h-full border-none"
                    allowFullScreen
                    allow="autoplay; fullscreen; keyboard-attribute; gyroscope; accelerometer; mid; payment"
                    sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals allow-presentation"
                    title={activeGame.title}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-4">
                  <div className="md:col-span-2 space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-tight text-text-muted">About this game</h4>
                    <p className="text-text-secondary leading-relaxed text-sm">
                      {activeGame.description}
                    </p>
                    <div className="flex gap-2">
                      {activeGame.tags.map(tag => (
                        <span key={tag} className="px-2 py-1 bg-bg-main border border-border rounded text-[10px] text-text-secondary uppercase font-medium">#{tag}</span>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-text-main border-b border-border pb-2">
                      <Trophy className="w-4 h-4 text-accent" />
                      <span className="font-bold text-xs uppercase tracking-tight">Leaderboard</span>
                    </div>
                    <div className="text-[11px] text-text-muted italic">
                      Coming soon to ArcadeBase...
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* Footer */}
      <footer className="h-10 bg-surface border-t border-border flex items-center justify-between px-8 text-[11px] text-text-muted">
        <div>v2.4.0 • PortalGames Unblocked</div>
        <div className="flex gap-4">
          <span className="hover:text-text-secondary cursor-pointer transition-colors">Terms of Service</span>
          <span className="hover:text-text-secondary cursor-pointer transition-colors">Privacy Policy</span>
        </div>
      </footer>
    </div>
  );
}
