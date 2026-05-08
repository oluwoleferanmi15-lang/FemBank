import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getBalance } from '../api/account';

const Dashboard = () => {
  const navigate = useNavigate();
  const { customer, logout } = useAuth();
  const [balance, setBalance] = useState(null);
  const [showBalance, setShowBalance] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const data = await getBalance();
console.log('Balance data:', data);
setBalance(data.balance);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBalance();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#000000',
      backgroundImage: 'radial-gradient(ellipse at center, #0D1F0D 0%, #000000 70%)',
      padding: '20px',
      paddingBottom: '100px'
    }}>

      {/* Header */}
      <div style={{
        background: '#0D1F0D',
        border: '1px solid #00CC7A',
        padding: '16px',
        marginBottom: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <p style={{ color: '#00CC7A', fontSize: '10px', letterSpacing: '2px' }}>FEM_BANK_TERMINAL</p>
          <p style={{ color: '#00FF9C', fontSize: '14px', letterSpacing: '2px', fontWeight: 'bold' }}>
            {'>'} HELLO, {customer?.name?.toUpperCase()}
          </p>
        </div>
        <button onClick={handleLogout} style={{
          background: 'transparent', border: '1px solid #FF4444',
          color: '#FF4444', padding: '6px 12px', cursor: 'pointer',
          fontFamily: 'Share Tech Mono, monospace', fontSize: '10px', letterSpacing: '1px'
        }}>
          {'>'} LOGOUT
        </button>
      </div>

      {/* Balance card */}
      <div style={{
        background: '#0D1F0D',
        border: '1px solid #00FF9C',
        padding: '24px',
        marginBottom: '20px',
        boxShadow: '0 0 20px rgba(0,255,156,0.1)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <p style={{ color: '#00CC7A', fontSize: '11px', letterSpacing: '2px' }}>{'>'} TOTAL_FUNDS</p>
          <button onClick={() => setShowBalance(!showBalance)} style={{
            background: 'transparent', border: 'none', color: '#00CC7A',
            cursor: 'pointer', fontSize: '18px'
          }}>
            {showBalance ? '👁' : '🔒'}
          </button>
        </div>
        <p style={{
          color: '#00FF9C', fontSize: '36px', fontFamily: 'Orbitron, monospace',
          fontWeight: '700', textShadow: '0 0 10px #00FF9C', letterSpacing: '2px'
        }}>
          {loading ? '> LOADING...' : showBalance ? `₦${balance?.toLocaleString()}.00` : '₦••••••'}
        </p>
        <p style={{ color: '#333333', fontSize: '10px', marginTop: '8px', letterSpacing: '2px' }}>
          ACC_NO :: {customer?.accountNumber}
        </p>
      </div>

      {/* Quick actions */}
      <p style={{ color: '#00CC7A', fontSize: '11px', letterSpacing: '2px', marginBottom: '12px' }}>
        {'>'} QUICK_ACCESS_MENU
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
        <div onClick={() => navigate('/transfer')} style={{
          background: '#0D1F0D', border: '1px solid #00CC7A',
          padding: '20px', cursor: 'pointer', transition: 'all 0.3s'
        }}>
          <p style={{ fontSize: '24px', marginBottom: '8px' }}>💸</p>
          <p style={{ color: '#00FF9C', fontSize: '11px', letterSpacing: '2px' }}>TRANSFER_FUNDS</p>
          <p style={{ color: '#333333', fontSize: '10px', marginTop: '4px' }}>Send money</p>
        </div>

        <div onClick={() => navigate('/transactions')} style={{
          background: '#0D1F0D', border: '1px solid #00CC7A',
          padding: '20px', cursor: 'pointer', transition: 'all 0.3s'
        }}>
          <p style={{ fontSize: '24px', marginBottom: '8px' }}>📜</p>
          <p style={{ color: '#00FF9C', fontSize: '11px', letterSpacing: '2px' }}>HISTORY</p>
          <p style={{ color: '#333333', fontSize: '10px', marginTop: '4px' }}>View transactions</p>
        </div>
      </div>

      {/* Account info */}
      <div style={{ background: '#0D1F0D', border: '1px solid #00CC7A', padding: '20px' }}>
        <p style={{ color: '#00CC7A', fontSize: '11px', letterSpacing: '2px', marginBottom: '16px' }}>
          {'>'} ACCOUNT_DETAILS
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[
            { label: 'ACCOUNT_NAME', value: customer?.name },
            { label: 'ACCOUNT_NUMBER', value: customer?.accountNumber },
            { label: 'BANK_NAME', value: 'FEM BANK' },
            { label: 'BANK_CODE', value: '822' },
          ].map(item => (
            <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #111', paddingBottom: '8px' }}>
              <span style={{ color: '#333333', fontSize: '11px', letterSpacing: '1px' }}>{item.label}</span>
              <span style={{ color: '#00FF9C', fontSize: '11px', letterSpacing: '1px' }}>{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom nav */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        background: '#0A0A0A', borderTop: '1px solid #00CC7A',
        display: 'flex', justifyContent: 'space-around', padding: '12px'
      }}>
        {[
          { label: 'HOME', icon: '⬛', path: '/dashboard' },
          { label: 'TRANSFER', icon: '💸', path: '/transfer' },
          { label: 'HISTORY', icon: '📜', path: '/transactions' },
        ].map(item => (
          <div key={item.label} onClick={() => navigate(item.path)}
            style={{ textAlign: 'center', cursor: 'pointer' }}>
            <p style={{ fontSize: '20px' }}>{item.icon}</p>
            <p style={{ color: '#00CC7A', fontSize: '9px', letterSpacing: '1px' }}>{item.label}</p>
          </div>
        ))}
      </div>

    </div>
  );
};

export default Dashboard;
