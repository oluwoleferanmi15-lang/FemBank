import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginCustomer, forgotPassword } from '../api/auth';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotMsg, setForgotMsg] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await loginCustomer(form);
      login(data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    setForgotLoading(true);
    setForgotMsg('');
    try {
      await forgotPassword({ email: forgotEmail });
      setForgotMsg('New password sent to your email!');
    } catch (err) {
      setForgotMsg(err.response?.data?.message || 'Failed to reset password');
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#000000',
      backgroundImage: 'radial-gradient(ellipse at center, #0D1F0D 0%, #000000 70%)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', padding: '20px'
    }}>
      <div style={{ width: '100%', maxWidth: '400px' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{
            border: '1px solid #00FF9C', padding: '6px 20px',
            display: 'inline-block', marginBottom: '8px',
            boxShadow: '0 0 20px rgba(0,255,156,0.3)'
          }}>
            <span style={{ fontFamily: 'Orbitron, monospace', fontSize: '24px', fontWeight: '900', color: '#00FF9C' }}>FEM</span>
            <span style={{ fontFamily: 'Orbitron, monospace', fontSize: '24px', color: '#F5A623' }}>BANK</span>
          </div>
          <p style={{ color: '#00CC7A', fontSize: '11px', letterSpacing: '3px' }}>{'>'} AUTHENTICATE_USER</p>
        </div>

        {/* Login Form */}
        {!showForgot ? (
          <div style={{ background: '#0D1F0D', border: '1px solid #00CC7A', padding: '32px' }}>
            <p style={{ color: '#00FF9C', fontSize: '12px', letterSpacing: '2px', marginBottom: '24px' }}>
              {'>'} ENTER_CREDENTIALS
            </p>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ color: '#00CC7A', fontSize: '11px', letterSpacing: '2px', display: 'block', marginBottom: '8px' }}>
                  {'>'} EMAIL_ADDRESS
                </label>
                <input className="input-field" type="email" placeholder="user@fembank.com"
                  value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
              </div>

              <div style={{ marginBottom: '8px' }}>
                <label style={{ color: '#00CC7A', fontSize: '11px', letterSpacing: '2px', display: 'block', marginBottom: '8px' }}>
                  {'>'} PASSWORD
                </label>
                <input className="input-field" type="password" placeholder="••••••••"
                  value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
              </div>

              {/* Forgot password */}
              <p style={{ textAlign: 'right', marginBottom: '24px' }}>
                <span style={{ color: '#F5A623', fontSize: '10px', cursor: 'pointer', letterSpacing: '1px' }}
                  onClick={() => setShowForgot(true)}>
                  {'>'} FORGOT_PASSWORD?
                </span>
              </p>

              {error && <p className="error-msg" style={{ marginBottom: '16px' }}>{'>'} ERROR :: {error}</p>}

              <button className="btn-primary" type="submit" disabled={loading}>
                {loading ? '> AUTHENTICATING...' : '> LOGIN_TO_ACCOUNT'}
              </button>
            </form>
          </div>
        ) : (
          /* Forgot password form */
          <div style={{ background: '#0D1F0D', border: '1px solid #00CC7A', padding: '32px' }}>
            <p style={{ color: '#00FF9C', fontSize: '12px', letterSpacing: '2px', marginBottom: '24px' }}>
              {'>'} RESET_PASSWORD
            </p>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ color: '#00CC7A', fontSize: '11px', letterSpacing: '2px', display: 'block', marginBottom: '8px' }}>
                {'>'} YOUR_EMAIL_ADDRESS
              </label>
              <input className="input-field" type="email" placeholder="user@fembank.com"
                value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} />
            </div>

            {forgotMsg && (
              <p style={{
                fontSize: '12px', marginBottom: '16px',
                color: forgotMsg.includes('sent') ? '#00FF9C' : '#FF4444'
              }}>
                {'>'} {forgotMsg}
              </p>
            )}

            <button className="btn-primary" onClick={handleForgotPassword}
              disabled={forgotLoading} style={{ marginBottom: '12px' }}>
              {forgotLoading ? '> SENDING...' : '> SEND_NEW_PASSWORD'}
            </button>

            <button className="btn-gold" onClick={() => setShowForgot(false)}>
              {'<'} BACK_TO_LOGIN
            </button>
          </div>
        )}

        <p style={{ textAlign: 'center', marginTop: '24px', color: '#444444', fontSize: '12px' }}>
          NO_ACCOUNT?{' '}
          <span style={{ color: '#F5A623', cursor: 'pointer' }} onClick={() => navigate('/register')}>
            {'>'} CREATE_ONE
          </span>
        </p>

        <p style={{ textAlign: 'center', marginTop: '12px', color: '#444444', fontSize: '11px', cursor: 'pointer' }}
          onClick={() => navigate('/')}>
          {'<'} BACK_TO_HOME
        </p>
      </div>
    </div>
  );
};

export default Login;