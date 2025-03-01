import './Landing.scss'
import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';

function Landing() {
  const navigate = useNavigate();
  const [currentSection, setCurrentSection] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      
      if (isTransitioning) return;
      
      if (e.deltaY > 0 && currentSection === 0) {
        setIsTransitioning(true);
        setCurrentSection(1);
        setTimeout(() => setIsTransitioning(false), 800);
      } else if (e.deltaY < 0 && currentSection === 1) {
        setIsTransitioning(true);
        setCurrentSection(0);
        setTimeout(() => setIsTransitioning(false), 800);
      }
    };

    const wrapper = wrapperRef.current;
    if (wrapper) {
      wrapper.addEventListener('wheel', handleWheel, { passive: false });
    }

    return () => {
      if (wrapper) {
        wrapper.removeEventListener('wheel', handleWheel);
      }
    };
  }, [currentSection, isTransitioning]);

  const scrollToSecondSection = () => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setCurrentSection(1);
      setTimeout(() => setIsTransitioning(false), 800);
    }
  };

  return (
    <div className="landing-wrapper" ref={wrapperRef}>
      <section className={`section first-section ${currentSection === 1 ? 'slide-up' : ''}`}>
        <div className="landing-container">
          <div className="background-elements">
            <div className="circle circle-1"></div>
            <div className="circle circle-2"></div>
            <div className="blur-effect blur-1"></div>
            <div className="blur-effect blur-2"></div>
            <div className="grid-overlay"></div>
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
            <button className="launch-btn" onClick={() => navigate('/app')}>
              Launch App
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8H13M13 8L8 3M13 8L8 13" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </button>
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
            <img src="/icons/bnb.png" alt="" className="token-icon" />
            <img src="/icons/usds.png" alt="" className="token-icon" />
          </div>

          {currentSection === 0 && (
            <div className="scroll-indicator" onClick={scrollToSecondSection}>
              <span>Scroll to discover</span>
              <div className="scroll-arrow"></div>
            </div>
          )}
        </div>
      </section>

      <section className={`section second-section ${currentSection === 1 ? 'visible' : ''}`}>
        <h2 className="section-title">Supported <span>Tokens</span></h2>
        <p className="section-description">
          Access a wide range of tokens across multiple chains with competitive interest rates and robust security measures
        </p>
        
        <div className="tokens-list">
          {[
            { name: 'Ethereum', symbol: 'ETH', apy: '3.2%', tvl: '$120M' },
            { name: 'Bitcoin', symbol: 'BTC', apy: '2.8%', tvl: '$80M' },
            { name: 'USD Coin', symbol: 'USDC', apy: '4.5%', tvl: '$200M' },
            { name: 'Binance Coin', symbol: 'BNB', apy: '3.5%', tvl: '$45M' },
            { name: 'Solana', symbol: 'SOL', apy: '4.2%', tvl: '$30M' },
            { name: 'Chainlink', symbol: 'LINK', apy: '3.8%', tvl: '$15M' }
          ].map((token, index) => (
            <div key={index} className="token-item">
              <img src={`/icons/${token.symbol.toLowerCase()}.png`} alt={token.name} />
              <div className="token-info">
                <div className="token-name">{token.name}</div>
                <div className="token-stats">
                  APY: {token.apy} • TVL: {token.tvl}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="social-buttons">
          <a 
            href="https://twitter.com/your_handle" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="social-button"
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </a>
          <a 
            href="https://discord.gg/your_server" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="social-button"
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.118.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
            </svg>
          </a>
        </div>
      </section>
    </div>
  );
}

export default Landing;
