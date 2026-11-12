import React from 'react';
import { MarketScreenerTable } from './MarketScreenerTable';
import { Coins, Zap, ShieldAlert, TrendingUp } from 'lucide-react';

export const CryptoMarketView: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Crypto Macro Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-lg bg-[#1e222d] dark:bg-[#1e222d] light:bg-white border border-[#2a2e39] dark:border-[#2a2e39] light:border-slate-200">
          <div className="flex items-center justify-between text-xs text-[#787b86] mb-1">
            <span>Total Crypto Market Cap</span>
            <Coins className="w-4 h-4 text-[#2962ff]" />
          </div>
          <div className="text-xl font-extrabold tabular-nums text-[#f0f3fa] dark:text-[#f0f3fa] light:text-slate-900">
            $3.18 Trillion
          </div>
          <div className="text-xs font-semibold text-[#089981] mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            +2.84% in 24h
          </div>
        </div>

        <div className="p-4 rounded-lg bg-[#1e222d] dark:bg-[#1e222d] light:bg-white border border-[#2a2e39] dark:border-[#2a2e39] light:border-slate-200">
          <div className="flex items-center justify-between text-xs text-[#787b86] mb-1">
            <span>24h Total Volume</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xl font-extrabold tabular-nums text-[#f0f3fa] dark:text-[#f0f3fa] light:text-slate-900">
            $156.4 Billion
          </div>
          <div className="text-xs text-[#787b86] mt-1">
            Across 140+ registered spot exchanges
          </div>
        </div>

        <div className="p-4 rounded-lg bg-[#1e222d] dark:bg-[#1e222d] light:bg-white border border-[#2a2e39] dark:border-[#2a2e39] light:border-slate-200">
          <div className="flex items-center justify-between text-xs text-[#787b86] mb-1">
            <span>Bitcoin Dominance</span>
            <span className="font-mono text-[10px] text-amber-500 font-bold">BTC.D</span>
          </div>
          <div className="text-xl font-extrabold tabular-nums text-[#f0f3fa] dark:text-[#f0f3fa] light:text-slate-900">
            58.6%
          </div>
          <div className="w-full bg-[#2a2e39] h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="bg-amber-500 h-full rounded-full" style={{ width: '58.6%' }} />
          </div>
        </div>

        <div className="p-4 rounded-lg bg-[#1e222d] dark:bg-[#1e222d] light:bg-white border border-[#2a2e39] dark:border-[#2a2e39] light:border-slate-200">
          <div className="flex items-center justify-between text-xs text-[#787b86] mb-1">
            <span>Fear & Greed Index</span>
            <ShieldAlert className="w-4 h-4 text-[#089981]" />
          </div>
          <div className="flex items-baseline gap-2">
            <div className="text-xl font-extrabold tabular-nums text-[#089981]">
              86
            </div>
            <span className="text-xs font-bold uppercase text-[#089981]">Extreme Greed</span>
          </div>
          <div className="text-[10px] text-[#787b86] mt-1">
            Previous week: 79 (Greed)
          </div>
        </div>
      </div>

      {/* Crypto Screener Table */}
      <MarketScreenerTable defaultCategory="crypto" title="Cryptocurrency Markets" />
    </div>
  );
};
