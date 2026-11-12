export type AssetType = 'stock' | 'index' | 'crypto' | 'forex' | 'futures' | 'bond';

export interface Candle {
  time: string;
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface MarketAsset {
  symbol: string;
  name: string;
  type: AssetType;
  price: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  open: number;
  prevClose: number;
  volume: string;
  rawVolume: number;
  marketCap?: string;
  pe?: number;
  dividendYield?: number;
  sector?: string;
  exchange: string;
  country?: string;
  currency: string;
  logoUrl?: string;
  sparkline: number[];
  rating: 'Strong Buy' | 'Buy' | 'Neutral' | 'Sell' | 'Strong Sell';
  oscillators: { buy: number; neutral: number; sell: number };
  movingAverages: { buy: number; neutral: number; sell: number };
  history: Candle[];
}

export interface EconomicEvent {
  id: string;
  time: string;
  date: string;
  country: string;
  countryCode: string;
  event: string;
  impact: 'high' | 'medium' | 'low';
  actual?: string;
  forecast?: string;
  previous: string;
  unit?: string;
}

export interface EarningsRelease {
  id: string;
  symbol: string;
  companyName: string;
  logoUrl?: string;
  time: 'BMO' | 'AMC'; // Before Market Open / After Market Close
  date: string;
  epsEstimate: number;
  epsActual?: number;
  revenueEstimate: string;
  revenueActual?: string;
  marketCap: string;
}

export interface HeatmapItem {
  symbol: string;
  name: string;
  sector: string;
  marketCap: number; // in Billions for sizing
  changePercent: number;
  price: number;
  logoUrl?: string;
}

export interface TradeOrder {
  id: string;
  symbol: string;
  name: string;
  type: 'buy' | 'sell';
  orderType: 'market' | 'limit';
  shares: number;
  price: number;
  total: number;
  timestamp: number;
  status: 'filled' | 'pending';
}

export interface PortfolioPosition {
  symbol: string;
  name: string;
  shares: number;
  averageBuyPrice: number;
  currentPrice: number;
  totalValue: number;
  totalProfit: number;
  profitPercent: number;
  type: AssetType;
}
