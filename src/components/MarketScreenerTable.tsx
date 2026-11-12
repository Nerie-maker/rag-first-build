import React, { useState, useMemo } from 'react';
import { useMarket } from '../context/MarketContext';
import { MarketAsset, AssetType } from '../types/market';
import {
  TrendingUp,
  TrendingDown,
  Bookmark,
  ArrowUpDown,
  Search,
  ExternalLink,
  SlidersHorizontal
} from 'lucide-react';

interface ScreenerTableProps {
  defaultCategory?: 'all' | AssetType;
  title?: string;
}

export const MarketScreenerTable: React.FC<ScreenerTableProps> = ({
  defaultCategory = 'all',
  title = 'Market Movers & Screeners'
}) => {
  const {
    assets,
    activeAsset,
    setActiveAsset,
    openSymbolModal,
    watchlist,
    toggleWatchlist,
    lastUpdatedPriceMap,
  } = useMarket();

  const [filterTab, setFilterTab] = useState<'active' | 'gainers' | 'losers' | 'mega' | 'all'>('active');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<'changePercent' | 'price' | 'rawVolume'>('changePercent');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  // Filter assets by category if specified
  const filteredByCategory = useMemo(() => {
    if (defaultCategory === 'all') return assets;
    return assets.filter(a => a.type === defaultCategory);
  }, [assets, defaultCategory]);

  // Apply tab filters & search
  const displayedAssets = useMemo(() => {
    let list = [...filteredByCategory];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        a => a.symbol.toLowerCase().includes(q) || a.name.toLowerCase().includes(q)
      );
    }

    // Tab logic
    if (filterTab === 'gainers') {
      list = list.filter(a => a.changePercent > 0).sort((a, b) => b.changePercent - a.changePercent);
    } else if (filterTab === 'losers') {
      list = list.filter(a => a.changePercent < 0).sort((a, b) => a.changePercent - b.changePercent);
    } else if (filterTab === 'active') {
      list = list.sort((a, b) => b.rawVolume - a.rawVolume);
    } else if (filterTab === 'mega') {
      list = list.filter(a => a.marketCap && a.marketCap.includes('T')).sort((a, b) => b.price - a.price);
    }

    // Sort by field
    list.sort((a, b) => {
      let valA = a[sortField] as number;
      let valB = b[sortField] as number;
      return sortDir === 'asc' ? valA - valB : valB - valA;
    });

    return list;
  }, [filteredByCategory, filterTab, searchQuery, sortField, sortDir]);

  const handleSort = (field: 'changePercent' | 'price' | 'rawVolume') => {
    if (sortField === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('desc');
    }
  };

  const getRatingBadge = (rating: MarketAsset['rating']) => {
    switch (rating) {
      case 'Strong Buy':
        return 'text-[#089981] font-bold';
      case 'Buy':
        return 'text-[#26a69a] font-medium';
      case 'Neutral':
        return 'text-[#787b86] font-medium';
      case 'Sell':
        return 'text-[#ef5350] font-medium';
      case 'Strong Sell':
        return 'text-[#f23645] font-bold';
      default:
        return 'text-[#787b86]';
    }
  };

  return (
    <div className="w-full bg-[#1e222d] dark:bg-[#1e222d] light:bg-white border border-[#2a2e39] dark:border-[#2a2e39] light:border-slate-200 rounded-lg overflow-hidden">
      {/* Table Header Controls */}
      <div className="px-4 py-3.5 border-b border-[#2a2e39] dark:border-[#2a2e39] light:border-slate-200 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-[#f0f3fa] dark:text-[#f0f3fa] light:text-slate-900 leading-none">
            {title}
          </h2>
          <span className="text-[11px] text-[#787b86] mt-0.5 block">
            {displayedAssets.length} financial instruments found
          </span>
        </div>

        {/* Tab switcher & Search */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center bg-[#131722] dark:bg-[#131722] light:bg-slate-100 p-0.5 rounded-lg text-xs font-semibold">
            <button
              onClick={() => setFilterTab('active')}
              className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                filterTab === 'active'
                  ? 'bg-[#2962ff] text-white shadow-xs'
                  : 'text-[#787b86] hover:text-[#f0f3fa]'
              }`}
            >
              Most Active
            </button>
            <button
              onClick={() => setFilterTab('gainers')}
              className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                filterTab === 'gainers'
                  ? 'bg-[#2962ff] text-white shadow-xs'
                  : 'text-[#787b86] hover:text-[#f0f3fa]'
              }`}
            >
              Top Gainers
            </button>
            <button
              onClick={() => setFilterTab('losers')}
              className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                filterTab === 'losers'
                  ? 'bg-[#2962ff] text-white shadow-xs'
                  : 'text-[#787b86] hover:text-[#f0f3fa]'
              }`}
            >
              Top Losers
            </button>
            <button
              onClick={() => setFilterTab('all')}
              className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                filterTab === 'all'
                  ? 'bg-[#2962ff] text-white shadow-xs'
                  : 'text-[#787b86] hover:text-[#f0f3fa]'
              }`}
            >
              All
            </button>
          </div>

          {/* Quick search input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#787b86]" />
            <input
              type="text"
              placeholder="Filter..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1 bg-[#131722] dark:bg-[#131722] light:bg-slate-100 border border-[#2a2e39] dark:border-[#2a2e39] light:border-slate-300 rounded-md text-xs text-[#f0f3fa] dark:text-[#f0f3fa] light:text-slate-900 focus:outline-none focus:border-[#2962ff] w-28 sm:w-36"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-[#2a2e39] dark:border-[#2a2e39] light:border-slate-200 text-[#787b86] font-medium bg-[#131722]/40 dark:bg-[#131722]/40 light:bg-slate-50">
              <th className="py-2.5 px-4 font-semibold">Symbol</th>
              <th
                onClick={() => handleSort('price')}
                className="py-2.5 px-3 text-right font-semibold cursor-pointer hover:text-[#f0f3fa]"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Last Price</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th
                onClick={() => handleSort('changePercent')}
                className="py-2.5 px-3 text-right font-semibold cursor-pointer hover:text-[#f0f3fa]"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Chg %</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-2.5 px-3 text-right font-semibold hidden sm:table-cell">Chg</th>
              <th className="py-2.5 px-3 text-right font-semibold hidden md:table-cell">High</th>
              <th className="py-2.5 px-3 text-right font-semibold hidden md:table-cell">Low</th>
              <th
                onClick={() => handleSort('rawVolume')}
                className="py-2.5 px-3 text-right font-semibold cursor-pointer hover:text-[#f0f3fa] hidden lg:table-cell"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Volume</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-2.5 px-3 text-right font-semibold hidden xl:table-cell">Market Cap</th>
              <th className="py-2.5 px-3 text-center font-semibold hidden sm:table-cell">Technical Rating</th>
              <th className="py-2.5 px-3 text-center font-semibold hidden lg:table-cell">Trend</th>
              <th className="py-2.5 px-3 text-right font-semibold">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2a2e39]/60 dark:divide-[#2a2e39]/60 light:divide-slate-100">
            {displayedAssets.length === 0 ? (
              <tr>
                <td colSpan={11} className="py-8 text-center text-[#787b86]">
                  No matching assets found for &ldquo;{searchQuery}&rdquo;.
                </td>
              </tr>
            ) : (
              displayedAssets.map(asset => {
                const isUp = asset.change >= 0;
                const isSelected = activeAsset.symbol === asset.symbol;
                const isWatchlisted = watchlist.includes(asset.symbol);
                const flash = lastUpdatedPriceMap[asset.symbol];

                // Sparkline
                const spark = asset.sparkline.length > 0 ? asset.sparkline : [100, 101, 102];
                const minS = Math.min(...spark);
                const maxS = Math.max(...spark);
                const rng = maxS - minS || 1;
                const sparkD = spark
                  .map((v, i) => {
                    const x = (i / (spark.length - 1)) * 60;
                    const y = 20 - ((v - minS) / rng) * 16 - 2;
                    return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
                  })
                  .join(' ');

                return (
                  <tr
                    key={asset.symbol}
                    onClick={() => setActiveAsset(asset)}
                    className={`hover:bg-[#2a2e39]/40 dark:hover:bg-[#2a2e39]/40 light:hover:bg-slate-100/70 transition-colors cursor-pointer group ${
                      isSelected ? 'bg-[#2a2e39]/60 dark:bg-[#2a2e39]/60 light:bg-slate-100' : ''
                    } ${
                      flash === 'up'
                        ? 'bg-emerald-500/10'
                        : flash === 'down'
                        ? 'bg-rose-500/10'
                        : ''
                    }`}
                  >
                    {/* Symbol & Name */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleWatchlist(asset.symbol);
                          }}
                          className={`p-1 rounded hover:bg-[#2a2e39] transition-colors ${
                            isWatchlisted ? 'text-[#2962ff]' : 'text-[#787b86] opacity-0 group-hover:opacity-100'
                          }`}
                          title={isWatchlisted ? 'Remove from Watchlist' : 'Add to Watchlist'}
                        >
                          <Bookmark className="w-3.5 h-3.5" />
                        </button>

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
                          <div className="font-bold text-[#f0f3fa] dark:text-[#f0f3fa] light:text-slate-900 group-hover:text-[#2962ff] transition-colors flex items-center gap-1.5">
                            <span>{asset.symbol}</span>
                            <span className="text-[10px] text-[#787b86] font-normal uppercase hidden sm:inline">
                              {asset.exchange}
                            </span>
                          </div>
                          <div className="text-[11px] text-[#787b86] truncate max-w-[140px] sm:max-w-[180px]">
                            {asset.name}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Price */}
                    <td className="py-3 px-3 text-right tabular-nums font-bold text-[#f0f3fa] dark:text-[#f0f3fa] light:text-slate-900">
                      {asset.type === 'forex' ? asset.price.toFixed(4) : asset.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      {asset.type === 'bond' ? '%' : ''}
                    </td>

                    {/* Change % */}
                    <td className="py-3 px-3 text-right tabular-nums font-semibold">
                      <span
                        className={`inline-flex items-center gap-0.5 ${
                          isUp ? 'text-[#089981]' : 'text-[#f23645]'
                        }`}
                      >
                        {isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        {isUp ? '+' : ''}
                        {asset.changePercent.toFixed(2)}%
                      </span>
                    </td>

                    {/* Change */}
                    <td className="py-3 px-3 text-right tabular-nums font-medium text-[#787b86] hidden sm:table-cell">
                      {isUp ? '+' : ''}
                      {asset.change.toFixed(asset.type === 'forex' ? 4 : 2)}
                    </td>

                    {/* High */}
                    <td className="py-3 px-3 text-right tabular-nums text-[#787b86] hidden md:table-cell">
                      {asset.high.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>

                    {/* Low */}
                    <td className="py-3 px-3 text-right tabular-nums text-[#787b86] hidden md:table-cell">
                      {asset.low.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>

                    {/* Volume */}
                    <td className="py-3 px-3 text-right tabular-nums text-[#787b86] hidden lg:table-cell">
                      {asset.volume}
                    </td>

                    {/* Market Cap */}
                    <td className="py-3 px-3 text-right tabular-nums text-[#787b86] hidden xl:table-cell">
                      {asset.marketCap || '—'}
                    </td>

                    {/* Technical Rating */}
                    <td className="py-3 px-3 text-center hidden sm:table-cell">
                      <span className={`text-[11px] ${getRatingBadge(asset.rating)}`}>
                        {asset.rating}
                      </span>
                    </td>

                    {/* Sparkline */}
                    <td className="py-3 px-3 text-center hidden lg:table-cell">
                      <div className="flex justify-center">
                        <svg width="60" height="20" className="overflow-visible">
                          <path
                            d={sparkD}
                            fill="none"
                            stroke={isUp ? '#089981' : '#f23645'}
                            strokeWidth="1.5"
                            strokeLinecap="round"
                          />
                        </svg>
                      </div>
                    </td>

                    {/* Action */}
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openSymbolModal(asset);
                        }}
                        className="px-2.5 py-1 rounded bg-[#2a2e39]/60 hover:bg-[#2962ff] text-[#d1d4dc] hover:text-white transition-colors text-[11px] font-semibold cursor-pointer"
                        title="View Full Profile & Trade"
                      >
                        Trade
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
