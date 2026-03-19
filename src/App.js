import { useState } from 'react';
import axios from 'axios';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Filler);

const RAILWAY_URL = 'https://stock-test-production.up.railway.app';

const getLogoUrl = (sym) => {
  const logos = {
    'AAPL': 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg',
    'AMZN': 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg',
    'TSLA': 'https://upload.wikimedia.org/wikipedia/commons/b/bd/Tesla_Motors.svg',
    'GOOGL': 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg',
    'MSFT': 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg',
    'META': 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg',
    'NFLX': 'https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg',
    'NVDA': 'https://upload.wikimedia.org/wikipedia/commons/2/21/Nvidia_logo.svg',
  };
  return logos[sym] || null;
};

const formatChangePercent = (val) => {
  if (typeof val === 'string') return val.trim();
  return val.toFixed(4) + '%';
};

export default function App() {
  const [symbol, setSymbol] = useState('');
  const [stockData, setStockData] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchStockBySymbol = async (sym) => {
    if (!sym || !sym.trim()) return;
    setLoading(true);
    setError('');
    setStockData(null);
    setChartData(null);

    try {
      const [res, histRes] = await Promise.all([
        axios.get(`${RAILWAY_URL}/stock/${sym}`),
        axios.get(`${RAILWAY_URL}/stock/${sym}/history`)
      ]);

      setStockData(res.data);
      const history = histRes.data;

      setChartData({
        labels: history.map(d => d.date),
        datasets: [{
          data: history.map(d => d.close),
          borderColor: '#c8f04f',
          backgroundColor: 'rgba(200, 240, 79, 0.06)',
          borderWidth: 1.5,
          pointRadius: 0,
          fill: true,
          tension: 0.4,
        }]
      });
    } catch {
      setError('Symbol not found. Please try again.');
    }
    setLoading(false);
  };

  const handleSearch = () => fetchStockBySymbol(symbol);
  const handleKeyDown = (e) => { if (e.key === 'Enter') fetchStockBySymbol(symbol); };

  const isPositive = stockData && parseFloat(stockData.change) >= 0;

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: '#1a1a1a',
        titleColor: '#c8f04f',
        bodyColor: '#fff',
        borderColor: '#333',
        borderWidth: 1,
        callbacks: { label: (ctx) => ` $${ctx.parsed.y.toFixed(2)}` }
      }
    },
    scales: {
      x: {
        ticks: { color: '#555', maxTicksLimit: 5, font: { size: 11 } },
        grid: { display: false },
        border: { display: false }
      },
      y: {
        ticks: { color: '#555', font: { size: 11 }, callback: (v) => `$${v}` },
        grid: { color: 'rgba(255,255,255,0.04)' },
        border: { display: false }
      }
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0a0a0a; color: #fff; font-family: 'DM Mono', monospace; min-height: 100vh; }
        .app {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 60px 20px 80px;
          background: radial-gradient(ellipse 80% 50% at 50% -10%, rgba(200,240,79,0.07) 0%, transparent 70%);
        }
        .header { text-align: center; margin-bottom: 56px; }
        .header-tag {
          display: inline-block;
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.2em;
          color: #c8f04f;
          text-transform: uppercase;
          border: 1px solid rgba(200,240,79,0.3);
          padding: 4px 12px;
          border-radius: 100px;
          margin-bottom: 20px;
        }
        .header h1 {
          font-family: 'Syne', sans-serif;
          font-size: clamp(2.5rem, 6vw, 4.5rem);
          font-weight: 800;
          letter-spacing: -0.03em;
          line-height: 1;
          color: #fff;
        }
        .header h1 span { color: #c8f04f; }
        .header p { margin-top: 14px; color: #444; font-size: 13px; letter-spacing: 0.05em; }
        .search-wrapper { width: 100%; max-width: 560px; margin-bottom: 48px; }
        .search-box {
          display: flex;
          align-items: center;
          background: #111;
          border: 1px solid #222;
          border-radius: 14px;
          padding: 6px 6px 6px 20px;
          transition: border-color 0.2s;
          gap: 10px;
        }
        .search-box:focus-within { border-color: #c8f04f; }
        .search-box input {
          flex: 1;
          background: none;
          border: none;
          outline: none;
          color: #fff;
          font-family: 'Syne', sans-serif;
          font-size: 1.1rem;
          font-weight: 600;
          letter-spacing: 0.08em;
        }
        .search-box input::placeholder { color: #333; }
        .search-btn {
          background: #c8f04f;
          color: #0a0a0a;
          border: none;
          border-radius: 10px;
          padding: 12px 24px;
          font-family: 'Syne', sans-serif;
          font-size: 0.85rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          cursor: pointer;
          transition: opacity 0.2s, transform 0.1s;
          white-space: nowrap;
        }
        .search-btn:hover { opacity: 0.85; }
        .search-btn:active { transform: scale(0.97); }
        .search-btn:disabled { opacity: 0.4; cursor: not-allowed; }
        .suggestions { display: flex; gap: 8px; margin-top: 12px; flex-wrap: wrap; }
        .suggestion-chip {
          background: #111;
          border: 1px solid #1e1e1e;
          color: #444;
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          padding: 4px 12px;
          border-radius: 100px;
          cursor: pointer;
          transition: all 0.15s;
          letter-spacing: 0.05em;
        }
        .suggestion-chip:hover { border-color: #c8f04f; color: #c8f04f; }
        .status { font-size: 12px; letter-spacing: 0.1em; margin-bottom: 24px; }
        .status.loading { color: #444; }
        .status.error { color: #ff5f5f; }
        .loading-dots span { animation: blink 1.2s infinite; opacity: 0; }
        .loading-dots span:nth-child(2) { animation-delay: 0.2s; }
        .loading-dots span:nth-child(3) { animation-delay: 0.4s; }
        @keyframes blink { 0%, 100% { opacity: 0; } 50% { opacity: 1; } }
        .result-wrapper {
          width: 100%;
          max-width: 860px;
          display: flex;
          flex-direction: column;
          gap: 20px;
          animation: fadeUp 0.4s ease forwards;
        }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        .stock-card {
          background: #0f0f0f;
          border: 1px solid #1a1a1a;
          border-radius: 20px;
          padding: 32px 36px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          flex-wrap: wrap;
        }
        .stock-left { display: flex; align-items: center; gap: 20px; }
        .logo-wrap {
          width: 52px; height: 52px;
          background: #fff;
          border-radius: 14px;
          display: flex; align-items: center; justify-content: center;
          padding: 8px; flex-shrink: 0;
        }
        .logo-wrap img { width: 100%; height: 100%; object-fit: contain; }
        .logo-placeholder {
          width: 52px; height: 52px;
          background: #1a1a1a;
          border-radius: 14px;
          display: flex; align-items: center; justify-content: center;
          font-family: 'Syne', sans-serif;
          font-weight: 800; font-size: 16px; color: #c8f04f; flex-shrink: 0;
        }
        .stock-name { font-family: 'Syne', sans-serif; font-size: 1.8rem; font-weight: 800; letter-spacing: -0.02em; }
        .stock-label { font-size: 11px; color: #333; letter-spacing: 0.1em; text-transform: uppercase; margin-top: 2px; }
        .stock-right { text-align: right; }
        .stock-price { font-family: 'Syne', sans-serif; font-size: 2.2rem; font-weight: 800; letter-spacing: -0.03em; }
        .stock-change {
          display: inline-flex; align-items: center; gap: 6px;
          margin-top: 6px; font-size: 12px; font-weight: 500;
          padding: 4px 12px; border-radius: 100px;
        }
        .stock-change.positive { background: rgba(200,240,79,0.1); color: #c8f04f; }
        .stock-change.negative { background: rgba(255,95,95,0.1); color: #ff5f5f; }
        .chart-card {
          background: #0f0f0f; border: 1px solid #1a1a1a;
          border-radius: 20px; padding: 28px 32px 24px;
        }
        .chart-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; }
        .chart-title { font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 600; color: #333; text-transform: uppercase; letter-spacing: 0.1em; }
        .chart-period { font-size: 11px; color: #2a2a2a; letter-spacing: 0.05em; }
        .chart-area { height: 220px; }
        .stats-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px; background: #1a1a1a; border-radius: 16px; overflow: hidden; }
        .stat-item { background: #0f0f0f; padding: 20px 24px; }
        .stat-label { font-size: 10px; color: #333; letter-spacing: 0.12em; text-transform: uppercase; margin-bottom: 8px; }
        .stat-value { font-family: 'Syne', sans-serif; font-size: 1.1rem; font-weight: 700; }
      `}</style>

      <div className="app">
        <header className="header">
          <div className="header-tag">Market Intelligence</div>
          <h1>Stock <span>Analyzer</span></h1>
          <p>Real-time quotes · Historical charts · Market data</p>
        </header>

        <div className="search-wrapper">
          <div className="search-box">
            <input
              type="text"
              placeholder="AAPL, TSLA, MSFT..."
              value={symbol}
              onChange={(e) => setSymbol(e.target.value.toUpperCase())}
              onKeyDown={handleKeyDown}
              maxLength={10}
            />
            <button className="search-btn" onClick={handleSearch} disabled={loading}>
              {loading ? 'Loading...' : 'Search →'}
            </button>
          </div>
          <div className="suggestions">
            {['AAPL', 'TSLA', 'NVDA', 'MSFT', 'AMZN', 'META'].map(s => (
              <button key={s} className="suggestion-chip" onClick={() => fetchStockBySymbol(s)}>
                {s}
              </button>
            ))}
          </div>
        </div>

        {loading && (
          <div className="status loading">
            <span className="loading-dots">Fetching data<span>.</span><span>.</span><span>.</span></span>
          </div>
        )}
        {error && <div className="status error">⚠ {error}</div>}

        {stockData && chartData && (
          <div className="result-wrapper">
            <div className="stock-card">
              <div className="stock-left">
                {getLogoUrl(stockData.symbol) ? (
                  <div className="logo-wrap">
                    <img src={getLogoUrl(stockData.symbol)} alt={stockData.symbol} onError={(e) => e.target.parentElement.style.display='none'} />
                  </div>
                ) : (
                  <div className="logo-placeholder">{stockData.symbol[0]}</div>
                )}
                <div>
                  <div className="stock-name">{stockData.symbol}</div>
                  <div className="stock-label">NASDAQ · Equities</div>
                </div>
              </div>
              <div className="stock-right">
                <div className="stock-price">${parseFloat(stockData.price).toFixed(2)}</div>
                <div className={`stock-change ${isPositive ? 'positive' : 'negative'}`}>
                  {isPositive ? '▲' : '▼'} {Math.abs(parseFloat(stockData.change)).toFixed(2)} ({formatChangePercent(stockData.changePercent)})
                </div>
              </div>
            </div>

            <div className="chart-card">
              <div className="chart-header">
                <span className="chart-title">30-Day Price History</span>
                <span className="chart-period">Daily Close · USD</span>
              </div>
              <div className="chart-area">
                <Line data={chartData} options={chartOptions} />
              </div>
            </div>

            <div className="stats-row">
              <div className="stat-item">
                <div className="stat-label">Current Price</div>
                <div className="stat-value">${parseFloat(stockData.price).toFixed(2)}</div>
              </div>
              <div className="stat-item">
                <div className="stat-label">Daily Change</div>
                <div className="stat-value" style={{ color: isPositive ? '#c8f04f' : '#ff5f5f' }}>
                  {isPositive ? '+' : ''}{parseFloat(stockData.change).toFixed(2)}
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-label">Change %</div>
                <div className="stat-value" style={{ color: isPositive ? '#c8f04f' : '#ff5f5f' }}>
                  {formatChangePercent(stockData.changePercent)}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}