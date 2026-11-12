import React, { useState } from 'react';
import { ECONOMIC_EVENTS, EARNINGS_RELEASES } from '../data/marketData';
import { Calendar, Clock, AlertCircle, TrendingUp, DollarSign } from 'lucide-react';

export const EconomicCalendarView: React.FC = () => {
  const [dateFilter, setDateFilter] = useState<'All' | 'Today' | 'Tomorrow' | 'Friday'>('All');
  const [impactFilter, setImpactFilter] = useState<'all' | 'high'>('all');
  const [activeTab, setActiveTab] = useState<'economic' | 'earnings' | 'rates'>('economic');

  const filteredEvents = ECONOMIC_EVENTS.filter(evt => {
    if (dateFilter !== 'All' && evt.date !== dateFilter) return false;
    if (impactFilter === 'high' && evt.impact !== 'high') return false;
    return true;
  });

  const getImpactBadge = (impact: 'high' | 'medium' | 'low') => {
    switch (impact) {
      case 'high':
        return (
          <span className="flex items-center gap-1 text-[#f23645] font-bold text-[10px]">
            <span className="w-1.5 h-3 bg-[#f23645] rounded-xs" />
            <span className="w-1.5 h-3 bg-[#f23645] rounded-xs" />
            <span className="w-1.5 h-3 bg-[#f23645] rounded-xs" />
            High
          </span>
        );
      case 'medium':
        return (
          <span className="flex items-center gap-1 text-amber-500 font-medium text-[10px]">
            <span className="w-1.5 h-3 bg-amber-500 rounded-xs" />
            <span className="w-1.5 h-3 bg-amber-500 rounded-xs" />
            <span className="w-1.5 h-3 bg-[#2a2e39] rounded-xs" />
            Med
          </span>
        );
      case 'low':
        return (
          <span className="flex items-center gap-1 text-[#787b86] font-normal text-[10px]">
            <span className="w-1.5 h-3 bg-[#787b86] rounded-xs" />
            <span className="w-1.5 h-3 bg-[#2a2e39] rounded-xs" />
            <span className="w-1.5 h-3 bg-[#2a2e39] rounded-xs" />
            Low
          </span>
        );
    }
  };

  const centralBankRates = [
    { bank: 'Federal Reserve (Fed)', country: 'United States', rate: '4.75%', change: '-0.25%', nextMeeting: 'Dec 18, 2026' },
    { bank: 'European Central Bank (ECB)', country: 'Eurozone', rate: '3.25%', change: '-0.25%', nextMeeting: 'Dec 12, 2026' },
    { bank: 'Bank of England (BoE)', country: 'United Kingdom', rate: '4.75%', change: '-0.25%', nextMeeting: 'Dec 19, 2026' },
    { bank: 'Bank of Japan (BoJ)', country: 'Japan', rate: '0.25%', change: '+0.15%', nextMeeting: 'Dec 19, 2026' },
    { bank: 'Swiss National Bank (SNB)', country: 'Switzerland', rate: '1.00%', change: '-0.25%', nextMeeting: 'Dec 12, 2026' },
    { bank: 'Reserve Bank of Australia (RBA)', country: 'Australia', rate: '4.35%', change: '0.00%', nextMeeting: 'Dec 10, 2026' },
  ];

  return (
    <div className="w-full bg-[#1e222d] dark:bg-[#1e222d] light:bg-white border border-[#2a2e39] dark:border-[#2a2e39] light:border-slate-200 rounded-lg overflow-hidden flex flex-col">
      {/* Header Tabs */}
      <div className="px-4 py-3.5 border-b border-[#2a2e39] dark:border-[#2a2e39] light:border-slate-200 flex flex-wrap items-center justify-between gap-3 bg-[#131722]/50 dark:bg-[#131722]/50 light:bg-slate-50">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-[#2962ff]" />
          <h2 className="text-base font-bold text-[#f0f3fa] dark:text-[#f0f3fa] light:text-slate-900 leading-none">
            Economic & Earnings Calendar
          </h2>
        </div>

        {/* Sub-tabs: Economic Releases, Earnings, Central Bank Rates */}
        <div className="flex items-center bg-[#131722] dark:bg-[#131722] light:bg-slate-100 p-0.5 rounded-lg text-xs font-semibold">
          <button
            onClick={() => setActiveTab('economic')}
            className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
              activeTab === 'economic' ? 'bg-[#2962ff] text-white' : 'text-[#787b86] hover:text-[#f0f3fa]'
            }`}
          >
            Economic Events
          </button>
          <button
            onClick={() => setActiveTab('earnings')}
            className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
              activeTab === 'earnings' ? 'bg-[#2962ff] text-white' : 'text-[#787b86] hover:text-[#f0f3fa]'
            }`}
          >
            Earnings Releases
          </button>
          <button
            onClick={() => setActiveTab('rates')}
            className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
              activeTab === 'rates' ? 'bg-[#2962ff] text-white' : 'text-[#787b86] hover:text-[#f0f3fa]'
            }`}
          >
            Interest Rates
          </button>
        </div>
      </div>

      {/* Content View: Economic Releases */}
      {activeTab === 'economic' && (
        <div>
          {/* Filter Bar */}
          <div className="px-4 py-2 border-b border-[#2a2e39]/60 flex items-center justify-between gap-3 text-xs flex-wrap">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-[#787b86]">Day:</span>
              {(['All', 'Today', 'Tomorrow', 'Friday'] as const).map(d => (
                <button
                  key={d}
                  onClick={() => setDateFilter(d)}
                  className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                    dateFilter === d ? 'bg-[#2a2e39] text-[#f0f3fa]' : 'text-[#787b86] hover:text-[#d1d4dc]'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setImpactFilter(impactFilter === 'all' ? 'high' : 'all')}
                className={`px-2.5 py-0.5 rounded text-[11px] border font-semibold transition-colors cursor-pointer ${
                  impactFilter === 'high'
                    ? 'border-[#f23645] bg-[#f23645]/10 text-[#f23645]'
                    : 'border-[#2a2e39] text-[#787b86]'
                }`}
              >
                High Impact Only
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#2a2e39] text-[#787b86] font-medium bg-[#131722]/30">
                  <th className="py-2.5 px-4 font-semibold">Time</th>
                  <th className="py-2.5 px-3 font-semibold">Country</th>
                  <th className="py-2.5 px-3 font-semibold">Event</th>
                  <th className="py-2.5 px-3 text-center font-semibold">Impact</th>
                  <th className="py-2.5 px-3 text-right font-semibold">Actual</th>
                  <th className="py-2.5 px-3 text-right font-semibold">Forecast</th>
                  <th className="py-2.5 px-3 text-right font-semibold">Previous</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2a2e39]/60">
                {filteredEvents.map(evt => (
                  <tr key={evt.id} className="hover:bg-[#2a2e39]/30 transition-colors">
                    <td className="py-3 px-4 font-mono text-[#f0f3fa]">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3 h-3 text-[#787b86]" />
                        <span>{evt.time}</span>
                      </div>
                      <span className="text-[10px] text-[#787b86]">{evt.date}</span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1.5 font-medium text-[#d1d4dc]">
                        <span className="w-4 text-center font-bold text-[10px] bg-[#2a2e39] px-1 py-0.5 rounded">
                          {evt.countryCode}
                        </span>
                        <span className="hidden sm:inline">{evt.country}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 font-semibold text-[#f0f3fa]">
                      {evt.event}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <div className="flex justify-center">{getImpactBadge(evt.impact)}</div>
                    </td>
                    <td className="py-3 px-3 text-right font-bold tabular-nums">
                      {evt.actual ? (
                        <span className="text-[#089981]">{evt.actual}</span>
                      ) : (
                        <span className="text-[#787b86]">—</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-right tabular-nums text-[#d1d4dc]">
                      {evt.forecast || '—'}
                    </td>
                    <td className="py-3 px-3 text-right tabular-nums text-[#787b86]">
                      {evt.previous}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Content View: Earnings Releases */}
      {activeTab === 'earnings' && (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#2a2e39] text-[#787b86] font-medium bg-[#131722]/30">
                <th className="py-2.5 px-4 font-semibold">Company</th>
                <th className="py-2.5 px-3 font-semibold">Date & Release</th>
                <th className="py-2.5 px-3 text-right font-semibold">EPS Est.</th>
                <th className="py-2.5 px-3 text-right font-semibold">EPS Actual</th>
                <th className="py-2.5 px-3 text-right font-semibold">Rev. Est.</th>
                <th className="py-2.5 px-3 text-right font-semibold">Market Cap</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2a2e39]/60">
              {EARNINGS_RELEASES.map(earn => (
                <tr key={earn.id} className="hover:bg-[#2a2e39]/30 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      {earn.logoUrl ? (
                        <img
                          src={earn.logoUrl}
                          alt={earn.symbol}
                          className="w-5 h-5 rounded-full object-contain shrink-0 bg-white p-0.5"
                          referrerPolicy="no-referrer"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                        />
                      ) : (
                        <div className="w-5 h-5 rounded-full bg-[#2962ff]/20 text-[#2962ff] text-[10px] font-bold flex items-center justify-center shrink-0">
                          {earn.symbol.slice(0, 2)}
                        </div>
                      )}
                      <div>
                        <div className="font-bold text-[#f0f3fa]">{earn.symbol}</div>
                        <div className="text-[11px] text-[#787b86]">{earn.companyName}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-semibold text-[#f0f3fa]">{earn.date}</div>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#2a2e39] text-[#787b86]">
                      {earn.time === 'AMC' ? 'After Market Close' : 'Before Market Open'}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right tabular-nums text-[#d1d4dc]">
                    ${earn.epsEstimate.toFixed(2)}
                  </td>
                  <td className="py-3 px-3 text-right tabular-nums font-bold">
                    {earn.epsActual !== undefined ? (
                      <span className="text-[#089981]">${earn.epsActual.toFixed(2)}</span>
                    ) : (
                      <span className="text-[#787b86]">Pending</span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-right tabular-nums text-[#d1d4dc]">
                    {earn.revenueEstimate}
                  </td>
                  <td className="py-3 px-3 text-right tabular-nums text-[#787b86]">
                    {earn.marketCap}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Content View: Central Bank Interest Rates */}
      {activeTab === 'rates' && (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#2a2e39] text-[#787b86] font-medium bg-[#131722]/30">
                <th className="py-2.5 px-4 font-semibold">Central Bank</th>
                <th className="py-2.5 px-3 font-semibold">Country / Zone</th>
                <th className="py-2.5 px-3 text-right font-semibold">Current Rate</th>
                <th className="py-2.5 px-3 text-right font-semibold">Last Change</th>
                <th className="py-2.5 px-3 text-right font-semibold">Next Meeting</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2a2e39]/60">
              {centralBankRates.map(cb => (
                <tr key={cb.bank} className="hover:bg-[#2a2e39]/30 transition-colors">
                  <td className="py-3 px-4 font-bold text-[#f0f3fa]">
                    {cb.bank}
                  </td>
                  <td className="py-3 px-3 text-[#d1d4dc]">
                    {cb.country}
                  </td>
                  <td className="py-3 px-3 text-right font-extrabold tabular-nums text-base text-[#f0f3fa]">
                    {cb.rate}
                  </td>
                  <td className="py-3 px-3 text-right tabular-nums font-semibold">
                    <span
                      className={
                        cb.change.startsWith('+')
                          ? 'text-[#f23645]'
                          : cb.change.startsWith('-')
                          ? 'text-[#089981]'
                          : 'text-[#787b86]'
                      }
                    >
                      {cb.change}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right text-[#787b86] font-mono">
                    {cb.nextMeeting}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
