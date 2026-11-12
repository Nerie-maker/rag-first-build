import React, { useState, useMemo } from 'react';
import { HEATMAP_DATA } from '../data/marketData';
import { useMarket } from '../context/MarketContext';
import { Layers, Filter, Eye, ArrowUpRight } from 'lucide-react';

interface HeatmapTile {
  symbol: string;
  name: string;
  sector: string;
  marketCap: number;
  changePercent: number;
  price: number;
  logoUrl?: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

export const TreemapHeatmap: React.FC = () => {
  const { assets, setActiveAsset, openSymbolModal } = useMarket();
  const [selectedSector, setSelectedSector] = useState<string>('All');
  const [hoveredTile, setHoveredTile] = useState<HeatmapTile | null>(null);

  const sectors = useMemo(() => {
    const list = Array.from(new Set(HEATMAP_DATA.map(d => d.sector)));
    return ['All', ...list];
  }, []);

  // Filter items
  const items = useMemo(() => {
    let list = HEATMAP_DATA;
    if (selectedSector !== 'All') {
      list = list.filter(d => d.sector === selectedSector);
    }
    return list;
  }, [selectedSector]);

  // Squarified/Slice treemap layout calculation within 1000 x 520 virtual canvas
  const canvasWidth = 1000;
  const canvasHeight = 520;

  const tiles = useMemo(() => {
    // Group by sector
    const sectorsMap: Record<string, typeof items> = {};
    items.forEach(item => {
      if (!sectorsMap[item.sector]) sectorsMap[item.sector] = [];
      sectorsMap[item.sector].push(item);
    });

    const sectorNames = Object.keys(sectorsMap);
    const totalCap = items.reduce((sum, i) => sum + i.marketCap, 0);

    const calculatedTiles: HeatmapTile[] = [];
    let currentX = 0;

    sectorNames.forEach((sName, sIdx) => {
      const sItems = sectorsMap[sName].sort((a, b) => b.marketCap - a.marketCap);
      const sCap = sItems.reduce((acc, cur) => acc + cur.marketCap, 0);
      const sWidthPct = sCap / (totalCap || 1);
      const sWidth = Math.max(120, sWidthPct * canvasWidth);
      const sX = currentX;
      currentX += sWidth;

      // Layout items inside sector column
      let curY = 0;
      sItems.forEach(item => {
        const itemHeightPct = item.marketCap / (sCap || 1);
        const itemH = Math.max(38, itemHeightPct * canvasHeight);
        const itemY = curY;
        curY += itemH;

        calculatedTiles.push({
          ...item,
          x: sX,
          y: itemY,
          w: Math.min(sWidth, canvasWidth - sX),
          h: Math.min(itemH, canvasHeight - itemY),
        });
      });
    });

    return calculatedTiles;
  }, [items]);

  const getColor = (pct: number) => {
    if (pct >= 3.0) return 'bg-[#089981] text-white';
    if (pct >= 1.5) return 'bg-[#0e705f] text-white';
    if (pct >= 0.2) return 'bg-[#1e5248] text-[#d1d4dc]';
    if (pct > -0.2 && pct < 0.2) return 'bg-[#2a2e39] text-[#787b86]';
    if (pct <= -3.0) return 'bg-[#f23645] text-white';
    if (pct <= -1.5) return 'bg-[#b32634] text-white';
    return 'bg-[#6b232a] text-[#d1d4dc]';
  };

  const handleTileClick = (symbol: string) => {
    const asset = assets.find(a => a.symbol === symbol);
    if (asset) {
      setActiveAsset(asset);
    }
  };

  const handleTileDoubleClick = (symbol: string) => {
    const asset = assets.find(a => a.symbol === symbol);
    if (asset) {
      openSymbolModal(asset);
    }
  };

  return (
    <div className="w-full bg-[#1e222d] dark:bg-[#1e222d] light:bg-white border border-[#2a2e39] dark:border-[#2a2e39] light:border-slate-200 rounded-lg overflow-hidden flex flex-col">
      {/* Header & Sector Filter */}
      <div className="px-4 py-3.5 border-b border-[#2a2e39] dark:border-[#2a2e39] light:border-slate-200 flex flex-wrap items-center justify-between gap-3 bg-[#131722]/50 dark:bg-[#131722]/50 light:bg-slate-50">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-[#2962ff]" />
          <h2 className="text-base font-bold text-[#f0f3fa] dark:text-[#f0f3fa] light:text-slate-900 leading-none">
            S&P 500 Market Heatmap
          </h2>
          <span className="text-[11px] text-[#787b86]">
            Sized by Market Cap · Colored by Performance
          </span>
        </div>

        {/* Sector pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs">
          {sectors.map(sec => (
            <button
              key={sec}
              onClick={() => setSelectedSector(sec)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedSector === sec
                  ? 'bg-[#2962ff] text-white'
                  : 'bg-[#131722] text-[#787b86] hover:text-[#f0f3fa] hover:bg-[#2a2e39]'
              }`}
            >
              {sec}
            </button>
          ))}
        </div>
      </div>

      {/* Heatmap Treemap Canvas */}
      <div className="p-3 bg-[#131722] dark:bg-[#131722] light:bg-slate-100 relative min-h-[440px] sm:min-h-[500px]">
        <div className="w-full h-[460px] relative border border-[#2a2e39] dark:border-[#2a2e39] light:border-slate-300 rounded overflow-hidden select-none bg-[#181b24]">
          {tiles.map(tile => {
            const isHovered = hoveredTile?.symbol === tile.symbol;
            const leftPct = (tile.x / canvasWidth) * 100;
            const topPct = (tile.y / canvasHeight) * 100;
            const widthPct = (tile.w / canvasWidth) * 100;
            const heightPct = (tile.h / canvasHeight) * 100;

            return (
              <div
                key={tile.symbol}
                onClick={() => handleTileClick(tile.symbol)}
                onDoubleClick={() => handleTileDoubleClick(tile.symbol)}
                onMouseEnter={() => setHoveredTile(tile)}
                onMouseLeave={() => setHoveredTile(null)}
                style={{
                  left: `${leftPct}%`,
                  top: `${topPct}%`,
                  width: `${widthPct}%`,
                  height: `${heightPct}%`,
                }}
                className={`absolute p-2 border border-[#131722] transition-transform duration-150 cursor-pointer overflow-hidden flex flex-col justify-between ${getColor(
                  tile.changePercent
                )} ${isHovered ? 'z-20 scale-[1.02] shadow-xl ring-2 ring-white/60' : 'z-10'}`}
                title={`${tile.name} (${tile.symbol}): ${tile.changePercent > 0 ? '+' : ''}${tile.changePercent}% · Double-click for full details`}
              >
                {/* Symbol & Logo */}
                <div className="flex items-center justify-between gap-1">
                  <span className="font-extrabold text-xs tracking-tight truncate leading-none">
                    {tile.symbol}
                  </span>
                  {tile.logoUrl && tile.w > 60 && tile.h > 45 && (
                    <img
                      src={tile.logoUrl}
                      alt={tile.symbol}
                      className="w-3.5 h-3.5 rounded-full object-contain shrink-0 bg-white/90 p-0.5"
                      referrerPolicy="no-referrer"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                  )}
                </div>

                {/* % Change & Price */}
                {tile.h > 35 && (
                  <div>
                    <div className="text-xs font-bold tabular-nums leading-tight">
                      {tile.changePercent > 0 ? '+' : ''}
                      {tile.changePercent.toFixed(2)}%
                    </div>
                    {tile.h > 60 && tile.w > 70 && (
                      <div className="text-[10px] opacity-75 tabular-nums">
                        ${tile.price.toFixed(2)}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {/* Floating Tooltip */}
          {hoveredTile && (
            <div className="absolute bottom-3 left-3 z-30 px-3 py-2 bg-[#1e222d] border border-[#2a2e39] text-[#f0f3fa] rounded-md shadow-2xl text-xs pointer-events-none flex items-center gap-3">
              <div>
                <span className="font-bold">{hoveredTile.name}</span>{' '}
                <span className="text-[#787b86]">({hoveredTile.symbol})</span>
                <div className="text-[#787b86] text-[10px] mt-0.5">{hoveredTile.sector}</div>
              </div>
              <div className="border-l border-[#2a2e39] pl-3 text-right">
                <div className="tabular-nums font-bold">${hoveredTile.price.toFixed(2)}</div>
                <div
                  className={`tabular-nums font-semibold text-[11px] ${
                    hoveredTile.changePercent >= 0 ? 'text-[#089981]' : 'text-[#f23645]'
                  }`}
                >
                  {hoveredTile.changePercent >= 0 ? '+' : ''}
                  {hoveredTile.changePercent.toFixed(2)}%
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Heatmap Legend */}
      <div className="px-4 py-2 border-t border-[#2a2e39] dark:border-[#2a2e39] light:border-slate-200 flex items-center justify-between text-xs text-[#787b86] flex-wrap gap-2">
        <span className="text-[11px]">Click to chart · Double click to open deep-dive</span>
        <div className="flex items-center gap-1.5 text-[10px] font-mono">
          <span>-3%</span>
          <div className="flex items-center h-2.5 rounded overflow-hidden">
            <span className="w-5 h-full bg-[#f23645]" />
            <span className="w-5 h-full bg-[#b32634]" />
            <span className="w-5 h-full bg-[#6b232a]" />
            <span className="w-5 h-full bg-[#2a2e39]" />
            <span className="w-5 h-full bg-[#1e5248]" />
            <span className="w-5 h-full bg-[#0e705f]" />
            <span className="w-5 h-full bg-[#089981]" />
          </div>
          <span>+3%</span>
        </div>
      </div>
    </div>
  );
};
