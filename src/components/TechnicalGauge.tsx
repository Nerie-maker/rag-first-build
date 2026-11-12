import React from 'react';
import { MarketAsset } from '../types/market';

interface TechnicalGaugeProps {
  asset: MarketAsset;
}

export const TechnicalGauge: React.FC<TechnicalGaugeProps> = ({ asset }) => {
  const { rating, oscillators, movingAverages } = asset;

  // Calculate needle angles: -90 (Strong Sell) to +90 (Strong Buy)
  const getAngle = (r: MarketAsset['rating']) => {
    switch (r) {
      case 'Strong Sell': return -70;
      case 'Sell': return -35;
      case 'Neutral': return 0;
      case 'Buy': return 35;
      case 'Strong Buy': return 70;
      default: return 0;
    }
  };

  const getOscillatorRating = () => {
    if (oscillators.buy > oscillators.sell + 1) return 'Buy';
    if (oscillators.sell > oscillators.buy + 1) return 'Sell';
    return 'Neutral';
  };

  const getMaRating = () => {
    if (movingAverages.buy >= 12) return 'Strong Buy';
    if (movingAverages.buy > movingAverages.sell) return 'Buy';
    if (movingAverages.sell >= 10) return 'Strong Sell';
    if (movingAverages.sell > movingAverages.buy) return 'Sell';
    return 'Neutral';
  };

  const renderMeter = (
    title: string,
    currentRating: string,
    stats: { buy: number; neutral: number; sell: number },
    needleAngle: number
  ) => {
    return (
      <div className="flex flex-col items-center">
        <span className="text-[11px] font-bold text-[#787b86] uppercase tracking-wider mb-1">
          {title}
        </span>

        {/* Semi-circular Speedometer Arc */}
        <div className="relative w-40 h-24 flex items-center justify-center">
          <svg viewBox="0 0 160 90" className="w-full h-full overflow-visible">
            <defs>
              <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#f23645" />
                <stop offset="25%" stopColor="#ef5350" />
                <stop offset="50%" stopColor="#787b86" />
                <stop offset="75%" stopColor="#26a69a" />
                <stop offset="100%" stopColor="#089981" />
              </linearGradient>
            </defs>

            {/* Arc Path */}
            <path
              d="M 20 80 A 60 60 0 0 1 140 80"
              fill="none"
              stroke="#2a2e39"
              strokeWidth="10"
              strokeLinecap="round"
            />
            <path
              d="M 20 80 A 60 60 0 0 1 140 80"
              fill="none"
              stroke="url(#gaugeGrad)"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray="188.5"
              strokeDashoffset="0"
              opacity="0.9"
            />

            {/* Tick marks */}
            {[-70, -35, 0, 35, 70].map(deg => {
              const rad = ((deg - 90) * Math.PI) / 180;
              const x1 = 80 + 52 * Math.cos(rad);
              const y1 = 80 + 52 * Math.sin(rad);
              const x2 = 80 + 60 * Math.cos(rad);
              const y2 = 80 + 60 * Math.sin(rad);
              return (
                <line
                  key={deg}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="#131722"
                  strokeWidth="2"
                />
              );
            })}

            {/* Needle Pivot & Line */}
            <g transform={`rotate(${needleAngle}, 80, 80)`}>
              <line
                x1="80"
                y1="80"
                x2="80"
                y2="28"
                stroke="#f0f3fa"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <circle cx="80" cy="80" r="5" fill="#f0f3fa" />
            </g>
          </svg>
        </div>

        {/* Current rating badge */}
        <div className="mt-1">
          <span
            className={`text-xs font-extrabold uppercase px-2 py-0.5 rounded ${
              currentRating.includes('Buy')
                ? 'bg-[#089981]/20 text-[#089981]'
                : currentRating.includes('Sell')
                ? 'bg-[#f23645]/20 text-[#f23645]'
                : 'bg-[#787b86]/20 text-[#787b86]'
            }`}
          >
            {currentRating}
          </span>
        </div>

        {/* Breakdown counters */}
        <div className="flex items-center gap-3 text-[10px] font-mono mt-2 text-[#787b86]">
          <span className="text-[#f23645]">{stats.sell} Sell</span>
          <span>·</span>
          <span>{stats.neutral} Neutral</span>
          <span>·</span>
          <span className="text-[#089981]">{stats.buy} Buy</span>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full bg-[#1e222d] dark:bg-[#1e222d] light:bg-white border border-[#2a2e39] dark:border-[#2a2e39] light:border-slate-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3 border-b border-[#2a2e39]/60 pb-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#d1d4dc] dark:text-[#d1d4dc] light:text-slate-900">
          Technical Analysis Summary
        </h3>
        <span className="text-[10px] text-[#787b86]">1-Day Timeframe</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center justify-around py-2">
        {renderMeter('Oscillators', getOscillatorRating(), oscillators, getAngle(getOscillatorRating() as any))}
        {renderMeter('Summary', rating, {
          buy: oscillators.buy + movingAverages.buy,
          neutral: oscillators.neutral + movingAverages.neutral,
          sell: oscillators.sell + movingAverages.sell,
        }, getAngle(rating))}
        {renderMeter('Moving Averages', getMaRating(), movingAverages, getAngle(getMaRating() as any))}
      </div>
    </div>
  );
};
