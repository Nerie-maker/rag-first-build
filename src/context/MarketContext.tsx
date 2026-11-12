import React, { createContext, useContext, useState, useEffect } from 'react';
import { MarketAsset, PortfolioPosition, TradeOrder } from '../types/market';
import { ALL_ASSETS } from '../data/marketData';

interface MarketContextType {
  assets: MarketAsset[];
  activeAsset: MarketAsset;
  setActiveAsset: (asset: MarketAsset) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedTimeframe: string;
  setSelectedTimeframe: (tf: string) => void;
  chartType: 'candle' | 'line' | 'area' | 'heikinAshi';
  setChartType: (type: 'candle' | 'line' | 'area' | 'heikinAshi') => void;
  indicators: {
    ma: boolean;
    ema: boolean;
    bollinger: boolean;
    rsi: boolean;
    volume: boolean;
  };
  toggleIndicator: (key: 'ma' | 'ema' | 'bollinger' | 'rsi' | 'volume') => void;
  watchlist: string[];
  toggleWatchlist: (symbol: string) => void;
  isWatchlistOpen: boolean;
  setIsWatchlistOpen: (open: boolean) => void;
  portfolio: {
    cash: number;
    positions: PortfolioPosition[];
    orders: TradeOrder[];
  };
  executeTrade: (symbol: string, type: 'buy' | 'sell', shares: number, orderType?: 'market' | 'limit') => { success: boolean; message: string };
  resetPortfolio: () => void;
  isPaperTradingOpen: boolean;
  setIsPaperTradingOpen: (open: boolean) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  isSymbolModalOpen: boolean;
  setIsSymbolModalOpen: (open: boolean) => void;
  modalAsset: MarketAsset | null;
  openSymbolModal: (asset: MarketAsset) => void;
  isLiveStreaming: boolean;
  setIsLiveStreaming: (live: boolean) => void;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  lastUpdatedPriceMap: Record<string, 'up' | 'down'>;
}

const MarketContext = createContext<MarketContextType | undefined>(undefined);

const DEFAULT_WATCHLIST = ['SPX', 'NDX', 'NVDA', 'AAPL', 'BTCUSD', 'XAUUSD', 'EURUSD'];
const INITIAL_CASH = 100000;

