import React from 'react';
import { useMarket } from '../context/MarketContext';
import { TrendingUp, TrendingDown } from 'lucide-react';

export const TickerMarquee: React.FC = () => {
  const { assets, activeAsset, setActiveAsset, lastUpdatedPriceMap } = useMarket();

  // Top marquee symbols
  const marqueeSymbols = ['SPX', 'NDX', 'DJI', 'BTCUSD', 'ETHUSD', 'XAUUSD', 'USOIL', 'EURUSD', 'US10Y'];
  const marqueeAssets = marqueeSymbols
    .map(sym => assets.find(a => a.symbol === sym))
    .filter(Boolean);

  return (
    <div className="w-full bg-[#131722] dark:bg-[#131722] light:bg-[#f8f9fd] border-b border-[#2a2e39] dark:border-[#2a2e39] light:border-[#e0e3eb] overflow-hidden select-none text-xs">
      <div className="flex items-center overflow-x-auto no-scrollbar py-1.5 px-3 divide-x divide-[#2a2e39]/60 dark:divide-[#2a2e39]/60 light:divide-[#e0e3eb]">
        {marqueeAssets.map(asset => {
          if (!asset) return null;
          const isUp = asset.change >= 0;
          const isActive = activeAsset.symbol === asset.symbol;
          const flash = lastUpdatedPriceMap[asset.symbol];

          return (
            <button
              key={asset.symbol}
              onClick={() => setActiveAsset(asset)}
              className={`flex items-center gap-2.5 px-3 py-0.5 whitespace-nowrap shrink-0 transition-all cursor-pointer hover:bg-[#2a2e39]/40 dark:hover:bg-[#2a2e39]/40 light:hover:bg-slate-200/60 rounded ${
                isActive ? 'bg-[#2a2e39]/80 dark:bg-[#2a2e39]/80 light:bg-slate-200' : ''
              } ${
                flash === 'up'
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : flash === 'down'
                  ? 'bg-rose-500/20 text-rose-400'
                  : ''
              }`}
              title={`${asset.name} - Click to view chart`}
            >
              <div className="flex items-center gap-1.5">
                {asset.logoUrl ? (
                  <img
                    src={asset.logoUrl}
                    alt={asset.symbol}
                    className="w-3.5 h-3.5 rounded-full object-contain shrink-0"
                    referrerPolicy="no-referrer"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                ) : null}
                <span className="font-bold text-[#d1d4dc] dark:text-[#d1d4dc] light:text-slate-800">
                  {asset.symbol}
                </span>
              </div>

              <span className="tabular-nums font-medium text-[#f0f3fa] dark:text-[#f0f3fa] light:text-slate-900">
                {asset.type === 'forex' ? asset.price.toFixed(4) : asset.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                {asset.type === 'bond' ? '%' : ''}
              </span>

              <span
                className={`tabular-nums flex items-center font-medium ${
                  isUp ? 'text-[#089981] dark:text-[#089981]' : 'text-[#f23645] dark:text-[#f23645]'
                }`}
              >
                {isUp ? (
                  <TrendingUp className="w-3 h-3 mr-0.5 inline" />
                ) : (
                  <TrendingDown className="w-3 h-3 mr-0.5 inline" />
                )}
                {isUp ? '+' : ''}
                {asset.changePercent.toFixed(2)}%
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
