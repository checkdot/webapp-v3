import './Landing.scss'

function Landing() {
  return (
    <div className="landing-container">
      <div className="background-elements">
        <div className="circle circle-1"></div>
        <div className="circle circle-2"></div>
        <div className="blur-effect blur-1"></div>
        <div className="blur-effect blur-2"></div>
        <div className="grid-overlay"></div>
      </div>
      
      <div className="top-bar">
        <div className="network-status">
          <span className="status-dot"></span>
          Network Status: Active
        </div>
        <div className="network-stats">
          <span>Gas: 21 Gwei</span>
          <span className="divider">|</span>
          <span>Block: #14,233,324</span>
          <span className="divider">|</span>
          <span className="highlight">APY: 12.5%</span>
        </div>
      </div>
      
      <div className="left-section">
        <img src="/logo.png" alt="Logo" className="logo" />
        <div className="title-section">
          <div className="badge">
            <span className="dot"></span>
            Live on Mainnet
            <span className="new-tag">New</span>
          </div>
          <h1 className="main-title">Insurance automated to savings account</h1>
          <div className="stats-pill">
            <span>Active users: <strong>50k+</strong></span>
            <span className="divider">•</span>
            <span>Total Volume: <strong>$2B+</strong></span>
          </div>
        </div>
        <button className="launch-btn">
          Launch App
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M3 8H13M13 8L8 3M13 8L8 13" stroke="currentColor" strokeWidth="2"/>
          </svg>
        </button>
        <div className="partners">
          <span>Trusted by</span>
          <div className="partner-logos">
            <img src="/partner1.png" alt="Partner 1" />
            <img src="/partner2.png" alt="Partner 2" />
            <img src="/partner3.png" alt="Partner 3" />
          </div>
        </div>
        <p className="footer-text">
          Earn interest and borrow <strong>129 assets</strong> across <strong>28 pools</strong> on the fastest, lowest fee, and most scalable lending protocol
        </p>
      </div>
      
      <div className="stats-container">
        <div className="stat-card">
          <div className="card-icon">💰</div>
          <h2>Assets Covered</h2>
          <p className="stat-value">$499M</p>
          <div className="income-info">
            <span>Project incomes</span>
            <span className="income-value">$1k/24h</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="card-icon">📈</div>
          <h2>Assets Borrowed</h2>
          <p className="stat-value">$137M</p>
        </div>
        <div className="stat-card">
          <div className="card-icon">🏦</div>
          <h2>Assets Deposited</h2>
          <p className="stat-value">$499M</p>
        </div>
      </div>
      
      <div className="crypto-background">
        <div className="rain-container">
          {[...Array(150)].map((_, i) => (
            <div key={i} className="rain-drop" style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${0.5 + Math.random() * 0.5}s`
            }}></div>
          ))}
        </div>
        
        <div className="umbrella-container">
          <div className="protection-circle"></div>
          <svg className="umbrella-icon" viewBox="0 0 24 24" width="600" height="600">
            <defs>
              <linearGradient id="umbrellaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgba(255,255,255,0.9)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0.6)" />
              </linearGradient>
            </defs>
            <path 
              d="M12 2C6.48 2 2 6.48 2 12c0 .35.03.68.05 1h3.2c-.08-.31-.15-.64-.15-.98 0-3.9 3.18-7.08 7.08-7.08s7.08 3.18 7.08 7.08c0 .34-.07.67-.15.98h3.2c.02-.32.05-.65.05-1 0-5.52-4.48-10-10-10zm0 13c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"
              fill="url(#umbrellaGradient)"
            />
          </svg>
          <div className="shield-effect"></div>
        </div>

        <img src="/icons/eth.svg" alt="" className="token-icon" />
        <img src="/icons/btc.png" alt="" className="token-icon" />
        <img src="/icons/usdt.png" alt="" className="token-icon" />
        <img src="/icons/bnb.png" alt="" className="token-icon" />
        <img src="/icons/usdc.png" alt="" className="token-icon" />
        <img src="/icons/link.png" alt="" className="token-icon" />
        <img src="/icons/uni.png" alt="" className="token-icon" />
        <img src="/icons/aave.png" alt="" className="token-icon" />
      </div>
    </div>
  );
}

export default Landing;
