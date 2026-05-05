import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { nameEnquiry } from '../api/account';
import { transferFunds } from '../api/transfer';

const NIGERIAN_BANKS = [
  { name: 'FEM Bank', code: '822' },
  { name: 'Access Bank', code: '044' },
  { name: 'GTBank', code: '058' },
  { name: 'Zenith Bank', code: '057' },
  { name: 'First Bank', code: '011' },
  { name: 'UBA', code: '033' },
  { name: 'Kuda Bank', code: '090267' },
  { name: 'Opay', code: '100004' },
  { name: 'Moniepoint', code: '090405' },
  { name: 'Palmpay', code: '100033' },
];

const Transfer = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ toAccount: '', amount: '', bank: '' });
  const [recipientName, setRecipientName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [reference, setReference] = useState('');

  const handleNameEnquiry = async () => {
    if (!form.toAccount || form.toAccount.length < 10) {
      setError('Enter a valid account number');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const data = await nameEnquiry(form.toAccount);
      setRecipientName(data.accountName);
      setStep(2);
    } catch (err) {
      setError('Account not found');
    } finally {
      setLoading(false);
    }
  };

  const handleTransfer = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await transferFunds({
        toAccount: form.toAccount,
        amount: Number(form.amount)
      });
      setReference(data.reference);
      setSuccess(`Transfer of ₦${Number(form.amount).toLocaleString()} to ${recipientName} was successful!`);
      setStep(4);
    } catch (err) {
      setError(err.response?.data?.message || 'Transfer failed');
    } finally {
      setLoading(false);
    }
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
          <p style={{ color: '#00FF9C', fontSize: '14px', letterSpacing: '2px' }}>{'>'} TRANSFER_FUNDS</p>
        </div>
      </div>

      {/* Progress */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
        {[1, 2, 3, 4].map(s => (
          <div key={s} style={{
            flex: 1, height: '2px',
            background: step >= s ? '#00FF9C' : '#333333',
            boxShadow: step >= s ? '0 0 8px #00FF9C' : 'none',
            transition: 'all 0.3s'
          }} />
        ))}
      </div>

      <div style={{ background: '#0D1F0D', border: '1px solid #00CC7A', padding: '32px' }}>

        {/* Step 1 - Account details */}
        {step === 1 && (
          <>
            <p style={{ color: '#00FF9C', fontSize: '12px', letterSpacing: '2px', marginBottom: '24px' }}>
              {'>'} STEP_1 :: RECIPIENT_DETAILS
            </p>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ color: '#00CC7A', fontSize: '11px', letterSpacing: '2px', display: 'block', marginBottom: '8px' }}>
                {'>'} SELECT_BANK
              </label>
              <select className="input-field" value={form.bank}
                onChange={(e) => setForm({ ...form, bank: e.target.value })}
                style={{ background: '#000000' }}>
                <option value="">-- SELECT BANK --</option>
                {NIGERIAN_BANKS.map(bank => (
                  <option key={bank.code} value={bank.code}>{bank.name}</option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ color: '#00CC7A', fontSize: '11px', letterSpacing: '2px', display: 'block', marginBottom: '8px' }}>
                {'>'} ACCOUNT_NUMBER
              </label>
              <input className="input-field" type="text" placeholder="0123456789"
                value={form.toAccount}
                onChange={(e) => setForm({ ...form, toAccount: e.target.value })} />
            </div>

            {error && <p className="error-msg" style={{ marginBottom: '16px' }}>{'>'} ERROR :: {error}</p>}

            <button className="btn-primary" onClick={handleNameEnquiry} disabled={loading}>
              {loading ? '> SEARCHING...' : '> VERIFY_ACCOUNT'}
            </button>
          </>
        )}

        {/* Step 2 - Confirm recipient */}
        {step === 2 && (
          <>
            <p style={{ color: '#00FF9C', fontSize: '12px', letterSpacing: '2px', marginBottom: '24px' }}>
              {'>'} STEP_2 :: CONFIRM_RECIPIENT
            </p>

            <div style={{ background: '#000000', border: '1px solid #00FF9C', padding: '20px', marginBottom: '24px' }}>
              <p style={{ color: '#00CC7A', fontSize: '10px', letterSpacing: '2px', marginBottom: '8px' }}>RECIPIENT_NAME</p>
              <p style={{ color: '#00FF9C', fontSize: '20px', fontFamily: 'Orbitron, monospace', textShadow: '0 0 10px #00FF9C' }}>
                {recipientName}
              </p>
              <p style={{ color: '#333333', fontSize: '10px', marginTop: '8px' }}>
                ACC :: {form.toAccount}
              </p>
            </div>

            <button className="btn-primary" onClick={() => setStep(3)} style={{ marginBottom: '12px' }}>
              {'>'} YES_PROCEED
            </button>
            <button className="btn-gold" onClick={() => setStep(1)}>
              {'>'} NO_CHANGE_ACCOUNT
            </button>
          </>
        )}

        {/* Step 3 - Enter amount */}
        {step === 3 && (
          <>
            <p style={{ color: '#00FF9C', fontSize: '12px', letterSpacing: '2px', marginBottom: '24px' }}>
              {'>'} STEP_3 :: ENTER_AMOUNT
            </p>

            <div style={{ background: '#000000', border: '1px solid #333', padding: '12px', marginBottom: '20px' }}>
              <p style={{ color: '#333333', fontSize: '10px' }}>SENDING TO :: <span style={{ color: '#00FF9C' }}>{recipientName}</span></p>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ color: '#00CC7A', fontSize: '11px', letterSpacing: '2px', display: 'block', marginBottom: '8px' }}>
                {'>'} AMOUNT (₦)
              </label>
              <input className="input-field" type="number" placeholder="1000"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })} />
            </div>

            {error && <p className="error-msg" style={{ marginBottom: '16px' }}>{'>'} ERROR :: {error}</p>}

            <button className="btn-primary" onClick={handleTransfer} disabled={loading} style={{ marginBottom: '12px' }}>
              {loading ? '> PROCESSING...' : `> SEND ₦${Number(form.amount || 0).toLocaleString()}`}
            </button>
            <button className="btn-gold" onClick={() => setStep(2)}>
              {'<'} BACK
            </button>
          </>
        )}

        {/* Step 4 - Success */}
        {step === 4 && (
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '48px', marginBottom: '16px' }}>✅</p>
            <p style={{ color: '#00FF9C', fontSize: '14px', letterSpacing: '2px', marginBottom: '8px' }}>
              TRANSFER_SUCCESSFUL
            </p>
            <p style={{ color: '#00CC7A', fontSize: '12px', marginBottom: '24px' }}>{success}</p>
            <div style={{ background: '#000000', border: '1px solid #333', padding: '12px', marginBottom: '24px', textAlign: 'left' }}>
              <p style={{ color: '#333333', fontSize: '10px', letterSpacing: '1px' }}>
                REF :: <span style={{ color: '#00FF9C' }}>{reference}</span>
              </p>
            </div>
            <button className="btn-primary" onClick={() => navigate('/dashboard')} style={{ marginBottom: '12px' }}>
              {'>'} BACK_TO_DASHBOARD
            </button>
            <button className="btn-gold" onClick={() => { setStep(1); setForm({ toAccount: '', amount: '', bank: '' }); setRecipientName(''); setSuccess(''); }}>
              {'>'} NEW_TRANSFER
            </button>
          </div>
        )}
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

export default Transfer;