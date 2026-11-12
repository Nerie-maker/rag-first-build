import React from 'react';
import { MarketScreenerTable } from './MarketScreenerTable';
import { Globe2, ArrowRightLeft } from 'lucide-react';

export const ForexMarketView: React.FC = () => {
  // Cross Rates Matrix currencies
  const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'CHF', 'AUD'];
  
  // Real baseline exchange rates against USD
  const baseRates: Record<string, number> = {
    USD: 1.0,
    EUR: 1.0542,
    GBP: 1.2685,
    JPY: 0.00646, // 1 USD = 154.68 JPY
    CAD: 0.7136,  // 1 USD = 1.4012 CAD
    CHF: 1.1320,  // 1 USD = 0.8834 CHF
    AUD: 0.6515,
  };

  const getCrossRate = (from: string, to: string) => {
    if (from === to) return '1.0000';
    const rate = baseRates[from] / baseRates[to];
    return rate > 10 ? rate.toFixed(2) : rate.toFixed(4);
  };

  return (
    <div className="space-y-6">
      {/* Currency Cross Rates Matrix */}
      <div className="bg-[#1e222d] dark:bg-[#1e222d] light:bg-white border border-[#2a2e39] dark:border-[#2a2e39] light:border-slate-200 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3 border-b border-[#2a2e39]/60 pb-2.5">
          <div className="flex items-center gap-2">
            <ArrowRightLeft className="w-4 h-4 text-[#2962ff]" />
            <h3 className="text-sm font-bold text-[#f0f3fa] dark:text-[#f0f3fa] light:text-slate-900">
              Foreign Exchange Cross-Rates Matrix
            </h3>
          </div>
          <span className="text-[11px] text-[#787b86]">Live interbank liquidity conversion</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-center text-xs border-collapse font-mono">
            <thead>
              <tr className="bg-[#131722]/50 text-[#787b86]">
                <th className="py-2 px-3 text-left font-bold font-sans">Pair</th>
                {currencies.map(c => (
                  <th key={c} className="py-2 px-3 font-bold font-sans text-[#f0f3fa]">
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2a2e39]/50">
              {currencies.map(from => (
                <tr key={from} className="hover:bg-[#2a2e39]/20 transition-colors">
                  <td className="py-2.5 px-3 text-left font-bold font-sans text-[#2962ff]">
                    {from}
                  </td>
                  {currencies.map(to => {
                    const isSelf = from === to;
                    const rate = getCrossRate(from, to);
                    return (
                      <td
                        key={to}
                        className={`py-2.5 px-3 tabular-nums ${
                          isSelf
                            ? 'bg-[#131722]/30 text-[#787b86]'
                            : 'text-[#d1d4dc] hover:text-white font-medium'
                        }`}
                      >
                        {rate}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Forex Screener Table */}
      <MarketScreenerTable defaultCategory="forex" title="Major & Cross Currency Pairs" />
    </div>
  );
};
