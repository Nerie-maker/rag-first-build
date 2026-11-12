import React from 'react';
import { useMarket } from '../context/MarketContext';
import { MarketAsset } from '../types/market';
import { TrendingUp, TrendingDown, ArrowUpRight } from 'lucide-react';

export const OverviewHero: React.FC = () => {
  const { assets, activeAsset, setActiveAsset, openSymbolModal, lastUpdatedPriceMap } = useMarket();

  // 4 hero cards: S&P 500, Nasdaq 100, Bitcoin, Gold
  const heroSymbols = ['SPX', 'NDX', 'BTCUSD', 'XAUUSD'];
  const heroAssets = heroSymbols
    .map(sym => assets.find(a => a.symbol === sym))
    .filter((a): a is MarketAsset => Boolean(a));

  return (
    <div className="w-full mb-6">
      {/* Editorial Title & Kicker */}
      <div className="mb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#f0f3fa] dark:text-[#f0f3fa] light:text-slate-900 text-balance">
            Markets Today
          </h1>
          <p className="text-xs sm:text-sm text-[#787b86] dark:text-[#787b86] light:text-slate-600 mt-1">
            Real-time quotes, technical momentum, and global liquidity streams
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-[#787b86]">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#089981] animate-pulse"></span>
            US Market Open
          </span>
          <span>·</span>
          <span>NYSE / NASDAQ / CME</span>
        </div>
      </div>

      {/* 4 Index Hero Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {heroAssets.map(asset => {
          const isUp = asset.change >= 0;
          const isActive = activeAsset.symbol === asset.symbol;
          const flash = lastUpdatedPriceMap[asset.symbol];

          // Compute day range % position
          const range = asset.high - asset.low || 1;
          const posPct = Math.max(0, Math.min(100, ((asset.price - asset.low) / range) * 100));

          // Mini Sparkline SVG path
          const sparkPoints = asset.sparkline.length > 0 ? asset.sparkline : [100, 102, 101, 104, 103, 106];
          const minSpark = Math.min(...sparkPoints);
          const maxSpark = Math.max(...sparkPoints);
          const sparkRange = maxSpark - minSpark || 1;
          const sparkWidth = 110;
          const sparkHeight = 36;
          const pathD = sparkPoints
            .map((val, idx) => {
              const x = (idx / (sparkPoints.length - 1)) * sparkWidth;
              const y = sparkHeight - ((val - minSpark) / sparkRange) * (sparkHeight - 6) - 3;
              return `${idx === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
            })
            .join(' ');

          return (
            <div
              key={asset.symbol}
              onClick={() => setActiveAsset(asset)}
              onDoubleClick={() => openSymbolModal(asset)}
              className={`p-3.5 rounded-lg border transition-all cursor-pointer relative group ${
                isActive
                  ? 'bg-[#1e222d] dark:bg-[#1e222d] light:bg-white border-[#2962ff] shadow-md ring-1 ring-[#2962ff]/40'
                  : 'bg-[#1e222d]/70 dark:bg-[#1e222d]/70 light:bg-white border-[#2a2e39] dark:border-[#2a2e39] light:border-slate-200 hover:border-[#787b86]/40'
              } ${
                flash === 'up'
                  ? 'bg-emerald-500/10'
                  : flash === 'down'
                  ? 'bg-rose-500/10'
                  : ''
              }`}
            >
              {/* Header: Logo, Name, Symbol */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {asset.logoUrl ? (
                    <img
                      src={asset.logoUrl}
                      alt={asset.symbol}
                      className="w-5 h-5 rounded-full object-contain shrink-0 bg-white p-0.5"
                      referrerPolicy="no-referrer"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-[#2962ff]/20 text-[#2962ff] font-bold text-[10px] flex items-center justify-center shrink-0">
                      {asset.symbol.slice(0, 2)}
                    </div>
                  )}
                  <div>
                    <span className="text-xs font-bold text-[#f0f3fa] dark:text-[#f0f3fa] light:text-slate-900 block leading-tight">
                      {asset.symbol}
                    </span>
                    <span className="text-[10px] text-[#787b86] block truncate max-w-[110px]">
                      {asset.name}
                    </span>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openSymbolModal(asset);
                  }}
                  className="p-1 rounded text-[#787b86] hover:text-[#2962ff] hover:bg-[#2a2e39]/50 transition-colors opacity-0 group-hover:opacity-100"
                  title="Expand deep-dive view"
                >
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Price & Sparkline row */}
              <div className="flex items-end justify-between gap-2 mt-1">
                <div>
                  <div className="text-lg font-bold tabular-nums text-[#f0f3fa] dark:text-[#f0f3fa] light:text-slate-900 leading-none">
                    {asset.type === 'forex' ? asset.price.toFixed(4) : asset.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  <div
                    className={`flex items-center gap-1 text-xs font-semibold tabular-nums mt-1 ${
                      isUp ? 'text-[#089981]' : 'text-[#f23645]'
                    }`}
                  >
                    {isUp ? (
                      <TrendingUp className="w-3 h-3 shrink-0" />
                    ) : (
                      <TrendingDown className="w-3 h-3 shrink-0" />
                    )}
                    <span>
                      {isUp ? '+' : ''}
                      {asset.changePercent.toFixed(2)}%
                    </span>
                    <span className="text-[10px] opacity-75">
                      ({isUp ? '+' : ''}{asset.change.toFixed(2)})
                    </span>
                  </div>
                </div>

                {/* Mini SVG Sparkline */}
                <div className="shrink-0">
                  <svg width={sparkWidth} height={sparkHeight} className="overflow-visible">
                    <path
                      d={pathD}
                      fill="none"
                      stroke={isUp ? '#089981' : '#f23645'}
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>

              {/* Day's Range Meter */}
              <div className="mt-3 pt-2.5 border-t border-[#2a2e39]/60 dark:border-[#2a2e39]/60 light:border-slate-100">
                <div className="flex items-center justify-between text-[10px] text-[#787b86] font-mono mb-1">
                  <span>L: {asset.low.toLocaleString()}</span>
                  <span className="text-[9px] uppercase tracking-wider font-sans">Day Range</span>
                  <span>H: {asset.high.toLocaleString()}</span>
                </div>
                <div className="w-full h-1 bg-[#2a2e39] dark:bg-[#2a2e39] light:bg-slate-200 rounded-full overflow-hidden relative">
                  <div
                    className={`h-full rounded-full ${isUp ? 'bg-[#089981]' : 'bg-[#f23645]'}`}
                    style={{ width: `${posPct}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
