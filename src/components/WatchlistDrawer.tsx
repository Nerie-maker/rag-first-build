import React, { useState } from 'react';
import { useMarket } from '../context/MarketContext';
import {
  X,
  Plus,
  Trash2,
  TrendingUp,
  TrendingDown,
  Search,
  ExternalLink
} from 'lucide-react';

export const WatchlistDrawer: React.FC = () => {
  const {
    isWatchlistOpen,
    setIsWatchlistOpen,
    watchlist,
    toggleWatchlist,
    assets,
    activeAsset,
    setActiveAsset,
    openSymbolModal,
    lastUpdatedPriceMap,
  } = useMarket();

  const [searchAdd, setSearchAdd] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  if (!isWatchlistOpen) return null;

  const watchlistAssets = watchlist
    .map(sym => assets.find(a => a.symbol === sym))
    .filter(Boolean);

  // Available assets to add
  const availableToAdd = assets
    .filter(a => !watchlist.includes(a.symbol))
    .filter(
      a =>
        !searchAdd ||
        a.symbol.toLowerCase().includes(searchAdd.toLowerCase()) ||
        a.name.toLowerCase().includes(searchAdd.toLowerCase())
    )
    .slice(0, 8);

  return (
    <div
      className="fixed inset-y-0 right-0 z-50 w-80 sm:w-96 bg-[#1e222d] dark:bg-[#1e222d] light:bg-white border-l border-[#2a2e39] dark:border-[#2a2e39] light:border-slate-200 shadow-2xl flex flex-col"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="p-4 border-b border-[#2a2e39] dark:border-[#2a2e39] light:border-slate-200 flex items-center justify-between bg-[#131722]/60">
        <div>
          <h3 className="text-sm font-bold text-[#f0f3fa] dark:text-[#f0f3fa] light:text-slate-900 leading-none">
            Watchlist
          </h3>
          <span className="text-[11px] text-[#787b86] mt-0.5 block">
            {watchlist.length} pinned instruments
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setIsAdding(!isAdding)}
            className={`p-1.5 rounded text-xs flex items-center gap-1 transition-colors cursor-pointer ${
              isAdding
                ? 'bg-[#2962ff] text-white'
                : 'bg-[#2a2e39] text-[#d1d4dc] hover:text-white'
            }`}
            title="Add symbol to watchlist"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="text-[11px] font-semibold">Add</span>
          </button>
          <button
            onClick={() => setIsWatchlistOpen(false)}
            className="p-1.5 rounded text-[#787b86] hover:text-[#f0f3fa] hover:bg-[#2a2e39] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Add Symbol Dropdown Panel */}
      {isAdding && (
        <div className="p-3 border-b border-[#2a2e39] bg-[#131722] space-y-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#787b86]" />
            <input
              type="text"
              placeholder="Search ticker to add..."
              value={searchAdd}
              onChange={(e) => setSearchAdd(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-[#1e222d] border border-[#2a2e39] rounded text-xs text-[#f0f3fa] focus:outline-none focus:border-[#2962ff]"
              autoFocus
            />
          </div>

          <div className="max-h-48 overflow-y-auto space-y-1">
            {availableToAdd.map(item => (
              <div
                key={item.symbol}
                onClick={() => {
                  toggleWatchlist(item.symbol);
                  setSearchAdd('');
                }}
                className="flex items-center justify-between p-2 rounded hover:bg-[#2a2e39] cursor-pointer text-xs"
              >
                <div>
                  <span className="font-bold text-[#f0f3fa] mr-1.5">{item.symbol}</span>
                  <span className="text-[11px] text-[#787b86]">{item.name}</span>
                </div>
                <button className="text-[#089981] hover:text-emerald-400 font-semibold text-[11px] flex items-center gap-0.5">
                  <Plus className="w-3 h-3" /> Add
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Watchlist Items */}
      <div className="flex-1 overflow-y-auto divide-y divide-[#2a2e39]/60">
        {watchlistAssets.length === 0 ? (
          <div className="p-6 text-center text-[#787b86] text-xs">
            No symbols in your watchlist. Click &quot;+ Add&quot; or the bookmark icon on any asset to track it.
          </div>
        ) : (
          watchlistAssets.map(asset => {
            if (!asset) return null;
            const isUp = asset.change >= 0;
            const isSelected = activeAsset.symbol === asset.symbol;
            const flash = lastUpdatedPriceMap[asset.symbol];

            return (
              <div
                key={asset.symbol}
                onClick={() => setActiveAsset(asset)}
                className={`p-3 flex items-center justify-between transition-colors cursor-pointer group ${
                  isSelected
                    ? 'bg-[#2a2e39]/80 border-l-2 border-[#2962ff]'
                    : 'hover:bg-[#2a2e39]/40'
                } ${
                  flash === 'up'
                    ? 'bg-emerald-500/10'
                    : flash === 'down'
                    ? 'bg-rose-500/10'
                    : ''
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {asset.logoUrl ? (
                    <img
                      src={asset.logoUrl}
                      alt={asset.symbol}
                      className="w-5 h-5 rounded-full object-contain shrink-0 bg-white p-0.5"
                      referrerPolicy="no-referrer"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-[#2962ff]/20 text-[#2962ff] text-[10px] font-bold flex items-center justify-center shrink-0">
                      {asset.symbol.slice(0, 2)}
                    </div>
                  )}

                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-xs text-[#f0f3fa] group-hover:text-[#2962ff]">
                        {asset.symbol}
                      </span>
                      <span className="text-[10px] text-[#787b86] uppercase">
                        {asset.exchange}
                      </span>
                    </div>
                    <span className="text-[11px] text-[#787b86] truncate block max-w-[120px]">
                      {asset.name}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-xs font-bold tabular-nums text-[#f0f3fa]">
                      {asset.type === 'forex' ? asset.price.toFixed(4) : asset.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                    <div
                      className={`text-[11px] font-semibold tabular-nums flex items-center justify-end ${
                        isUp ? 'text-[#089981]' : 'text-[#f23645]'
                      }`}
                    >
                      {isUp ? <TrendingUp className="w-2.5 h-2.5 mr-0.5 inline" /> : <TrendingDown className="w-2.5 h-2.5 mr-0.5 inline" />}
                      {isUp ? '+' : ''}
                      {asset.changePercent.toFixed(2)}%
                    </div>
                  </div>

                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openSymbolModal(asset);
                      }}
                      className="p-1 rounded text-[#787b86] hover:text-[#2962ff] hover:bg-[#2a2e39]"
                      title="Open Detail View"
                    >
                      <ExternalLink className="w-3 h-3" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWatchlist(asset.symbol);
                      }}
                      className="p-1 rounded text-[#787b86] hover:text-[#f23645] hover:bg-[#2a2e39]"
                      title="Remove from Watchlist"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
