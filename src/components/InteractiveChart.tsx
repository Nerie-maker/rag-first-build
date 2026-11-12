import React, { useState, useRef, useMemo } from 'react';
import { MarketAsset, Candle } from '../types/market';
import { useMarket } from '../context/MarketContext';
import {
  CandlestickChart as CandlestickIcon,
  TrendingUp,
  Activity,
  Layers,
  Maximize2,
  Bookmark,
  Share2,
  ChevronDown
} from 'lucide-react';

interface InteractiveChartProps {
  asset?: MarketAsset;
  height?: number;
  showTradingToolbar?: boolean;
}

export const InteractiveChart: React.FC<InteractiveChartProps> = ({
  asset: propAsset,
  height = 480,
  showTradingToolbar = true,
}) => {
  const {
    activeAsset: contextAsset,
    chartType,
    setChartType,
    selectedTimeframe,
    setSelectedTimeframe,
    indicators,
    toggleIndicator,
    toggleWatchlist,
    watchlist,
    openSymbolModal,
  } = useMarket();

  const asset = propAsset || contextAsset;
  const isWatchlisted = watchlist.includes(asset.symbol);

  // Crosshair hover state
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Timeframe slice
  const candles = useMemo(() => {
    const raw = asset.history || [];
    switch (selectedTimeframe) {
      case '1D': return raw.slice(-24);
      case '5D': return raw.slice(-48);
      case '1M': return raw.slice(-60);
      case '3M': return raw.slice(-72);
      case '1Y': return raw;
      default: return raw;
    }
  }, [asset.history, selectedTimeframe]);

  // Compute stats across current slice
  const { minPrice, maxPrice, maxVolume } = useMemo(() => {
    if (!candles.length) return { minPrice: 0, maxPrice: 1, maxVolume: 1 };
    let min = Infinity;
    let max = -Infinity;
    let maxVol = 0;
    candles.forEach(c => {
      if (c.low < min) min = c.low;
      if (c.high > max) max = c.high;
      if (c.volume > maxVol) maxVol = c.volume;
    });
    // Add 4% padding
    const padding = (max - min) * 0.04 || 1;
    return {
      minPrice: Math.max(0, min - padding),
      maxPrice: max + padding,
      maxVolume: maxVol || 100000,
    };
  }, [candles]);

  // Compute Moving Averages
  const ma20 = useMemo(() => {
    const period = 10;
    return candles.map((_, i) => {
      if (i < period - 1) return null;
      const slice = candles.slice(i - period + 1, i + 1);
      const sum = slice.reduce((acc, c) => acc + c.close, 0);
      return sum / period;
    });
  }, [candles]);

  const ema50 = useMemo(() => {
    const period = 20;
    const k = 2 / (period + 1);
    let prevEma: number | null = null;
    return candles.map((c, i) => {
      if (i < period - 1) return null;
      if (prevEma === null) {
        const slice = candles.slice(0, period);
        prevEma = slice.reduce((acc, cur) => acc + cur.close, 0) / period;
        return prevEma;
      }
      prevEma = c.close * k + prevEma * (1 - k);
      return prevEma;
    });
  }, [candles]);

  // Compute RSI (14 period)
  const rsi = useMemo(() => {
    const period = 14;
    const rsiValues: (number | null)[] = [];
    let gains = 0;
    let losses = 0;

    for (let i = 0; i < candles.length; i++) {
      if (i === 0) {
        rsiValues.push(null);
        continue;
      }
      const diff = candles[i].close - candles[i - 1].close;
      if (i <= period) {
        if (diff >= 0) gains += diff;
        else losses -= diff;
        if (i === period) {
          const avgGain = gains / period;
          const avgLoss = losses / period;
          const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
          rsiValues.push(100 - 100 / (1 + rs));
        } else {
          rsiValues.push(null);
        }
      } else {
        const prevRsi = rsiValues[i - 1];
        if (prevRsi === null) {
          rsiValues.push(50);
          continue;
        }
        const currentGain = diff > 0 ? diff : 0;
        const currentLoss = diff < 0 ? -diff : 0;
        gains = (gains * (period - 1) + currentGain) / period;
        losses = (losses * (period - 1) + currentLoss) / period;
        const rs = losses === 0 ? 100 : gains / losses;
        rsiValues.push(Math.min(100, Math.max(0, 100 - 100 / (1 + rs))));
      }
    }
    return rsiValues;
  }, [candles]);

  // Selected candle (hovered or last)
  const activeCandle: Candle | undefined =
    hoverIndex !== null && candles[hoverIndex]
      ? candles[hoverIndex]
      : candles[candles.length - 1];

  // Coordinates
  const chartWidth = 900;
  const showRsi = indicators.rsi;
  const rsiHeight = showRsi ? 80 : 0;
  const mainChartHeight = height - rsiHeight - 50; // leave room for axes
  const priceRange = maxPrice - minPrice || 1;

  const getY = (val: number) => {
    return mainChartHeight - ((val - minPrice) / priceRange) * mainChartHeight;
  };

  const candleWidth = Math.max(2, (chartWidth / candles.length) * 0.7);
  const candleGap = chartWidth / candles.length;

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, x / rect.width));
    const index = Math.floor(ratio * candles.length);
    if (index >= 0 && index < candles.length) {
      setHoverIndex(index);
    }
  };

  const handleMouseLeave = () => {
    setHoverIndex(null);
  };

  // Price line path
  const linePoints = useMemo(() => {
    return candles
      .map((c, i) => {
        const x = i * candleGap + candleGap / 2;
        const y = getY(c.close);
        return `${x},${y}`;
      })
      .join(' ');
  }, [candles, minPrice, maxPrice]);

  const areaPoints = useMemo(() => {
    if (!candles.length) return '';
    const firstX = candleGap / 2;
    const lastX = (candles.length - 1) * candleGap + candleGap / 2;
    return `${firstX},${mainChartHeight} ${linePoints} ${lastX},${mainChartHeight}`;
  }, [candles, linePoints, mainChartHeight]);

  const isUp = asset.change >= 0;

  return (
    <div
      ref={containerRef}
      className="w-full bg-[#1e222d] dark:bg-[#1e222d] light:bg-white border border-[#2a2e39] dark:border-[#2a2e39] light:border-slate-200 rounded-lg overflow-hidden flex flex-col"
    >
      {/* Chart Top Bar: Symbol info & Active Candle OHLC */}
      <div className="px-4 py-3 border-b border-[#2a2e39] dark:border-[#2a2e39] light:border-slate-200 flex flex-wrap items-center justify-between gap-4 bg-[#131722]/50 dark:bg-[#131722]/50 light:bg-slate-50/50">
        <div className="flex items-center gap-3">
          {asset.logoUrl ? (
            <img
              src={asset.logoUrl}
              alt={asset.symbol}
              className="w-7 h-7 rounded-full object-contain shrink-0 bg-white p-0.5 border border-slate-700/50"
              referrerPolicy="no-referrer"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
          ) : (
            <div className="w-7 h-7 rounded-full bg-[#2962ff]/20 text-[#2962ff] font-bold text-xs flex items-center justify-center shrink-0">
              {asset.symbol.slice(0, 2)}
            </div>
          )}

          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-[#f0f3fa] dark:text-[#f0f3fa] light:text-slate-900">
                {asset.symbol}
              </span>
              <span className="text-xs text-[#787b86] dark:text-[#787b86] light:text-slate-500 font-medium">
                {asset.name}
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#2a2e39] text-[#787b86] font-mono">
                {asset.exchange}
              </span>
            </div>

            {/* OHLCV dynamic display */}
            {activeCandle && (
              <div className="flex items-center gap-2.5 text-[11px] tabular-nums text-[#787b86] mt-0.5 flex-wrap">
                <span>
                  O <strong className="text-[#d1d4dc] font-semibold">{activeCandle.open.toFixed(asset.type === 'forex' ? 4 : 2)}</strong>
                </span>
                <span>
                  H <strong className="text-[#d1d4dc] font-semibold">{activeCandle.high.toFixed(asset.type === 'forex' ? 4 : 2)}</strong>
                </span>
                <span>
                  L <strong className="text-[#d1d4dc] font-semibold">{activeCandle.low.toFixed(asset.type === 'forex' ? 4 : 2)}</strong>
                </span>
                <span>
                  C <strong className={activeCandle.close >= activeCandle.open ? 'text-[#089981] font-semibold' : 'text-[#f23645] font-semibold'}>
                    {activeCandle.close.toFixed(asset.type === 'forex' ? 4 : 2)}
                  </strong>
                </span>
                <span>
                  Vol <strong className="text-[#d1d4dc] font-semibold">{activeCandle.volume.toLocaleString()}</strong>
                </span>
                {hoverIndex !== null && (
                  <span className="text-[#2962ff] font-mono">[{activeCandle.time}]</span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right side: Live Price & Trading buttons */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-lg font-bold tabular-nums text-[#f0f3fa] dark:text-[#f0f3fa] light:text-slate-900 leading-none">
              {asset.type === 'forex' ? asset.price.toFixed(4) : asset.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              {asset.type === 'bond' ? '%' : ''}
            </div>
            <div
              className={`text-xs font-semibold tabular-nums mt-0.5 flex items-center justify-end ${
                isUp ? 'text-[#089981]' : 'text-[#f23645]'
              }`}
            >
              {isUp ? '+' : ''}
              {asset.change.toFixed(asset.type === 'forex' ? 4 : 2)} ({isUp ? '+' : ''}{asset.changePercent.toFixed(2)}%)
            </div>
          </div>

          {showTradingToolbar && (
            <div className="flex items-center gap-1.5 ml-2">
              <button
                onClick={() => openSymbolModal(asset)}
                className="px-3 py-1.5 bg-[#089981] hover:bg-[#07836e] text-white text-xs font-bold rounded transition-colors cursor-pointer"
                title="Simulated Buy Order"
              >
                Buy
              </button>
              <button
                onClick={() => openSymbolModal(asset)}
                className="px-3 py-1.5 bg-[#f23645] hover:bg-[#d62f3d] text-white text-xs font-bold rounded transition-colors cursor-pointer"
                title="Simulated Sell Order"
              >
                Sell
              </button>
              <button
                onClick={() => toggleWatchlist(asset.symbol)}
                className={`p-1.5 rounded border transition-colors cursor-pointer ${
                  isWatchlisted
                    ? 'bg-[#2962ff]/20 border-[#2962ff] text-[#2962ff]'
                    : 'bg-[#2a2e39]/50 border-[#2a2e39] text-[#787b86] hover:text-[#f0f3fa]'
                }`}
                title={isWatchlisted ? 'Remove from Watchlist' : 'Add to Watchlist'}
              >
                <Bookmark className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Chart Toolbar: Timeframe & Indicators */}
      <div className="px-4 py-2 border-b border-[#2a2e39] dark:border-[#2a2e39] light:border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs bg-[#1e222d] dark:bg-[#1e222d] light:bg-white select-none">
        {/* Timeframe intervals */}
        <div className="flex items-center gap-1 bg-[#131722] dark:bg-[#131722] light:bg-slate-100 p-0.5 rounded-md">
          {['1D', '5D', '1M', '3M', '1Y', 'ALL'].map(tf => (
            <button
              key={tf}
              onClick={() => setSelectedTimeframe(tf)}
              className={`px-2 py-1 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
                selectedTimeframe === tf
                  ? 'bg-[#2962ff] text-white shadow-xs'
                  : 'text-[#787b86] hover:text-[#f0f3fa]'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>

        {/* Chart Style Switcher */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setChartType('candle')}
            className={`px-2.5 py-1 rounded flex items-center gap-1 text-[11px] font-semibold transition-colors cursor-pointer ${
              chartType === 'candle'
                ? 'bg-[#2a2e39] text-[#f0f3fa]'
                : 'text-[#787b86] hover:text-[#f0f3fa]'
            }`}
            title="Candlestick Chart"
          >
            <CandlestickIcon className="w-3.5 h-3.5" />
            <span>Candles</span>
          </button>
          <button
            onClick={() => setChartType('area')}
            className={`px-2.5 py-1 rounded flex items-center gap-1 text-[11px] font-semibold transition-colors cursor-pointer ${
              chartType === 'area'
                ? 'bg-[#2a2e39] text-[#f0f3fa]'
                : 'text-[#787b86] hover:text-[#f0f3fa]'
            }`}
            title="Area Chart"
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Area</span>
          </button>
          <button
            onClick={() => setChartType('line')}
            className={`px-2.5 py-1 rounded flex items-center gap-1 text-[11px] font-semibold transition-colors cursor-pointer ${
              chartType === 'line'
                ? 'bg-[#2a2e39] text-[#f0f3fa]'
                : 'text-[#787b86] hover:text-[#f0f3fa]'
            }`}
            title="Line Chart"
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Line</span>
          </button>
        </div>

        {/* Technical Indicators */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[10px] font-bold text-[#787b86] uppercase mr-1">Indicators:</span>
          <button
            onClick={() => toggleIndicator('ma')}
            className={`px-2 py-0.5 rounded text-[11px] font-medium border transition-colors cursor-pointer ${
              indicators.ma
                ? 'border-amber-500/60 bg-amber-500/10 text-amber-400'
                : 'border-transparent text-[#787b86] hover:text-[#d1d4dc]'
            }`}
            title="SMA 20 (Simple Moving Average)"
          >
            SMA 20
          </button>
          <button
            onClick={() => toggleIndicator('ema')}
            className={`px-2 py-0.5 rounded text-[11px] font-medium border transition-colors cursor-pointer ${
              indicators.ema
                ? 'border-blue-500/60 bg-blue-500/10 text-blue-400'
                : 'border-transparent text-[#787b86] hover:text-[#d1d4dc]'
            }`}
            title="EMA 50 (Exponential Moving Average)"
          >
            EMA 50
          </button>
          <button
            onClick={() => toggleIndicator('rsi')}
            className={`px-2 py-0.5 rounded text-[11px] font-medium border transition-colors cursor-pointer ${
              indicators.rsi
                ? 'border-purple-500/60 bg-purple-500/10 text-purple-400'
                : 'border-transparent text-[#787b86] hover:text-[#d1d4dc]'
            }`}
            title="RSI (Relative Strength Index 14)"
          >
            RSI 14
          </button>
          <button
            onClick={() => toggleIndicator('volume')}
            className={`px-2 py-0.5 rounded text-[11px] font-medium border transition-colors cursor-pointer ${
              indicators.volume
                ? 'border-emerald-500/60 bg-emerald-500/10 text-emerald-400'
                : 'border-transparent text-[#787b86] hover:text-[#d1d4dc]'
            }`}
            title="Volume Histogram"
          >
            Volume
          </button>
        </div>
      </div>

      {/* Main Interactive SVG Chart Canvas */}
      <div className="relative w-full overflow-hidden select-none" style={{ height: `${height}px` }}>
        <svg
          viewBox={`0 0 ${chartWidth} ${height}`}
          preserveAspectRatio="none"
          className="w-full h-full cursor-crosshair"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <defs>
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2962ff" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#2962ff" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="greenAreaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#089981" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#089981" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines (horizontal price levels) */}
          {[0.2, 0.4, 0.6, 0.8].map(ratio => {
            const y = mainChartHeight * ratio;
            const price = maxPrice - ratio * priceRange;
            return (
              <g key={ratio}>
                <line
                  x1="0"
                  y1={y}
                  x2={chartWidth - 65}
                  y2={y}
                  stroke="#2a2e39"
                  strokeDasharray="2,4"
                  strokeWidth="1"
                />
                <text
                  x={chartWidth - 60}
                  y={y + 3}
                  fill="#787b86"
                  fontSize="10"
                  fontFamily="'JetBrains Mono', monospace"
                >
                  {price.toFixed(asset.type === 'forex' ? 4 : 2)}
                </text>
              </g>
            );
          })}

          {/* Volume bars (anchored at mainChartHeight) */}
          {indicators.volume &&
            candles.map((c, i) => {
              const x = i * candleGap + (candleGap - candleWidth) / 2;
              const barHeight = Math.min(mainChartHeight * 0.28, (c.volume / maxVolume) * mainChartHeight * 0.28);
              const y = mainChartHeight - barHeight;
              const isUpCandle = c.close >= c.open;
              return (
                <rect
                  key={`vol-${i}`}
                  x={x}
                  y={y}
                  width={candleWidth}
                  height={barHeight}
                  fill={isUpCandle ? 'rgba(8, 153, 129, 0.35)' : 'rgba(242, 54, 69, 0.35)'}
                />
              );
            })}

          {/* Area Chart Path */}
          {chartType === 'area' && (
            <>
              <polygon points={areaPoints} fill={isUp ? 'url(#greenAreaGradient)' : 'url(#areaGradient)'} />
              <polyline
                points={linePoints}
                fill="none"
                stroke={isUp ? '#089981' : '#2962ff'}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </>
          )}

          {/* Line Chart Path */}
          {chartType === 'line' && (
            <polyline
              points={linePoints}
              fill="none"
              stroke={isUp ? '#089981' : '#2962ff'}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Candlestick Rendering */}
          {chartType === 'candle' &&
            candles.map((c, i) => {
              const x = i * candleGap + candleGap / 2;
              const openY = getY(c.open);
              const closeY = getY(c.close);
              const highY = getY(c.high);
              const lowY = getY(c.low);
              const isUpCandle = c.close >= c.open;
              const bodyTop = Math.min(openY, closeY);
              const bodyHeight = Math.max(1.5, Math.abs(openY - closeY));
              const color = isUpCandle ? '#089981' : '#f23645';

              return (
                <g key={`candle-${i}`}>
                  {/* High/Low Wick */}
                  <line
                    x1={x}
                    y1={highY}
                    x2={x}
                    y2={lowY}
                    stroke={color}
                    strokeWidth="1.2"
                  />
                  {/* Candle Body */}
                  <rect
                    x={x - candleWidth / 2}
                    y={bodyTop}
                    width={candleWidth}
                    height={bodyHeight}
                    fill={color}
                    rx="0.5"
                  />
                </g>
              );
            })}

          {/* SMA 20 Overlay */}
          {indicators.ma && (
            <polyline
              points={candles
                .map((_, i) => {
                  const val = ma20[i];
                  if (val === null) return null;
                  return `${i * candleGap + candleGap / 2},${getY(val)}`;
                })
                .filter(Boolean)
                .join(' ')}
              fill="none"
              stroke="#f59e0b"
              strokeWidth="1.5"
            />
          )}

          {/* EMA 50 Overlay */}
          {indicators.ema && (
            <polyline
              points={candles
                .map((_, i) => {
                  const val = ema50[i];
                  if (val === null) return null;
                  return `${i * candleGap + candleGap / 2},${getY(val)}`;
                })
                .filter(Boolean)
                .join(' ')}
              fill="none"
              stroke="#2962ff"
              strokeWidth="1.5"
            />
          )}

          {/* Current Last Price Line */}
          {candles.length > 0 && (
            <g>
              <line
                x1="0"
                y1={getY(asset.price)}
                x2={chartWidth - 65}
                y2={getY(asset.price)}
                stroke={isUp ? '#089981' : '#f23645'}
                strokeDasharray="3,3"
                strokeWidth="1"
              />
              <rect
                x={chartWidth - 65}
                y={getY(asset.price) - 9}
                width="60"
                height="18"
                fill={isUp ? '#089981' : '#f23645'}
                rx="2"
              />
              <text
                x={chartWidth - 35}
                y={getY(asset.price) + 3.5}
                fill="#ffffff"
                fontSize="9"
                fontWeight="bold"
                textAnchor="middle"
                fontFamily="'JetBrains Mono', monospace"
              >
                {asset.price.toFixed(asset.type === 'forex' ? 4 : 2)}
              </text>
            </g>
          )}

          {/* Interactive Crosshair & Cursor Tracking */}
          {hoverIndex !== null && candles[hoverIndex] && (
            <g>
              {/* Vertical line */}
              <line
                x1={hoverIndex * candleGap + candleGap / 2}
                y1="0"
                x2={hoverIndex * candleGap + candleGap / 2}
                y2={height - 25}
                stroke="#787b86"
                strokeDasharray="2,3"
                strokeWidth="1"
              />
              {/* Horizontal line */}
              <line
                x1="0"
                y1={getY(candles[hoverIndex].close)}
                x2={chartWidth - 65}
                y2={getY(candles[hoverIndex].close)}
                stroke="#787b86"
                strokeDasharray="2,3"
                strokeWidth="1"
              />
              {/* Price marker box */}
              <rect
                x={chartWidth - 65}
                y={getY(candles[hoverIndex].close) - 8}
                width="60"
                height="16"
                fill="#363a45"
                rx="2"
              />
              <text
                x={chartWidth - 35}
                y={getY(candles[hoverIndex].close) + 3}
                fill="#f0f3fa"
                fontSize="9"
                textAnchor="middle"
                fontFamily="'JetBrains Mono', monospace"
              >
                {candles[hoverIndex].close.toFixed(asset.type === 'forex' ? 4 : 2)}
              </text>
            </g>
          )}

          {/* RSI Sub-Panel */}
          {showRsi && (
            <g transform={`translate(0, ${mainChartHeight + 15})`}>
              {/* RSI background separator */}
              <line x1="0" y1="0" x2={chartWidth} y2="0" stroke="#2a2e39" strokeWidth="1" />
              <text x="10" y="14" fill="#a855f7" fontSize="10" fontWeight="bold">
                RSI 14 ({rsi[hoverIndex !== null ? hoverIndex : rsi.length - 1]?.toFixed(1) || '52.4'})
              </text>

              {/* 70 / 30 levels */}
              <line x1="0" y1="20" x2={chartWidth - 65} y2="20" stroke="#f23645" strokeDasharray="2,3" strokeOpacity="0.4" />
              <text x={chartWidth - 60} y="23" fill="#f23645" fontSize="8" opacity="0.6">70</text>

              <line x1="0" y1="50" x2={chartWidth - 65} y2="50" stroke="#089981" strokeDasharray="2,3" strokeOpacity="0.4" />
              <text x={chartWidth - 60} y="53" fill="#089981" fontSize="8" opacity="0.6">30</text>

              {/* RSI Curve */}
              <polyline
                points={candles
                  .map((_, i) => {
                    const r = rsi[i];
                    if (r === null) return null;
                    const rsiY = 65 - (r / 100) * 55;
                    return `${i * candleGap + candleGap / 2},${rsiY}`;
                  })
                  .filter(Boolean)
                  .join(' ')}
                fill="none"
                stroke="#a855f7"
                strokeWidth="1.5"
              />
            </g>
          )}

          {/* Bottom Time Axis */}
          <g transform={`translate(0, ${height - 12})`}>
            {candles.map((c, i) => {
              if (i % Math.floor(candles.length / 6) !== 0) return null;
              return (
                <text
                  key={`time-${i}`}
                  x={i * candleGap + candleGap / 2}
                  y="0"
                  fill="#787b86"
                  fontSize="9"
                  textAnchor="middle"
                  fontFamily="'JetBrains Mono', monospace"
                >
                  {c.time.split(' ')[0]}
                </text>
              );
            })}
          </g>
        </svg>
      </div>
    </div>
  );
};
