import React, { useState } from 'react';
import { MARKET_NEWS } from '../data/marketData';
import { Newspaper, Clock, TrendingUp, TrendingDown, ExternalLink } from 'lucide-react';

export const NewsStreamView: React.FC = () => {
  const [filterCategory, setFilterCategory] = useState<string>('All');

  const categories = ['All', 'Indices', 'Crypto', 'Central Banks', 'Commodities', 'Bonds'];

  const filtered = MARKET_NEWS.filter(
    n => filterCategory === 'All' || n.category === filterCategory
  );

  return (
    <div className="bg-[#1e222d] dark:bg-[#1e222d] light:bg-white border border-[#2a2e39] dark:border-[#2a2e39] light:border-slate-200 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-[#2a2e39] flex flex-wrap items-center justify-between gap-3 bg-[#131722]/50">
        <div className="flex items-center gap-2">
          <Newspaper className="w-4 h-4 text-[#2962ff]" />
          <h2 className="text-base font-bold text-[#f0f3fa] dark:text-[#f0f3fa] light:text-slate-900 leading-none">
            Financial News & Market Streams
          </h2>
        </div>

        {/* Filter pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors cursor-pointer ${
                filterCategory === cat
                  ? 'bg-[#2962ff] text-white'
                  : 'bg-[#131722] text-[#787b86] hover:text-[#f0f3fa]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* News List */}
      <div className="divide-y divide-[#2a2e39]/60 p-2">
        {filtered.map(item => (
          <article
            key={item.id}
            className="p-4 hover:bg-[#2a2e39]/30 transition-colors rounded-lg group cursor-pointer"
          >
            <div className="flex items-center gap-2 text-xs text-[#787b86] mb-1.5">
              <span className="font-bold text-[#d1d4dc]">{item.source}</span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {item.time}
              </span>
              <span>·</span>
              <span className="text-[#2962ff] font-semibold">{item.category}</span>
              <span>·</span>
              <span
                className={`font-semibold flex items-center gap-1 ${
                  item.sentiment === 'Bullish'
                    ? 'text-[#089981]'
                    : item.sentiment === 'Bearish'
                    ? 'text-[#f23645]'
                    : 'text-[#787b86]'
                }`}
              >
                {item.sentiment === 'Bullish' && <TrendingUp className="w-3 h-3" />}
                {item.sentiment === 'Bearish' && <TrendingDown className="w-3 h-3" />}
                {item.sentiment}
              </span>
            </div>

            <h3 className="text-sm sm:text-base font-bold text-[#f0f3fa] group-hover:text-[#2962ff] transition-colors leading-snug mb-2">
              {item.headline}
            </h3>

            <p className="text-xs sm:text-sm text-[#787b86] leading-relaxed">
              {item.summary}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
};
