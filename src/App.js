import { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [symbol, setSymbol] = useState('');
  const [stockData, setStockData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchStock = async () => {
    if (!symbol) return;
    setLoading(true);
    setError('');
    setStockData(null);

    try {
      const res = await axios.get(`http://localhost:5000/stock/${symbol}`);
      setStockData(res.data);
    } catch (err) {
      setError('Stock not found. Try another symbol!');
    }
    setLoading(false);
  };

  const getLogoUrl = (symbol) => {
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
  return logos[symbol] || null;
};

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>📈 Stock Analyzer</h1>

      <div style={styles.searchBox}>
        <input
          style={styles.input}
          type="text"
          placeholder="Enter stock symbol e.g. AAPL"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value.toUpperCase())}
        />
        <button style={styles.button} onClick={fetchStock}>
          Search
        </button>
      </div>

      {loading && <p style={styles.loading}>Fetching stock data...</p>}
      {error && <p style={styles.error}>{error}</p>}

      {stockData && (
        <div style={styles.card}>
          {getLogoUrl(stockData.symbol) && (
          <img 
            src={getLogoUrl(stockData.symbol)}
            alt={stockData.symbol}
            style={styles.logo}
            onError={(e) => e.target.style.display = 'none'}
          />
        )}
          <h2 style={styles.symbol}>{stockData.symbol}</h2>
          <p style={styles.price}>💰 Price: <strong>${stockData.price}</strong></p>
          <p style={styles.change}>
            📊 Change: <strong style={{
              color: stockData.change >= 0 ? '#00ff88' : '#ff4d4d'
            }}>
              {stockData.change} ({stockData.changePercent})
            </strong>
          </p>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#0f0f0f',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: '80px',
    fontFamily: 'Arial, sans-serif',
  },
  title: {
    color: '#00ff88',
    fontSize: '2.5rem',
    marginBottom: '40px',
  },
  searchBox: {
    display: 'flex',
    gap: '10px',
    marginBottom: '40px',
  },
  input: {
    padding: '12px 20px',
    fontSize: '1rem',
    borderRadius: '8px',
    border: '2px solid #00ff88',
    backgroundColor: '#1a1a1a',
    color: 'white',
    width: '250px',
    outline: 'none',
  },
  button: {
    padding: '12px 24px',
    fontSize: '1rem',
    backgroundColor: '#00ff88',
    color: '#0f0f0f',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#1a1a1a',
    border: '2px solid #00ff88',
    borderRadius: '16px',
    padding: '40px',
    textAlign: 'center',
    width: '300px',
  },
  symbol: {
    color: '#00ff88',
    fontSize: '2rem',
    marginBottom: '20px',
  },
  price: {
    color: 'white',
    fontSize: '1.2rem',
    marginBottom: '10px',
  },
  change: {
    color: 'white',
    fontSize: '1.2rem',
  },
  loading: {
    color: '#00ff88',
    fontSize: '1rem',
  },
  error: {
    color: '#ff4d4d',
    fontSize: '1rem',
  },
  logo: {
  width: '80px',
  height: '80px',
  borderRadius: '50%',
  marginBottom: '15px',
  objectFit: 'contain',
  backgroundColor: 'white',
  padding: '8px',
},
};

export default App;