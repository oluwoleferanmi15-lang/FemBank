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
  const [attempts, setAttempts] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [isLocked, setIsLocked] = useState(false);

  // Show password for 2 seconds then hide
  const handleShowPassword = () => {
    setShowPassword(true);
    setTimeout(() => setShowPassword(false), 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await loginCustomer(form);
      login(data);
      navigate('/dashboard');
    } catch (err) {
      const attemptsLeft = err.response?.data?.attemptsLeft;
      const locked = err.response?.data?.isLocked;

      if (locked) {
        setIsLocked(true);
        setError('Account locked due to too many failed attempts.');
        setShowForgot(true);
      } else {
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        setError(`Invalid credentials${attemptsLeft > 0 ? ` — ${attemptsLeft} attempt${attemptsLeft !== 1 ? 's' : ''} left` : ''}`);

        // Show forgot password after 3 attempts
        if (newAttempts >= 3) {
          setShowForgot(true);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    setForgotLoading(true);
    setForgotMsg('');
    try {
      await forgotPassword({ email: forgotEmail });
      setForgotMsg('✅ New password sent to your email!');
    } catch (err) {
      setForgotMsg('❌ ' + (err.response?.data?.message || 'Failed to reset password'));
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
              <div style={{ position: 'relative' }}>
                <input className="input-field" 
                  type={showPassword ? 'text' : 'password'} 
                  placeholder="••••••••"
                  value={form.password} 
                  onChange={(e) => setForm({ ...form, password: e.target.value })} 
                  required 
                  style={{ paddingRight: '48px' }}
                />
                <button type="button" onClick={handleShowPassword} style={{
                  position: 'absolute', right: '12px', top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'transparent', border: 'none',
                  cursor: 'pointer', fontSize: '18px'
                }}>
                  {showPassword ? '🔒' : '👁️'}
                </button>
              </div>
            </div>

            {/* Forgot password link — shows after 3 attempts or if locked */}
            {(attempts >= 3 || isLocked) && (
              <div style={{
                background: '#1A0000', border: '1px solid #FF4444',
                padding: '12px', marginBottom: '16px', marginTop: '8px'
              }}>
                <p style={{ color: '#FF4444', fontSize: '11px', letterSpacing: '1px', marginBottom: '8px' }}>
                  {'>'} {isLocked ? 'ACCOUNT_LOCKED' : 'TOO_MANY_ATTEMPTS'}
                </p>
                <p style={{ color: '#FF4444', fontSize: '10px', marginBottom: '12px' }}>
                  Reset your password to continue
                </p>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    style={{
                      flex: 1, background: 'transparent',
                      border: '1px solid #FF4444', color: '#FF4444',
                      padding: '8px', fontFamily: 'Share Tech Mono, monospace',
                      fontSize: '12px', outline: 'none'
                    }}
                    type="email" placeholder="your@email.com"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                  />
                  <button type="button" onClick={handleForgotPassword}
                    disabled={forgotLoading}
                    style={{
                      background: '#FF4444', border: 'none',
                      color: '#000', padding: '8px 12px',
                      fontFamily: 'Share Tech Mono, monospace',
                      fontSize: '10px', cursor: 'pointer', whiteSpace: 'nowrap'
                    }}>
                    {forgotLoading ? 'SENDING...' : 'RESET'}
                  </button>
                </div>
                {forgotMsg && (
                  <p style={{
                    fontSize: '10px', marginTop: '8px',
                    color: forgotMsg.includes('✅') ? '#00FF9C' : '#FF4444'
                  }}>
                    {forgotMsg}
                  </p>
                )}
              </div>
            )}

            {error && (
              <p className="error-msg" style={{ marginBottom: '16px', marginTop: '8px' }}>
                {'>'} {error}
              </p>
            )}

            <button className="btn-primary" type="submit" disabled={loading || isLocked}>
              {loading ? '> AUTHENTICATING...' : '> LOGIN_TO_ACCOUNT'}
            </button>
          </form>
        </div>

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