export const MarketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [assets, setAssets] = useState<MarketAsset[]>(ALL_ASSETS);
  const [activeAsset, setActiveAsset] = useState<MarketAsset>(ALL_ASSETS[0]); // SPX
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>('1D');
  const [chartType, setChartType] = useState<'candle' | 'line' | 'area' | 'heikinAshi'>('candle');
  const [indicators, setIndicators] = useState({
    ma: true,
    ema: false,
    bollinger: false,
    rsi: true,
    volume: true,
  });

  const [watchlist, setWatchlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('tv_watchlist');
      return saved ? JSON.parse(saved) : DEFAULT_WATCHLIST;
    } catch {
      return DEFAULT_WATCHLIST;
    }
  });

  const [isWatchlistOpen, setIsWatchlistOpen] = useState(false);
  const [isPaperTradingOpen, setIsPaperTradingOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSymbolModalOpen, setIsSymbolModalOpen] = useState(false);
  const [modalAsset, setModalAsset] = useState<MarketAsset | null>(null);
  const [isLiveStreaming, setIsLiveStreaming] = useState(true);
  const [lastUpdatedPriceMap, setLastUpdatedPriceMap] = useState<Record<string, 'up' | 'down'>>({});

  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  // Paper trading state
  const [portfolio, setPortfolio] = useState<{
    cash: number;
    positions: PortfolioPosition[];
    orders: TradeOrder[];
  }>(() => {
    try {
      const saved = localStorage.getItem('tv_portfolio');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      cash: INITIAL_CASH,
      positions: [
        {
          symbol: 'NVDA',
          name: 'NVIDIA Corporation',
          shares: 50,
          averageBuyPrice: 135.50,
          currentPrice: 147.25,
          totalValue: 50 * 147.25,
          totalProfit: 50 * (147.25 - 135.50),
          profitPercent: ((147.25 - 135.50) / 135.50) * 100,
          type: 'stock',
        },
        {
          symbol: 'BTCUSD',
          name: 'Bitcoin',
          shares: 0.25,
          averageBuyPrice: 87500.00,
          currentPrice: 91420.00,
          totalValue: 0.25 * 91420.00,
          totalProfit: 0.25 * (91420.00 - 87500.00),
          profitPercent: ((91420.00 - 87500.00) / 87500.00) * 100,
          type: 'crypto',
        }
      ],
      orders: [
        {
          id: 'ord-1',
          symbol: 'NVDA',
          name: 'NVIDIA Corporation',
          type: 'buy',
          orderType: 'market',
          shares: 50,
          price: 135.50,
          total: 6775.00,
          timestamp: Date.now() - 86400000 * 2,
          status: 'filled'
        },
        {
          id: 'ord-2',
          symbol: 'BTCUSD',
          name: 'Bitcoin',
          type: 'buy',
          orderType: 'market',
          shares: 0.25,
          price: 87500.00,
          total: 21875.00,
          timestamp: Date.now() - 86400000,
          status: 'filled'
        }
      ]
    };
  });

  // Save watchlist
  useEffect(() => {
    localStorage.setItem('tv_watchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  // Save portfolio
  useEffect(() => {
    localStorage.setItem('tv_portfolio', JSON.stringify(portfolio));
  }, [portfolio]);

  // Handle theme toggle
  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    if (next === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const toggleIndicator = (key: 'ma' | 'ema' | 'bollinger' | 'rsi' | 'volume') => {
    setIndicators(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleWatchlist = (symbol: string) => {
    setWatchlist(prev =>
      prev.includes(symbol) ? prev.filter(s => s !== symbol) : [...prev, symbol]
    );
  };

  const openSymbolModal = (asset: MarketAsset) => {
    setModalAsset(asset);
    setIsSymbolModalOpen(true);
  };

  // Live price tick simulation (simulates live market feed)
  useEffect(() => {
    if (!isLiveStreaming) return;

    const interval = setInterval(() => {
      // Pick 2-3 random assets to nudge
      setAssets(prevAssets => {
        const next = [...prevAssets];
        const updateMap: Record<string, 'up' | 'down'> = {};

        const numUpdates = 2 + Math.floor(Math.random() * 2);
        for (let i = 0; i < numUpdates; i++) {
          const idx = Math.floor(Math.random() * next.length);
          const item = { ...next[idx] };
          const isUp = Math.random() > 0.48;
          const deltaPct = (Math.random() * 0.003 + 0.0005) * (isUp ? 1 : -1);
          const newPrice = Math.max(0.001, parseFloat((item.price * (1 + deltaPct)).toFixed(item.type === 'forex' ? 4 : (item.price < 2 ? 3 : 2))));
          const newChange = parseFloat((item.change + (newPrice - item.price)).toFixed(item.type === 'forex' ? 4 : 2));
          const newPct = parseFloat((((newPrice - item.prevClose) / item.prevClose) * 100).toFixed(2));
          const newHigh = Math.max(item.high, newPrice);
          const newLow = Math.min(item.low, newPrice);

          // Update last candle
          const updatedHistory = [...item.history];
          if (updatedHistory.length > 0) {
            const lastCandle = { ...updatedHistory[updatedHistory.length - 1] };
            lastCandle.close = newPrice;
            lastCandle.high = Math.max(lastCandle.high, newPrice);
            lastCandle.low = Math.min(lastCandle.low, newPrice);
            lastCandle.volume += Math.floor(Math.random() * 500);
            updatedHistory[updatedHistory.length - 1] = lastCandle;
          }

          item.price = newPrice;
          item.change = newChange;
          item.changePercent = newPct;
          item.high = newHigh;
          item.low = newLow;
          item.history = updatedHistory;

          updateMap[item.symbol] = isUp ? 'up' : 'down';
          next[idx] = item;
        }

        setLastUpdatedPriceMap(updateMap);

        // Clear highlight flash after 800ms
        setTimeout(() => {
          setLastUpdatedPriceMap({});
        }, 800);

        return next;
      });
    }, 2400);

    return () => clearInterval(interval);
  }, [isLiveStreaming]);

  // Keep activeAsset & modalAsset in sync with updated prices
  useEffect(() => {
    const updated = assets.find(a => a.symbol === activeAsset.symbol);
    if (updated) {
      setActiveAsset(updated);
    }
    if (modalAsset) {
      const updatedModal = assets.find(a => a.symbol === modalAsset.symbol);
      if (updatedModal) setModalAsset(updatedModal);
    }
  }, [assets]);

  // Update portfolio position values when prices change
  useEffect(() => {
    setPortfolio(prev => {
      const updatedPositions = prev.positions.map(pos => {
        const currentAsset = assets.find(a => a.symbol === pos.symbol);
        if (!currentAsset) return pos;
        const currentPrice = currentAsset.price;
        const totalValue = pos.shares * currentPrice;
        const totalProfit = pos.shares * (currentPrice - pos.averageBuyPrice);
        const profitPercent = ((currentPrice - pos.averageBuyPrice) / pos.averageBuyPrice) * 100;
        return {
          ...pos,
          currentPrice,
          totalValue: parseFloat(totalValue.toFixed(2)),
          totalProfit: parseFloat(totalProfit.toFixed(2)),
          profitPercent: parseFloat(profitPercent.toFixed(2)),
        };
      });
      return { ...prev, positions: updatedPositions };
    });
  }, [assets]);

  // Execute paper trade
  const executeTrade = (symbol: string, type: 'buy' | 'sell', shares: number, orderType: 'market' | 'limit' = 'market') => {
    const asset = assets.find(a => a.symbol === symbol);
    if (!asset) return { success: false, message: 'Asset not found' };
    if (shares <= 0) return { success: false, message: 'Invalid number of shares' };

    const totalCost = shares * asset.price;

    if (type === 'buy') {
      if (portfolio.cash < totalCost) {
        return { success: false, message: `Insufficient cash! Need $${totalCost.toLocaleString()} but have $${portfolio.cash.toLocaleString()}` };
      }

      setPortfolio(prev => {
        const existingPos = prev.positions.find(p => p.symbol === symbol);
        let newPositions: PortfolioPosition[];

        if (existingPos) {
          const totalShares = existingPos.shares + shares;
          const totalInvested = existingPos.shares * existingPos.averageBuyPrice + totalCost;
          const newAvgPrice = totalInvested / totalShares;
          newPositions = prev.positions.map(p =>
            p.symbol === symbol
              ? {
                  ...p,
                  shares: totalShares,
                  averageBuyPrice: parseFloat(newAvgPrice.toFixed(2)),
                  currentPrice: asset.price,
                  totalValue: parseFloat((totalShares * asset.price).toFixed(2)),
                  totalProfit: parseFloat((totalShares * (asset.price - newAvgPrice)).toFixed(2)),
                  profitPercent: parseFloat((((asset.price - newAvgPrice) / newAvgPrice) * 100).toFixed(2)),
                }
              : p
          );
        } else {
          newPositions = [
            ...prev.positions,
            {
              symbol: asset.symbol,
              name: asset.name,
              shares,
              averageBuyPrice: asset.price,
              currentPrice: asset.price,
              totalValue: parseFloat(totalCost.toFixed(2)),
              totalProfit: 0,
              profitPercent: 0,
              type: asset.type,
            }
          ];
        }

        const newOrder: TradeOrder = {
          id: `ord-${Date.now()}`,
          symbol: asset.symbol,
          name: asset.name,
          type: 'buy',
          orderType,
          shares,
          price: asset.price,
          total: parseFloat(totalCost.toFixed(2)),
          timestamp: Date.now(),
          status: 'filled'
        };

        return {
          cash: parseFloat((prev.cash - totalCost).toFixed(2)),
          positions: newPositions,
          orders: [newOrder, ...prev.orders],
        };
      });

      return { success: true, message: `Bought ${shares} ${symbol} at $${asset.price.toLocaleString()}` };
    } else {
      // Sell
      const existingPos = portfolio.positions.find(p => p.symbol === symbol);
      if (!existingPos || existingPos.shares < shares) {
        return { success: false, message: `Insufficient shares to sell! You hold ${existingPos ? existingPos.shares : 0} ${symbol}` };
      }

      setPortfolio(prev => {
        const remainingShares = existingPos.shares - shares;
        let newPositions: PortfolioPosition[];

        if (remainingShares <= 0.00001) {
          newPositions = prev.positions.filter(p => p.symbol !== symbol);
        } else {
          newPositions = prev.positions.map(p =>
            p.symbol === symbol
              ? {
                  ...p,
                  shares: remainingShares,
                  totalValue: parseFloat((remainingShares * asset.price).toFixed(2)),
                  totalProfit: parseFloat((remainingShares * (asset.price - p.averageBuyPrice)).toFixed(2)),
                  profitPercent: parseFloat((((asset.price - p.averageBuyPrice) / p.averageBuyPrice) * 100).toFixed(2)),
                }
              : p
          );
        }

        const newOrder: TradeOrder = {
          id: `ord-${Date.now()}`,
          symbol: asset.symbol,
          name: asset.name,
          type: 'sell',
          orderType,
          shares,
          price: asset.price,
          total: parseFloat(totalCost.toFixed(2)),
          timestamp: Date.now(),
          status: 'filled'
        };

        return {
          cash: parseFloat((prev.cash + totalCost).toFixed(2)),
          positions: newPositions,
          orders: [newOrder, ...prev.orders],
        };
      });

      return { success: true, message: `Sold ${shares} ${symbol} for $${totalCost.toLocaleString()}` };
    }
  };

  const resetPortfolio = () => {
    setPortfolio({
      cash: INITIAL_CASH,
      positions: [],
      orders: [],
    });
  };

  return (
    <MarketContext.Provider
      value={{
        assets,
        activeAsset,
        setActiveAsset,
        activeTab,
        setActiveTab,
        selectedTimeframe,
        setSelectedTimeframe,
        chartType,
        setChartType,
        indicators,
        toggleIndicator,
        watchlist,
        toggleWatchlist,
        isWatchlistOpen,
        setIsWatchlistOpen,
        portfolio,
        executeTrade,
        resetPortfolio,
        isPaperTradingOpen,
        setIsPaperTradingOpen,
        isSearchOpen,
        setIsSearchOpen,
        isSymbolModalOpen,
        setIsSymbolModalOpen,
        modalAsset,
        openSymbolModal,
        isLiveStreaming,
        setIsLiveStreaming,
        theme,
        toggleTheme,
        lastUpdatedPriceMap,
      }}
    >
      {children}
    </MarketContext.Provider>
  );
};

export const useMarket = () => {
  const context = useContext(MarketContext);
  if (!context) throw new Error('useMarket must be used within a MarketProvider');
  return context;
};
