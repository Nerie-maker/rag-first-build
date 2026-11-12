import React from 'react';
import { useMarket } from '../context/MarketContext';
import {
  Search,
  Bookmark,
  Briefcase,
  Sun,
  Moon,
  Radio,
  Pause,
  Play
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    setIsSearchOpen,
    isWatchlistOpen,
    setIsWatchlistOpen,
    watchlist,
    portfolio,
    setIsPaperTradingOpen,
    theme,
    toggleTheme,
    isLiveStreaming,
    setIsLiveStreaming,
  } = useMarket();

  // Calculate portfolio total value
  const totalInvested = portfolio.positions.reduce((acc, p) => acc + p.totalValue, 0);
  const totalValue = portfolio.cash + totalInvested;
  const totalPnl = totalValue - 100000;
  const isPnlPositive = totalPnl >= 0;

  return (
    <header className="sticky top-0 z-40 w-full bg-[#131722] dark:bg-[#131722] light:bg-white border-b border-[#2a2e39] dark:border-[#2a2e39] light:border-slate-200">
      <div className="max-w-[1720px] mx-auto px-4 lg:px-6 h-14 flex items-center justify-between gap-6">
        
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setActiveTab('overview')}
            className="flex items-center gap-2.5 text-left group cursor-pointer"
          >
            {/* Iconic TradingView Geometric Logo */}
            <div className="w-8 h-8 rounded bg-[#2962ff] flex items-center justify-center text-white font-black text-xs shadow-sm">
              <svg viewBox="0 0 32 32" className="w-5 h-5 fill-current">
                <rect x="5" y="10" width="5" height="12" rx="1.5" />
                <rect x="13.5" y="6" width="5" height="20" rx="1.5" />
                <rect x="22" y="14" width="5" height="8" rx="1.5" />
              </svg>
            </div>
            <div>
              <span className="text-base font-bold tracking-tight text-[#f0f3fa] dark:text-[#f0f3fa] light:text-slate-900 leading-none block">
                TradingView
              </span>
              <span className="text-[10px] font-semibold tracking-wider uppercase text-[#787b86] dark:text-[#787b86] light:text-slate-500 block mt-0.5">
                Markets
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Navigation Links (Single-line, clean hover states) */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2 text-xs font-semibold text-[#787b86] dark:text-[#787b86] light:text-slate-600">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 rounded transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'overview'
                ? 'text-[#f0f3fa] dark:text-[#f0f3fa] light:text-slate-900 bg-[#2a2e39]/60 dark:bg-[#2a2e39]/60 light:bg-slate-100'
                : 'hover:text-[#f0f3fa] dark:hover:text-[#f0f3fa] light:hover:text-slate-900'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('stocks')}
            className={`px-3 py-1.5 rounded transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'stocks'
                ? 'text-[#f0f3fa] dark:text-[#f0f3fa] light:text-slate-900 bg-[#2a2e39]/60 dark:bg-[#2a2e39]/60 light:bg-slate-100'
                : 'hover:text-[#f0f3fa] dark:hover:text-[#f0f3fa] light:hover:text-slate-900'
            }`}
          >
            Stocks
          </button>
          <button
            onClick={() => setActiveTab('crypto')}
            className={`px-3 py-1.5 rounded transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'crypto'
                ? 'text-[#f0f3fa] dark:text-[#f0f3fa] light:text-slate-900 bg-[#2a2e39]/60 dark:bg-[#2a2e39]/60 light:bg-slate-100'
                : 'hover:text-[#f0f3fa] dark:hover:text-[#f0f3fa] light:hover:text-slate-900'
            }`}
          >
            Crypto
          </button>
          <button
            onClick={() => setActiveTab('forex')}
            className={`px-3 py-1.5 rounded transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'forex'
                ? 'text-[#f0f3fa] dark:text-[#f0f3fa] light:text-slate-900 bg-[#2a2e39]/60 dark:bg-[#2a2e39]/60 light:bg-slate-100'
                : 'hover:text-[#f0f3fa] dark:hover:text-[#f0f3fa] light:hover:text-slate-900'
            }`}
          >
            Forex
          </button>
          <button
            onClick={() => setActiveTab('heatmap')}
            className={`px-3 py-1.5 rounded transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'heatmap'
                ? 'text-[#f0f3fa] dark:text-[#f0f3fa] light:text-slate-900 bg-[#2a2e39]/60 dark:bg-[#2a2e39]/60 light:bg-slate-100'
                : 'hover:text-[#f0f3fa] dark:hover:text-[#f0f3fa] light:hover:text-slate-900'
            }`}
          >
            Heatmap
          </button>
          <button
            onClick={() => setActiveTab('calendar')}
            className={`px-3 py-1.5 rounded transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'calendar'
                ? 'text-[#f0f3fa] dark:text-[#f0f3fa] light:text-slate-900 bg-[#2a2e39]/60 dark:bg-[#2a2e39]/60 light:bg-slate-100'
                : 'hover:text-[#f0f3fa] dark:hover:text-[#f0f3fa] light:hover:text-slate-900'
            }`}
          >
            Calendar
          </button>
          <button
            onClick={() => setActiveTab('news')}
            className={`px-3 py-1.5 rounded transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'news'
                ? 'text-[#f0f3fa] dark:text-[#f0f3fa] light:text-slate-900 bg-[#2a2e39]/60 dark:bg-[#2a2e39]/60 light:bg-slate-100'
                : 'hover:text-[#f0f3fa] dark:hover:text-[#f0f3fa] light:hover:text-slate-900'
            }`}
          >
            News
          </button>
        </nav>

        {/* Zone 3: Search, Watchlist, Paper Trading, Theme, Live Status */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Quick Search */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#1e222d] dark:bg-[#1e222d] light:bg-slate-100 text-[#787b86] hover:text-[#f0f3fa] dark:hover:text-[#f0f3fa] light:hover:text-slate-900 border border-[#2a2e39] dark:border-[#2a2e39] light:border-slate-300 text-xs transition-colors cursor-pointer"
            title="Search symbols (Ctrl+K)"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Search market (Ctrl+K)</span>
            <kbd className="hidden md:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-[#2a2e39]/70 dark:bg-[#2a2e39]/70 light:bg-slate-200 text-[#787b86] dark:text-[#787b86] light:text-slate-600 rounded">
              ⌘K
            </kbd>
          </button>

          {/* Paper Trading Account Badge */}
          <button
            onClick={() => setIsPaperTradingOpen(true)}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-[#1e222d] dark:bg-[#1e222d] light:bg-slate-100 border border-[#2a2e39] dark:border-[#2a2e39] light:border-slate-300 text-xs cursor-pointer hover:border-[#2962ff] transition-colors"
            title="Open Paper Trading Portfolio"
          >
            <Briefcase className="w-3.5 h-3.5 text-[#2962ff]" />
            <div className="text-left hidden sm:block">
              <span className="text-[10px] text-[#787b86] block leading-none">Paper Trade</span>
              <span className="tabular-nums font-bold text-[#f0f3fa] dark:text-[#f0f3fa] light:text-slate-900 leading-tight block">
                ${totalValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </span>
            </div>
            <span
              className={`tabular-nums text-[10px] font-bold px-1.5 py-0.5 rounded ${
                isPnlPositive
                  ? 'bg-[#089981]/20 text-[#089981]'
                  : 'bg-[#f23645]/20 text-[#f23645]'
              }`}
            >
              {isPnlPositive ? '+' : ''}
              {totalPnl >= 0 ? `$${totalPnl.toFixed(0)}` : `-$${Math.abs(totalPnl).toFixed(0)}`}
            </span>
          </button>

          {/* Watchlist Toggle */}
          <button
            onClick={() => setIsWatchlistOpen(!isWatchlistOpen)}
            className={`relative p-2 rounded-lg border transition-colors cursor-pointer ${
              isWatchlistOpen
                ? 'bg-[#2962ff]/20 border-[#2962ff] text-[#2962ff]'
                : 'bg-[#1e222d] dark:bg-[#1e222d] light:bg-slate-100 border-[#2a2e39] dark:border-[#2a2e39] light:border-slate-300 text-[#787b86] hover:text-[#f0f3fa]'
            }`}
            title="Toggle Watchlist"
          >
            <Bookmark className="w-4 h-4" />
            {watchlist.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#2962ff] text-white text-[9px] font-bold flex items-center justify-center">
                {watchlist.length}
              </span>
            )}
          </button>

          {/* Live Feed Simulator Pause/Play */}
          <button
            onClick={() => setIsLiveStreaming(!isLiveStreaming)}
            className={`p-2 rounded-lg border transition-colors cursor-pointer ${
              isLiveStreaming
                ? 'bg-[#089981]/10 border-[#089981]/40 text-[#089981]'
                : 'bg-[#1e222d] dark:bg-[#1e222d] light:bg-slate-100 border-[#2a2e39] text-[#787b86]'
            }`}
            title={isLiveStreaming ? 'Live Data Feed Active (Click to Pause)' : 'Data Feed Paused (Click to Resume)'}
          >
            {isLiveStreaming ? <Radio className="w-4 h-4 animate-pulse" /> : <Play className="w-4 h-4" />}
          </button>

          {/* Theme Switcher */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-[#1e222d] dark:bg-[#1e222d] light:bg-slate-100 border border-[#2a2e39] dark:border-[#2a2e39] light:border-slate-300 text-[#787b86] hover:text-[#f0f3fa] transition-colors cursor-pointer"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>

        </div>
      </div>
    </header>
  );
};
