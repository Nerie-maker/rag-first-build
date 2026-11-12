import React, { useState } from 'react';
import { useMarket } from '../context/MarketContext';
import { InteractiveChart } from './InteractiveChart';
import { TechnicalGauge } from './TechnicalGauge';
import {
  X,
  Bookmark,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Briefcase,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const SymbolDetailModal: React.FC = () => {
  const {
    isSymbolModalOpen,
    setIsSymbolModalOpen,
    modalAsset,
    watchlist,
    toggleWatchlist,
    portfolio,
    executeTrade,
  } = useMarket();

  if (!isSymbolModalOpen || !modalAsset) return null;

  const isWatchlisted = watchlist.includes(modalAsset.symbol);
  const isUp = modalAsset.change >= 0;

  // Trading form state
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');
  const [orderType, setOrderType] = useState<'market' | 'limit'>('market');
  const [shares, setShares] = useState<number>(10);
  const [activeTab, setActiveTab] = useState<'chart' | 'technical' | 'financials'>('chart');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Existing position
  const existingPosition = portfolio.positions.find(p => p.symbol === modalAsset.symbol);

  const totalCost = shares * modalAsset.price;

  const handleExecute = () => {
    setFeedback(null);
    const res = executeTrade(modalAsset.symbol, tradeType, shares, orderType);
    if (res.success) {
      setFeedback({ type: 'success', message: res.message });
      setTimeout(() => setFeedback(null), 3500);
    } else {
      setFeedback({ type: 'error', message: res.message });
    }
  };

  const handleMaxBuy = () => {
    if (modalAsset.price <= 0) return;
    const max = Math.floor(portfolio.cash / modalAsset.price);
    setShares(Math.max(1, max));
  };

  const handleMaxSell = () => {
    if (existingPosition) {
      setShares(existingPosition.shares);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-xs">
      <div
        className="w-full max-w-5xl bg-[#1e222d] dark:bg-[#1e222d] light:bg-white border border-[#2a2e39] dark:border-[#2a2e39] light:border-slate-200 rounded-xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-[#2a2e39] dark:border-[#2a2e39] light:border-slate-200 flex items-center justify-between gap-4 bg-[#131722]/60">
          <div className="flex items-center gap-3">
            {modalAsset.logoUrl ? (
              <img
                src={modalAsset.logoUrl}
                alt={modalAsset.symbol}
                className="w-9 h-9 rounded-full object-contain shrink-0 bg-white p-1"
                referrerPolicy="no-referrer"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-[#2962ff]/20 text-[#2962ff] font-bold text-sm flex items-center justify-center shrink-0">
                {modalAsset.symbol.slice(0, 2)}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-extrabold text-[#f0f3fa] dark:text-[#f0f3fa] light:text-slate-900 leading-none">
                  {modalAsset.symbol}
                </h2>
                <span className="text-xs text-[#787b86] font-medium hidden sm:inline">
                  {modalAsset.name}
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#2a2e39] text-[#787b86] font-mono">
                  {modalAsset.exchange}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-lg font-bold tabular-nums text-[#f0f3fa] dark:text-[#f0f3fa] light:text-slate-900 leading-none">
                  {modalAsset.type === 'forex' ? modalAsset.price.toFixed(4) : modalAsset.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  {modalAsset.type === 'bond' ? '%' : ''}
                </span>
                <span
                  className={`text-xs font-semibold tabular-nums flex items-center ${
                    isUp ? 'text-[#089981]' : 'text-[#f23645]'
                  }`}
                >
                  {isUp ? <TrendingUp className="w-3 h-3 mr-0.5 inline" /> : <TrendingDown className="w-3 h-3 mr-0.5 inline" />}
                  {isUp ? '+' : ''}
                  {modalAsset.changePercent.toFixed(2)}% ({isUp ? '+' : ''}{modalAsset.change.toFixed(2)})
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleWatchlist(modalAsset.symbol)}
              className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                isWatchlisted
                  ? 'bg-[#2962ff]/20 border-[#2962ff] text-[#2962ff]'
                  : 'bg-[#131722] border-[#2a2e39] text-[#787b86] hover:text-[#f0f3fa]'
              }`}
              title={isWatchlisted ? 'Remove from Watchlist' : 'Add to Watchlist'}
            >
              <Bookmark className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsSymbolModalOpen(false)}
              className="p-2 rounded-lg bg-[#131722] border border-[#2a2e39] text-[#787b86] hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab switch bar */}
        <div className="px-5 py-2.5 border-b border-[#2a2e39] flex items-center justify-between gap-3 text-xs bg-[#131722]/30">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('chart')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-colors cursor-pointer ${
                activeTab === 'chart' ? 'bg-[#2962ff] text-white' : 'text-[#787b86] hover:text-[#f0f3fa]'
              }`}
            >
              Interactive Superchart
            </button>
            <button
              onClick={() => setActiveTab('technical')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-colors cursor-pointer ${
                activeTab === 'technical' ? 'bg-[#2962ff] text-white' : 'text-[#787b86] hover:text-[#f0f3fa]'
              }`}
            >
              Technical Meters
            </button>
            <button
              onClick={() => setActiveTab('financials')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-colors cursor-pointer ${
                activeTab === 'financials' ? 'bg-[#2962ff] text-white' : 'text-[#787b86] hover:text-[#f0f3fa]'
              }`}
            >
              Key Statistics
            </button>
          </div>

          {existingPosition && (
            <span className="text-xs text-[#089981] font-mono">
              Holding: <strong>{existingPosition.shares} shares</strong> (~${existingPosition.totalValue.toLocaleString()})
            </span>
          )}
        </div>

        {/* Modal Body: Split view (Content + Paper Trading Order Pad) */}
        <div className="flex-1 overflow-y-auto p-5 grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Left area: Chart or Technicals or Stats */}
          <div className="lg:col-span-2 space-y-4">
            {activeTab === 'chart' && (
              <InteractiveChart asset={modalAsset} height={420} showTradingToolbar={false} />
            )}

            {activeTab === 'technical' && (
              <div className="space-y-4">
                <TechnicalGauge asset={modalAsset} />
                <div className="p-4 bg-[#131722] rounded-lg border border-[#2a2e39] text-xs space-y-2">
                  <div className="font-bold text-[#f0f3fa] mb-2">Indicator Readings</div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-[#787b86]">
                    <div>RSI (14): <strong className="text-[#f0f3fa]">56.4 (Neutral)</strong></div>
                    <div>MACD Level: <strong className="text-[#089981]">+1.42 (Buy)</strong></div>
                    <div>Stochastic %K: <strong className="text-[#f0f3fa]">68.2 (Neutral)</strong></div>
                    <div>ADX Trend: <strong className="text-[#089981]">32.8 (Strong)</strong></div>
                    <div>SMA 20: <strong className="text-[#089981]">Above (Buy)</strong></div>
                    <div>EMA 50: <strong className="text-[#089981]">Above (Buy)</strong></div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'financials' && (
              <div className="p-4 bg-[#131722] rounded-lg border border-[#2a2e39] space-y-4 text-xs">
                <h3 className="font-bold text-[#f0f3fa] text-sm border-b border-[#2a2e39] pb-2">
                  Fundamental Overview & Ratios
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div>
                    <span className="text-[#787b86] block text-[11px]">Market Cap</span>
                    <strong className="text-sm font-bold text-[#f0f3fa] tabular-nums">
                      {modalAsset.marketCap || '—'}
                    </strong>
                  </div>
                  <div>
                    <span className="text-[#787b86] block text-[11px]">P/E Ratio</span>
                    <strong className="text-sm font-bold text-[#f0f3fa] tabular-nums">
                      {modalAsset.pe || '—'}
                    </strong>
                  </div>
                  <div>
                    <span className="text-[#787b86] block text-[11px]">Dividend Yield</span>
                    <strong className="text-sm font-bold text-[#f0f3fa] tabular-nums">
                      {modalAsset.dividendYield !== undefined ? `${modalAsset.dividendYield}%` : '—'}
                    </strong>
                  </div>
                  <div>
                    <span className="text-[#787b86] block text-[11px]">52-Week High</span>
                    <strong className="text-sm font-bold text-[#f0f3fa] tabular-nums">
                      ${(modalAsset.high * 1.08).toFixed(2)}
                    </strong>
                  </div>
                  <div>
                    <span className="text-[#787b86] block text-[11px]">52-Week Low</span>
                    <strong className="text-sm font-bold text-[#f0f3fa] tabular-nums">
                      ${(modalAsset.low * 0.72).toFixed(2)}
                    </strong>
                  </div>
                  <div>
                    <span className="text-[#787b86] block text-[11px]">Average Volume (3M)</span>
                    <strong className="text-sm font-bold text-[#f0f3fa] tabular-nums">
                      {modalAsset.volume}
                    </strong>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Order Execution Pad */}
          <div className="bg-[#131722] border border-[#2a2e39] rounded-lg p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3 border-b border-[#2a2e39] pb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#d1d4dc] flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-[#2962ff]" />
                  Simulated Order Pad
                </span>
                <span className="text-[10px] text-[#787b86] font-mono">
                  Cash: ${portfolio.cash.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </span>
              </div>

              {/* Buy / Sell Tabs */}
              <div className="grid grid-cols-2 gap-1 bg-[#1e222d] p-1 rounded-lg mb-4 text-xs font-bold">
                <button
                  onClick={() => setTradeType('buy')}
                  className={`py-2 rounded-md transition-colors cursor-pointer ${
                    tradeType === 'buy'
                      ? 'bg-[#089981] text-white shadow-xs'
                      : 'text-[#787b86] hover:text-white'
                  }`}
                >
                  Buy {modalAsset.symbol}
                </button>
                <button
                  onClick={() => setTradeType('sell')}
                  className={`py-2 rounded-md transition-colors cursor-pointer ${
                    tradeType === 'sell'
                      ? 'bg-[#f23645] text-white shadow-xs'
                      : 'text-[#787b86] hover:text-white'
                  }`}
                >
                  Sell {modalAsset.symbol}
                </button>
              </div>

              {/* Order Type: Market / Limit */}
              <div className="flex items-center justify-between mb-3 text-xs">
                <span className="text-[#787b86]">Order Type:</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setOrderType('market')}
                    className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                      orderType === 'market' ? 'bg-[#2a2e39] text-white' : 'text-[#787b86]'
                    }`}
                  >
                    Market
                  </button>
                  <button
                    onClick={() => setOrderType('limit')}
                    className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                      orderType === 'limit' ? 'bg-[#2a2e39] text-white' : 'text-[#787b86]'
                    }`}
                  >
                    Limit
                  </button>
                </div>
              </div>

              {/* Quantity / Shares */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-[#787b86]">Quantity:</span>
                  <div className="flex items-center gap-1">
                    {[1, 5, 10, 50].map(n => (
                      <button
                        key={n}
                        onClick={() => setShares(n)}
                        className="px-1.5 py-0.5 rounded bg-[#1e222d] hover:bg-[#2a2e39] text-[10px] text-[#787b86] hover:text-white font-mono"
                      >
                        +{n}
                      </button>
                    ))}
                    <button
                      onClick={tradeType === 'buy' ? handleMaxBuy : handleMaxSell}
                      className="px-1.5 py-0.5 rounded bg-[#2962ff]/20 text-[#2962ff] text-[10px] font-bold"
                    >
                      MAX
                    </button>
                  </div>
                </div>

                <div className="relative">
                  <input
                    type="number"
                    min="0.001"
                    step="any"
                    value={shares}
                    onChange={(e) => setShares(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-[#1e222d] border border-[#2a2e39] rounded-lg text-sm text-[#f0f3fa] font-mono focus:outline-none focus:border-[#2962ff]"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#787b86]">
                    Units
                  </span>
                </div>
              </div>

              {/* Order Summary Calculations */}
              <div className="space-y-1.5 p-3 bg-[#1e222d] rounded-lg text-xs font-mono mb-4">
                <div className="flex items-center justify-between text-[#787b86]">
                  <span>Execution Price</span>
                  <span className="text-[#f0f3fa]">${modalAsset.price.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-[#787b86]">
                  <span>Estimated Total</span>
                  <span className="font-bold text-[#f0f3fa] text-sm">
                    ${totalCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[#787b86] text-[10px] pt-1 border-t border-[#2a2e39]">
                  <span>Commission / Fee</span>
                  <span className="text-[#089981] font-bold">$0.00 (Free)</span>
                </div>
              </div>

              {/* Feedback toast */}
              {feedback && (
                <div
                  className={`p-2.5 rounded-lg text-xs font-medium mb-3 flex items-start gap-2 ${
                    feedback.type === 'success'
                      ? 'bg-[#089981]/20 text-[#089981] border border-[#089981]/40'
                      : 'bg-[#f23645]/20 text-[#f23645] border border-[#f23645]/40'
                  }`}
                >
                  {feedback.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  )}
                  <span>{feedback.message}</span>
                </div>
              )}
            </div>

            {/* Execute Button */}
            <button
              onClick={handleExecute}
              className={`w-full py-2.5 rounded-lg font-bold text-sm text-white transition-all cursor-pointer shadow-md active:scale-[0.98] ${
                tradeType === 'buy'
                  ? 'bg-[#089981] hover:bg-[#07836e]'
                  : 'bg-[#f23645] hover:bg-[#d62f3d]'
              }`}
            >
              {tradeType === 'buy' ? 'Place Buy Order' : 'Place Sell Order'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
