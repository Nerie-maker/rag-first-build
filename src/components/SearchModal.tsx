import React, { useState, useEffect, useRef } from 'react';
import { useMarket } from '../context/MarketContext';
import { Search, X, TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';
import { AssetType } from '../types/market';

export const SearchModal: React.FC = () => {
  const { isSearchOpen, setIsSearchOpen, assets, setActiveAsset, openSymbolModal } = useMarket();
  const [query, setQuery] = useState('');
  const [selectedType, setSelectedType] = useState<AssetType | 'all'>('all');
  const inputRef = useRef<HTMLInputElement>(null);

  // Global keydown listener for Cmd+K or Ctrl+K or /
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      } else if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen]);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isSearchOpen]);

  if (!isSearchOpen) return null;

  const filtered = assets
    .filter(a => selectedType === 'all' || a.type === selectedType)
    .filter(a => {
      if (!query.trim()) return true;
      const q = query.toLowerCase();
      return (
        a.symbol.toLowerCase().includes(q) ||
        a.name.toLowerCase().includes(q) ||
        a.exchange.toLowerCase().includes(q)
      );
    })
    .slice(0, 12);

  const handleSelect = (asset: (typeof assets)[0]) => {
    setActiveAsset(asset);
    setIsSearchOpen(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-3 bg-black/80 backdrop-blur-xs"
      onClick={() => setIsSearchOpen(false)}
    >
      <div
        className="w-full max-w-2xl bg-[#1e222d] dark:bg-[#1e222d] light:bg-white border border-[#2a2e39] dark:border-[#2a2e39] light:border-slate-200 rounded-xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="p-3 sm:p-4 border-b border-[#2a2e39] flex items-center gap-3 bg-[#131722]">
          <Search className="w-5 h-5 text-[#2962ff] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search symbol, company, or currency (e.g. NVDA, Bitcoin, EURUSD)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm text-[#f0f3fa] focus:outline-none placeholder:text-[#787b86]"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded text-[#787b86] hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-[#2a2e39] text-[#787b86] rounded">
            ESC
          </kbd>
        </div>

        {/* Filter Type Pills */}
        <div className="px-4 py-2 border-b border-[#2a2e39] flex items-center gap-1.5 text-xs overflow-x-auto no-scrollbar bg-[#181b24]">
          {(['all', 'stock', 'crypto', 'forex', 'index', 'futures', 'bond'] as const).map(type => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
                selectedType === type
                  ? 'bg-[#2962ff] text-white'
                  : 'text-[#787b86] hover:text-[#f0f3fa] hover:bg-[#2a2e39]'
              }`}
            >
              {type === 'all' ? 'All Instruments' : type}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto divide-y divide-[#2a2e39]/60">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-[#787b86] text-xs">
              No matching instruments found for &ldquo;{query}&rdquo;.
            </div>
          ) : (
            filtered.map(asset => {
              const isUp = asset.change >= 0;

              return (
                <div
                  key={asset.symbol}
                  onClick={() => handleSelect(asset)}
                  className="p-3.5 flex items-center justify-between hover:bg-[#2a2e39]/50 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    {asset.logoUrl ? (
                      <img
                        src={asset.logoUrl}
                        alt={asset.symbol}
                        className="w-6 h-6 rounded-full object-contain shrink-0 bg-white p-0.5"
                        referrerPolicy="no-referrer"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                      />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-[#2962ff]/20 text-[#2962ff] text-[10px] font-bold flex items-center justify-center shrink-0">
                        {asset.symbol.slice(0, 2)}
                      </div>
                    )}

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-[#f0f3fa] group-hover:text-[#2962ff]">
                          {asset.symbol}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#2a2e39] text-[#787b86] font-mono uppercase">
                          {asset.type}
                        </span>
                        <span className="text-[10px] text-[#787b86] uppercase">
                          {asset.exchange}
                        </span>
                      </div>
                      <span className="text-xs text-[#787b86]">{asset.name}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-right">
                    <div>
                      <div className="font-bold tabular-nums text-xs text-[#f0f3fa]">
                        {asset.type === 'forex' ? asset.price.toFixed(4) : asset.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        {asset.type === 'bond' ? '%' : ''}
                      </div>
                      <div
                        className={`text-[11px] font-semibold tabular-nums flex items-center justify-end ${
                          isUp ? 'text-[#089981]' : 'text-[#f23645]'
                        }`}
                      >
                        {isUp ? <TrendingUp className="w-3 h-3 mr-0.5 inline" /> : <TrendingDown className="w-3 h-3 mr-0.5 inline" />}
                        {isUp ? '+' : ''}
                        {asset.changePercent.toFixed(2)}%
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#787b86] opacity-0 group-hover:opacity-100 group-hover:text-[#2962ff] transition-opacity" />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
