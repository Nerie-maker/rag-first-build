import React from 'react';
import { MarketProvider, useMarket } from './context/MarketContext';
import { Header } from './components/Header';
import { TickerMarquee } from './components/TickerMarquee';
import { MarketsSubnav } from './components/MarketsSubnav';
import { OverviewHero } from './components/OverviewHero';
import { InteractiveChart } from './components/InteractiveChart';
import { MarketScreenerTable } from './components/MarketScreenerTable';
import { TreemapHeatmap } from './components/TreemapHeatmap';
import { TechnicalGauge } from './components/TechnicalGauge';
import { EconomicCalendarView } from './components/EconomicCalendarView';
import { CryptoMarketView } from './components/CryptoMarketView';
import { ForexMarketView } from './components/ForexMarketView';
import { NewsStreamView } from './components/NewsStreamView';
import { SymbolDetailModal } from './components/SymbolDetailModal';
import { WatchlistDrawer } from './components/WatchlistDrawer';
import { PaperTradingModal } from './components/PaperTradingModal';
import { SearchModal } from './components/SearchModal';

const MainContent: React.FC = () => {
  const { activeTab, activeAsset } = useMarket();

  return (
    <main className="max-w-[1720px] mx-auto px-4 lg:px-6 py-6 space-y-6">
      {/* 1. Overview Screen */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Top 4 Hero Cards */}
          <OverviewHero />

          {/* Chart & Technical Summary Split */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2">
              <InteractiveChart height={460} />
            </div>
            <div className="flex flex-col gap-4 justify-between">
              <TechnicalGauge asset={activeAsset} />

              {/* Quick Market Sentiment Card */}
              <div className="bg-[#1e222d] dark:bg-[#1e222d] light:bg-white border border-[#2a2e39] dark:border-[#2a2e39] light:border-slate-200 rounded-lg p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-[#787b86] mb-2">
                    Market Breadth & Liquidity
                  </div>
                  <div className="space-y-3 text-xs">
                    <div>
                      <div className="flex justify-between text-[#d1d4dc] mb-1">
                        <span>Advancers vs Decliners (NYSE)</span>
                        <strong className="text-[#089981]">1,842 : 1,120</strong>
                      </div>
                      <div className="w-full bg-[#f23645] h-1.5 rounded-full overflow-hidden flex">
                        <div className="bg-[#089981] h-full" style={{ width: '62%' }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[#d1d4dc] mb-1">
                        <span>Nasdaq Volume Distribution</span>
                        <strong className="text-[#089981]">65% Buying</strong>
                      </div>
                      <div className="w-full bg-[#f23645] h-1.5 rounded-full overflow-hidden flex">
                        <div className="bg-[#089981] h-full" style={{ width: '65%' }} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#2a2e39] flex items-center justify-between text-[11px] text-[#787b86]">
                  <span>VIX Volatility: 14.85 (Low)</span>
                  <span className="text-[#089981] font-semibold">Bullish Bias</span>
                </div>
              </div>
            </div>
          </div>

          {/* S&P 500 Stock Heatmap */}
          <TreemapHeatmap />

          {/* Market Movers Table */}
          <MarketScreenerTable title="Today's Market Movers" />

          {/* Economic Calendar & News Split */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <EconomicCalendarView />
            <NewsStreamView />
          </div>
        </div>
      )}

      {/* 2. Stocks Screen */}
      {activeTab === 'stocks' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2">
              <InteractiveChart height={460} />
            </div>
            <div>
              <TechnicalGauge asset={activeAsset} />
            </div>
          </div>
          <MarketScreenerTable defaultCategory="stock" title="United States & World Stocks Screener" />
        </div>
      )}

      {/* 3. Crypto Screen */}
      {activeTab === 'crypto' && (
        <div className="space-y-6">
          <CryptoMarketView />
          <InteractiveChart height={460} />
        </div>
      )}

      {/* 4. Forex Screen */}
      {activeTab === 'forex' && (
        <div className="space-y-6">
          <ForexMarketView />
          <InteractiveChart height={460} />
        </div>
      )}

      {/* 5. Indices Screen */}
      {activeTab === 'indices' && (
        <div className="space-y-6">
          <InteractiveChart height={460} />
          <MarketScreenerTable defaultCategory="index" title="Global Benchmark Indices" />
        </div>
      )}

      {/* 6. Futures & Commodities Screen */}
      {activeTab === 'futures' && (
        <div className="space-y-6">
          <InteractiveChart height={460} />
          <MarketScreenerTable defaultCategory="futures" title="Futures & Commodities Contracts" />
        </div>
      )}

      {/* 7. Bonds Screen */}
      {activeTab === 'bonds' && (
        <div className="space-y-6">
          <InteractiveChart height={460} />
          <MarketScreenerTable defaultCategory="bond" title="Government Bonds & Sovereign Yields" />
        </div>
      )}

      {/* 8. Stock Heatmap Screen */}
      {activeTab === 'heatmap' && (
        <div className="space-y-6">
          <TreemapHeatmap />
          <MarketScreenerTable defaultCategory="stock" title="Component Stocks Ranking" />
        </div>
      )}

      {/* 9. Economic Calendar Screen */}
      {activeTab === 'calendar' && (
        <div className="space-y-6">
          <EconomicCalendarView />
        </div>
      )}

      {/* 10. News Stream Screen */}
      {activeTab === 'news' && (
        <div className="space-y-6">
          <NewsStreamView />
        </div>
      )}
    </main>
  );
};

export default function App() {
  return (
    <MarketProvider>
      <div className="min-h-screen bg-[#131722] dark:bg-[#131722] light:bg-[#f8f9fd] text-[#d1d4dc] dark:text-[#d1d4dc] light:text-slate-800 flex flex-col">
        {/* Top Ticker Marquee Bar */}
        <TickerMarquee />

        {/* Main Header */}
        <Header />

        {/* Markets Subnavigation Categories */}
        <MarketsSubnav />

        {/* Dynamic Main Views */}
        <div className="flex-1">
          <MainContent />
        </div>

        {/* Footer */}
        <footer className="mt-auto border-t border-[#2a2e39] dark:border-[#2a2e39] light:border-slate-200 bg-[#131722] dark:bg-[#131722] light:bg-white py-8 px-6 text-xs text-[#787b86]">
          <div className="max-w-[1720px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded bg-[#2962ff] flex items-center justify-center text-white font-black text-[10px]">
                TV
              </div>
              <span className="font-bold text-[#f0f3fa] dark:text-[#f0f3fa] light:text-slate-900">
                TradingView Markets
              </span>
              <span>·</span>
              <span>Financial Analytics & Live Charting Engine</span>
            </div>

            <div className="flex items-center gap-4 text-[11px] text-[#787b86]">
              <span>Markets</span>
              <span>·</span>
              <span>Quotes</span>
              <span>·</span>
              <span>Heatmaps</span>
              <span>·</span>
              <span>Economic Calendar</span>
              <span>·</span>
              <span>Paper Trading</span>
            </div>

            <div className="text-[11px] text-[#787b86]">
              Data for reference and demonstration. All rights reserved.
            </div>
          </div>
        </footer>

        {/* Modals & Drawers */}
        <SymbolDetailModal />
        <WatchlistDrawer />
        <PaperTradingModal />
        <SearchModal />
      </div>
    </MarketProvider>
  );
}
