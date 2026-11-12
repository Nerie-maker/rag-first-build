import React from 'react';
import { useMarket } from '../context/MarketContext';
import {
  TrendingUp,
  LayoutGrid,
  BarChart2,
  Coins,
  Globe2,
  Calendar,
  Layers,
  Fuel,
  FileSpreadsheet,
  Newspaper
} from 'lucide-react';

export const MarketsSubnav: React.FC = () => {
  const { activeTab, setActiveTab } = useMarket();

  const categories = [
    { id: 'overview', label: 'Overview', icon: LayoutGrid },
    { id: 'stocks', label: 'Stocks', icon: BarChart2 },
    { id: 'crypto', label: 'Crypto', icon: Coins },
    { id: 'forex', label: 'Forex', icon: Globe2 },
    { id: 'indices', label: 'Indices', icon: TrendingUp },
    { id: 'futures', label: 'Futures & Commodities', icon: Fuel },
    { id: 'bonds', label: 'Bonds', icon: FileSpreadsheet },
    { id: 'heatmap', label: 'Stock Heatmap', icon: Layers },
    { id: 'calendar', label: 'Economic Calendar', icon: Calendar },
    { id: 'news', label: 'News Stream', icon: Newspaper },
  ];

  return (
    <div className="w-full bg-[#131722] dark:bg-[#131722] light:bg-[#f8f9fd] border-b border-[#2a2e39] dark:border-[#2a2e39] light:border-slate-200">
      <div className="max-w-[1720px] mx-auto px-4 lg:px-6">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2.5">
          {categories.map(cat => {
            const Icon = cat.icon;
            const isActive = activeTab === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer shrink-0 ${
                  isActive
                    ? 'bg-[#2962ff] text-white shadow-sm'
                    : 'text-[#787b86] dark:text-[#787b86] light:text-slate-600 hover:text-[#f0f3fa] dark:hover:text-[#f0f3fa] light:hover:text-slate-900 hover:bg-[#1e222d] dark:hover:bg-[#1e222d] light:hover:bg-slate-200/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
