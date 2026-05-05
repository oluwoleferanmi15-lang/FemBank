import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTransactions } from '../api/account';
import { useAuth } from '../context/AuthContext';

const Transactions = () => {
  const navigate = useNavigate();
  const { customer } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getTransactions();
        setTransactions(data.transactions);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      background: '#000000',
      backgroundImage: 'radial-gradient(ellipse at center, #0D1F0D 0%, #000000 70%)',
      padding: '20px',
      paddingBottom: '100px'
    }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
        <button onClick={() => navigate('/dashboard')} style={{
          background: 'transparent', border: '1px solid #00CC7A',
          color: '#00CC7A', padding: '8px 12px', cursor: 'pointer',
          fontFamily: 'Share Tech Mono, monospace', fontSize: '11px'
        }}>
          {'<'} BACK
        </button>
        <div>
          <p style={{ color: '#00CC7A', fontSize: '10px', letterSpacing: '2px' }}>FEM_BANK</p>
          <p style={{ color: '#00FF9C', fontSize: '14px', letterSpacing: '2px' }}>{'>'} TRANSACTION_HISTORY</p>
        </div>
      </div>

      {/* Count */}
      <div style={{ background: '#0D1F0D', border: '1px solid #00CC7A', padding: '12px', marginBottom: '20px' }}>
        <p style={{ color: '#00CC7A', fontSize: '11px', letterSpacing: '2px' }}>
          {'>'} TOTAL_TRANSACTIONS :: <span style={{ color: '#00FF9C' }}>{transactions.length}</span>
        </p>
      </div>

      {/* Transactions list */}
      {loading ? (
        <p style={{ color: '#00CC7A', fontSize: '12px', letterSpacing: '2px', textAlign: 'center', marginTop: '40px' }}>
          {'>'} LOADING_TRANSACTIONS...
        </p>
      ) : transactions.length === 0 ? (
        <div style={{ textAlign: 'center', marginTop: '60px' }}>
          <p style={{ fontSize: '48px', marginBottom: '16px' }}>📭</p>
          <p style={{ color: '#333333', fontSize: '12px', letterSpacing: '2px' }}>NO_TRANSACTIONS_FOUND</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {transactions.map((tx) => {
            const isSender = tx.senderAccount === customer?.accountNumber;
            return (
              <div key={tx._id} style={{
                background: '#0D1F0D',
                border: `1px solid ${isSender ? '#FF4444' : '#00FF9C'}`,
                padding: '16px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ color: isSender ? '#FF4444' : '#00FF9C', fontSize: '11px', letterSpacing: '1px' }}>
                    {isSender ? '▼ DEBIT' : '▲ CREDIT'}
                  </span>
                  <span style={{ color: '#00FF9C', fontSize: '14px', fontFamily: 'Orbitron, monospace' }}>
                    {isSender ? '-' : '+'}₦{tx.amount?.toLocaleString()}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#333333', fontSize: '10px' }}>
                    {isSender ? `TO :: ${tx.receiverAccount}` : `FROM :: ${tx.senderAccount}`}
                  </span>
                  <span style={{ color: '#333333', fontSize: '10px' }}>
                    {new Date(tx.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p style={{ color: '#333333', fontSize: '9px', marginTop: '8px', letterSpacing: '1px' }}>
                  REF :: {tx.reference}
                </p>
              </div>
            );
          })}
        </div>
      )}

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

export default Transactions;