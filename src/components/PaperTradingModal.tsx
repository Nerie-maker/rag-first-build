import React, { useState } from 'react';
import { useMarket } from '../context/MarketContext';
import {
  X,
  Briefcase,
  DollarSign,
  TrendingUp,
  TrendingDown,
  RotateCcw,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

export const PaperTradingModal: React.FC = () => {
  const {
    isPaperTradingOpen,
    setIsPaperTradingOpen,
    portfolio,
    executeTrade,
    resetPortfolio,
    openSymbolModal,
    assets,
  } = useMarket();

  const [activeTab, setActiveTab] = useState<'positions' | 'orders'>('positions');

  if (!isPaperTradingOpen) return null;

  const totalInvested = portfolio.positions.reduce((acc, p) => acc + p.totalValue, 0);
  const totalValue = portfolio.cash + totalInvested;
  const totalPnl = totalValue - 100000;
  const totalPnlPercent = (totalPnl / 100000) * 100;
  const isPnlPositive = totalPnl >= 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-xs">
      <div
        className="w-full max-w-4xl bg-[#1e222d] dark:bg-[#1e222d] light:bg-white border border-[#2a2e39] dark:border-[#2a2e39] light:border-slate-200 rounded-xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#2a2e39] dark:border-[#2a2e39] light:border-slate-200 flex items-center justify-between bg-[#131722]/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#2962ff]/20 text-[#2962ff] flex items-center justify-center">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#f0f3fa] dark:text-[#f0f3fa] light:text-slate-900 leading-tight">
                TradingView Paper Trading Account
              </h2>
              <span className="text-xs text-[#787b86]">
                Simulated real-time execution with $100,000 initial capital
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={resetPortfolio}
              className="px-2.5 py-1.5 rounded-md border border-[#2a2e39] bg-[#131722] hover:bg-[#2a2e39] text-[#787b86] hover:text-[#f0f3fa] text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Reset portfolio to initial $100,000 cash"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
            <button
              onClick={() => setIsPaperTradingOpen(false)}
              className="p-1.5 rounded-lg bg-[#131722] border border-[#2a2e39] text-[#787b86] hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Portfolio KPI Strip */}
        <div className="p-4 sm:p-5 border-b border-[#2a2e39] bg-[#131722]/30 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <span className="text-[11px] text-[#787b86] block font-medium">Net Account Value</span>
            <span className="text-xl font-extrabold tabular-nums text-[#f0f3fa]">
              ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>

          <div>
            <span className="text-[11px] text-[#787b86] block font-medium">Unrealized P&L</span>
            <div
              className={`text-xl font-extrabold tabular-nums flex items-center gap-1 ${
                isPnlPositive ? 'text-[#089981]' : 'text-[#f23645]'
              }`}
            >
              {isPnlPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
              <span>
                {isPnlPositive ? '+' : ''}
                ${totalPnl.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span className="text-xs font-semibold">
                ({isPnlPositive ? '+' : ''}{totalPnlPercent.toFixed(2)}%)
              </span>
            </div>
          </div>

          <div>
            <span className="text-[11px] text-[#787b86] block font-medium">Buying Power (Cash)</span>
            <span className="text-xl font-extrabold tabular-nums text-[#f0f3fa]">
              ${portfolio.cash.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>

          <div>
            <span className="text-[11px] text-[#787b86] block font-medium">Invested Equity</span>
            <span className="text-xl font-extrabold tabular-nums text-[#f0f3fa]">
              ${totalInvested.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        {/* Tab switch bar */}
        <div className="px-5 py-2.5 border-b border-[#2a2e39] flex items-center gap-3 text-xs bg-[#131722]/20">
          <button
            onClick={() => setActiveTab('positions')}
            className={`px-3 py-1.5 rounded-md font-semibold transition-colors cursor-pointer ${
              activeTab === 'positions' ? 'bg-[#2962ff] text-white' : 'text-[#787b86] hover:text-[#f0f3fa]'
            }`}
          >
            Open Positions ({portfolio.positions.length})
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-3 py-1.5 rounded-md font-semibold transition-colors cursor-pointer ${
              activeTab === 'orders' ? 'bg-[#2962ff] text-white' : 'text-[#787b86] hover:text-[#f0f3fa]'
            }`}
          >
            Executed Orders ({portfolio.orders.length})
          </button>
        </div>

        {/* Content Table */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5">
          {activeTab === 'positions' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#2a2e39] text-[#787b86] font-medium">
                    <th className="py-2.5 px-3 font-semibold">Instrument</th>
                    <th className="py-2.5 px-3 text-right font-semibold">Quantity</th>
                    <th className="py-2.5 px-3 text-right font-semibold">Avg Price</th>
                    <th className="py-2.5 px-3 text-right font-semibold">Current Price</th>
                    <th className="py-2.5 px-3 text-right font-semibold">Total Value</th>
                    <th className="py-2.5 px-3 text-right font-semibold">Profit / Loss</th>
                    <th className="py-2.5 px-3 text-right font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2a2e39]/60">
                  {portfolio.positions.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-[#787b86]">
                        No open positions. Use the Buy button on any chart or market row to begin trading!
                      </td>
                    </tr>
                  ) : (
                    portfolio.positions.map(pos => {
                      const isProfit = pos.totalProfit >= 0;
                      return (
                        <tr key={pos.symbol} className="hover:bg-[#2a2e39]/30 transition-colors">
                          <td className="py-3 px-3">
                            <span className="font-bold text-sm text-[#f0f3fa] block leading-none">
                              {pos.symbol}
                            </span>
                            <span className="text-[11px] text-[#787b86]">{pos.name}</span>
                          </td>
                          <td className="py-3 px-3 text-right tabular-nums font-mono font-bold text-[#f0f3fa]">
                            {pos.shares}
                          </td>
                          <td className="py-3 px-3 text-right tabular-nums font-mono text-[#787b86]">
                            ${pos.averageBuyPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </td>
                          <td className="py-3 px-3 text-right tabular-nums font-mono font-bold text-[#f0f3fa]">
                            ${pos.currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </td>
                          <td className="py-3 px-3 text-right tabular-nums font-mono font-bold text-[#f0f3fa]">
                            ${pos.totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </td>
                          <td className="py-3 px-3 text-right tabular-nums font-mono font-bold">
                            <span className={isProfit ? 'text-[#089981]' : 'text-[#f23645]'}>
                              {isProfit ? '+' : ''}${pos.totalProfit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              <span className="text-[10px] ml-1">({isProfit ? '+' : ''}{pos.profitPercent.toFixed(2)}%)</span>
                            </span>
                          </td>
                          <td className="py-3 px-3 text-right">
                            <button
                              onClick={() => {
                                const asset = assets.find(a => a.symbol === pos.symbol);
                                if (asset) openSymbolModal(asset);
                              }}
                              className="px-2.5 py-1 rounded bg-[#f23645] hover:bg-[#d62f3d] text-white text-[11px] font-bold cursor-pointer transition-colors"
                            >
                              Close / Sell
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#2a2e39] text-[#787b86] font-medium">
                    <th className="py-2.5 px-3 font-semibold">Date & Time</th>
                    <th className="py-2.5 px-3 font-semibold">Instrument</th>
                    <th className="py-2.5 px-3 font-semibold">Side</th>
                    <th className="py-2.5 px-3 text-right font-semibold">Shares</th>
                    <th className="py-2.5 px-3 text-right font-semibold">Exec Price</th>
                    <th className="py-2.5 px-3 text-right font-semibold">Total Amount</th>
                    <th className="py-2.5 px-3 text-center font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2a2e39]/60">
                  {portfolio.orders.map(order => (
                    <tr key={order.id} className="hover:bg-[#2a2e39]/30 transition-colors">
                      <td className="py-3 px-3 font-mono text-[#787b86]">
                        {new Date(order.timestamp).toLocaleString()}
                      </td>
                      <td className="py-3 px-3 font-bold text-[#f0f3fa]">
                        {order.symbol}
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`font-bold uppercase px-1.5 py-0.5 rounded text-[10px] ${
                            order.type === 'buy'
                              ? 'bg-[#089981]/20 text-[#089981]'
                              : 'bg-[#f23645]/20 text-[#f23645]'
                          }`}
                        >
                          {order.type}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right tabular-nums font-mono text-[#f0f3fa]">
                        {order.shares}
                      </td>
                      <td className="py-3 px-3 text-right tabular-nums font-mono text-[#d1d4dc]">
                        ${order.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="py-3 px-3 text-right tabular-nums font-mono font-bold text-[#f0f3fa]">
                        ${order.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className="text-[#089981] font-mono text-[10px] bg-[#089981]/10 px-1.5 py-0.5 rounded">
                          Filled
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
