import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import '../index.css';

const Landing = () => {
  const navigate = useNavigate();
  const [text, setText] = useState('');
  const fullText = 'SECURE. FAST. RELIABLE.';

  // Typing animation effect
  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      setText(fullText.slice(0, i));
      i++;
      if (i > fullText.length) clearInterval(timer);
    }, 80);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      background: '#000000',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      position: 'relative',
      overflow: 'hidden'
    }}>

      {/* Matrix background effect */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundImage: `radial-gradient(ellipse at center, #0D1F0D 0%, #000000 70%)`,
        zIndex: 0
      }} />

      {/* Content */}
      <div style={{ zIndex: 1, textAlign: 'center', maxWidth: '400px', width: '100%' }}>

        {/* Logo */}
        <div style={{
          border: '1px solid #00FF9C',
          padding: '8px 24px',
          display: 'inline-block',
          marginBottom: '8px',
          boxShadow: '0 0 20px rgba(0,255,156,0.3)'
        }}>
          <span style={{
            fontFamily: 'Orbitron, monospace',
            fontSize: '32px',
            fontWeight: '900',
            color: '#00FF9C',
            textShadow: '0 0 10px #00FF9C',
            letterSpacing: '4px'
          }}>
            FEM
          </span>
          <span style={{
            fontFamily: 'Orbitron, monospace',
            fontSize: '32px',
            fontWeight: '400',
            color: '#F5A623',
            letterSpacing: '4px'
          }}>
            BANK
          </span>
        </div>

        {/* Tagline */}
        <p style={{
          color: '#00CC7A',
          fontSize: '11px',
          letterSpacing: '3px',
          marginBottom: '48px'
        }}>
          {'>'} {text}<span style={{ animation: 'blink 1s infinite' }}>_</span>
        </p>

        {/* Bank code */}
        <div style={{
          background: '#0D1F0D',
          border: '1px solid #00CC7A',
          padding: '12px',
          marginBottom: '48px',
          fontSize: '11px',
          color: '#00CC7A',
          letterSpacing: '2px'
        }}>
          {'>'} BANK_CODE :: 822 &nbsp;&nbsp; {'>'} STATUS :: ONLINE
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <button
            className="btn-primary"
            onClick={() => navigate('/login')}
          >
            {'>'} LOGIN_TO_ACCOUNT
          </button>

          <button
            className="btn-gold"
            onClick={() => navigate('/register')}
          >
            {'>'} CREATE_NEW_ACCOUNT
          </button>
        </div>

        {/* Footer */}
        <p style={{
          color: '#333333',
          fontSize: '10px',
          marginTop: '48px',
          letterSpacing: '2px'
        }}>
          FEM BANK © 2026 — POWERED BY NIBSSBYPHOENIX
        </p>

      </div>

      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>

    </div>
  );
};

export default Landing;