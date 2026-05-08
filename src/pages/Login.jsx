import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginCustomer, sendResetOTP, verifyResetOTP, resetPassword } from '../api/auth';
import { useAuth } from '../context/AuthContext';

const checkPassword = (pass) => ({
  length: pass.length >= 8,
  letter: /[a-zA-Z]/.test(pass),
  number: /[0-9]/.test(pass),
  special: /[!@#$%^&*]/.test(pass)
});

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  // Login state
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Reset password state
  const [resetStep, setResetStep] = useState(0); // 0=login, 1=enter email, 2=enter otp, 3=new password
  const [resetEmail, setResetEmail] = useState('');
  const [resetOtp, setResetOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [resetMsg, setResetMsg] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordChecks, setPasswordChecks] = useState({
    length: false, letter: false, number: false, special: false
  });

  const isPasswordValid = Object.values(passwordChecks).every(Boolean);
  const isLoginPasswordReady = form.password.length >= 8;

  const handleShowPassword = (setter) => {
    setter(true);
    setTimeout(() => setter(false), 1500);
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
        setResetStep(1);
        setResetEmail(form.email);
      } else {
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        if (attemptsLeft !== undefined) {
          setError(`Invalid credentials — ${attemptsLeft} attempt${attemptsLeft !== 1 ? 's' : ''} left`);
        } else {
          setError('Invalid credentials');
        }
        if (newAttempts >= 3) setResetStep(1);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSendResetOTP = async () => {
    setResetLoading(true);
    setResetMsg('');
    try {
      await sendResetOTP({ email: resetEmail });
      setResetMsg('');
      setResetStep(2);
    } catch (err) {
      setResetMsg('❌ ' + (err.response?.data?.message || 'Failed to send OTP'));
    } finally {
      setResetLoading(false);
    }
  };

  const handleVerifyResetOTP = async () => {
    setResetLoading(true);
    setResetMsg('');
    try {
      await verifyResetOTP({ email: resetEmail, otp: resetOtp });
      setResetStep(3);
    } catch (err) {
      setResetMsg('❌ ' + (err.response?.data?.message || 'Invalid OTP'));
    } finally {
      setResetLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      setResetMsg('❌ Passwords do not match');
      return;
    }
    if (!isPasswordValid) {
      setResetMsg('❌ Password does not meet requirements');
      return;
    }
    setResetLoading(true);
    setResetMsg('');
    try {
      await resetPassword({ email: resetEmail, otp: resetOtp, newPassword, confirmPassword });
      setResetMsg('✅ Password reset successfully!');
      setTimeout(() => {
        setResetStep(0);
        setAttempts(0);
        setIsLocked(false);
        setError('');
        setResetOtp('');
        setNewPassword('');
        setConfirmPassword('');
      }, 2000);
    } catch (err) {
      setResetMsg('❌ ' + (err.response?.data?.message || 'Reset failed'));
    } finally {
      setResetLoading(false);
    }
  };

  const containerStyle = {
    minHeight: '100vh',
    background: '#000000',
    backgroundImage: 'radial-gradient(ellipse at center, #0D1F0D 0%, #000000 70%)',
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center', padding: '20px'
  };

  const cardStyle = {
    background: '#0D1F0D',
    border: '1px solid #00CC7A',
    padding: '32px'
  };

  const labelStyle = {
    color: '#00CC7A', fontSize: '11px',
    letterSpacing: '2px', display: 'block', marginBottom: '8px'
  };

  return (
    <div style={containerStyle}>
      <div style={{ width: '100%', maxWidth: '400px' }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{
            border: '1px solid #00FF9C', padding: '6px 20px',
            display: 'inline-block', marginBottom: '8px',
            boxShadow: '0 0 20px rgba(0,255,156,0.3)'
          }}>
            <span style={{ fontFamily: 'Orbitron, monospace', fontSize: '24px', fontWeight: '900', color: '#00FF9C' }}>FEM</span>
            <span style={{ fontFamily: 'Orbitron, monospace', fontSize: '24px', color: '#F5A623' }}>BANK</span>
          </div>
          <p style={{ color: '#00CC7A', fontSize: '11px', letterSpacing: '3px' }}>
            {resetStep === 0 ? '> AUTHENTICATE_USER' : '> RESET_PASSWORD'}
          </p>
        </div>

        {/* Step 0 — Login */}
        {resetStep === 0 && (
          <div style={cardStyle}>
            <p style={{ color: '#00FF9C', fontSize: '12px', letterSpacing: '2px', marginBottom: '24px' }}>
              {'>'} ENTER_CREDENTIALS
            </p>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '16px' }}>
                <label style={labelStyle}>{'>'} EMAIL_ADDRESS</label>
                <input className="input-field" type="email" placeholder="user@fembank.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })} required />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={labelStyle}>{'>'} PASSWORD</label>
                <div style={{ position: 'relative' }}>
                  <input className="input-field"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    required
                    style={{ paddingRight: '48px' }} />
                  <button type="button"
                    onMouseDown={() => handleShowPassword(setShowPassword)}
                    style={{
                      position: 'absolute', right: '12px', top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'transparent', border: 'none',
                      cursor: 'pointer', fontSize: '16px', color: '#00CC7A'
                    }}>
                    {showPassword ? '●●●' : '●○○'}
                  </button>
                </div>
                {form.password.length > 0 && form.password.length < 8 && (
                  <p style={{ color: '#FF4444', fontSize: '10px', marginTop: '4px' }}>
                    ❌ Password must be at least 8 characters
                  </p>
                )}
              </div>

              {error && (
                <p style={{ color: '#FF4444', fontSize: '11px', marginBottom: '16px', letterSpacing: '1px' }}>
                  {'>'} {error}
                </p>
              )}

              {attempts >= 3 && (
                <div style={{ marginBottom: '16px' }}>
                  <button type="button" className="btn-gold"
                    onClick={() => setResetStep(1)}>
                    {'>'} RESET_PASSWORD
                  </button>
                </div>
              )}

              <button className="btn-primary" type="submit"
                disabled={loading || !isLoginPasswordReady}>
                {loading ? '> AUTHENTICATING...' : '> LOGIN_TO_ACCOUNT'}
              </button>
            </form>
          </div>
        )}

        {/* Step 1 — Enter email for reset */}
        {resetStep === 1 && (
          <div style={cardStyle}>
            <p style={{ color: '#00FF9C', fontSize: '12px', letterSpacing: '2px', marginBottom: '8px' }}>
              {'>'} RESET_PASSWORD
            </p>
            <p style={{ color: '#444444', fontSize: '11px', marginBottom: '24px' }}>
              Enter your email to receive a reset OTP
            </p>

            <div style={{ marginBottom: '24px' }}>
              <label style={labelStyle}>{'>'} EMAIL_ADDRESS</label>
              <input className="input-field" type="email" placeholder="user@fembank.com"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)} />
            </div>

            {resetMsg && (
              <p style={{ color: '#FF4444', fontSize: '11px', marginBottom: '16px' }}>{resetMsg}</p>
            )}

            <button className="btn-primary" onClick={handleSendResetOTP}
              disabled={resetLoading} style={{ marginBottom: '12px' }}>
              {resetLoading ? '> SENDING...' : '> SEND_RESET_OTP'}
            </button>

            <button className="btn-gold" onClick={() => { setResetStep(0); setError(''); setAttempts(0); }}>
              {'<'} BACK_TO_LOGIN
            </button>
          </div>
        )}

        {/* Step 2 — Enter OTP */}
        {resetStep === 2 && (
          <div style={cardStyle}>
            <p style={{ color: '#00FF9C', fontSize: '12px', letterSpacing: '2px', marginBottom: '8px' }}>
              {'>'} ENTER_OTP
            </p>
            <div style={{ background: '#000', border: '1px solid #333', padding: '12px', marginBottom: '20px' }}>
              <p style={{ color: '#333', fontSize: '10px' }}>
                OTP sent to :: <span style={{ color: '#00FF9C' }}>{resetEmail}</span>
              </p>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={labelStyle}>{'>'} ENTER_OTP</label>
              <input className="input-field" type="text" placeholder="000000"
                maxLength={6}
                value={resetOtp}
                onChange={(e) => setResetOtp(e.target.value.replace(/\D/g, ''))}
                style={{ fontSize: '24px', letterSpacing: '8px', textAlign: 'center' }} />
              <p style={{ color: '#444', fontSize: '10px', marginTop: '4px', textAlign: 'right' }}>
                {resetOtp.length}/6
              </p>
            </div>

            {resetMsg && (
              <p style={{ color: '#FF4444', fontSize: '11px', marginBottom: '16px' }}>{resetMsg}</p>
            )}

            <button className="btn-primary" onClick={handleVerifyResetOTP}
              disabled={resetLoading || resetOtp.length !== 6}
              style={{ marginBottom: '12px' }}>
              {resetLoading ? '> VERIFYING...' : '> VERIFY_OTP'}
            </button>

            <button className="btn-gold" onClick={() => setResetStep(1)}>
              {'<'} BACK
            </button>
          </div>
        )}

        {/* Step 3 — New password */}
        {resetStep === 3 && (
          <div style={cardStyle}>
            <p style={{ color: '#00FF9C', fontSize: '12px', letterSpacing: '2px', marginBottom: '24px' }}>
              {'>'} SET_NEW_PASSWORD
            </p>

            {/* New password */}
            <div style={{ marginBottom: '16px' }}>
              <label style={labelStyle}>{'>'} NEW_PASSWORD</label>
              <div style={{ position: 'relative' }}>
                <input className="input-field"
                  type={showNewPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    setPasswordChecks(checkPassword(e.target.value));
                  }}
                  style={{ paddingRight: '48px' }} />
                <button type="button"
                  onMouseDown={() => handleShowPassword(setShowNewPassword)}
                  style={{
                    position: 'absolute', right: '12px', top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'transparent', border: 'none',
                    cursor: 'pointer', fontSize: '16px', color: '#00CC7A'
                  }}>
                  {showNewPassword ? 'HIDE' : 'SHOW'}
                </button>
              </div>

              {newPassword.length > 0 && (
                <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {[
                    { key: 'length', label: 'At least 8 characters' },
                    { key: 'letter', label: 'Contains a letter' },
                    { key: 'number', label: 'Contains a number' },
                    { key: 'special', label: 'Contains special character (!@#$%^&*)' },
                  ].map(check => (
                    <p key={check.key} style={{
                      fontSize: '10px',
                      color: passwordChecks[check.key] ? '#00FF9C' : '#FF4444'
                    }}>
                      {passwordChecks[check.key] ? '✅' : '❌'} {check.label}
                    </p>
                  ))}
                </div>
              )}
            </div>

            {/* Confirm password */}
            <div style={{ marginBottom: '24px' }}>
              <label style={labelStyle}>{'>'} CONFIRM_PASSWORD</label>
              <div style={{ position: 'relative' }}>
                <input className="input-field"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  style={{ paddingRight: '48px' }} />
                <button type="button"
                  onMouseDown={() => handleShowPassword(setShowConfirmPassword)}
                  style={{
                    position: 'absolute', right: '12px', top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'transparent', border: 'none',
                    cursor: 'pointer', fontSize: '16px', color: '#00CC7A'
                  }}>
                  {showConfirmPassword ? 'HIDE' : 'SHOW'}
                </button>
              </div>

              {confirmPassword.length > 0 && (
                <p style={{
                  fontSize: '10px', marginTop: '4px',
                  color: newPassword === confirmPassword ? '#00FF9C' : '#FF4444'
                }}>
                  {newPassword === confirmPassword ? '✅ Passwords match' : '❌ Passwords do not match'}
                </p>
              )}
            </div>

            {resetMsg && (
              <p style={{
                fontSize: '11px', marginBottom: '16px',
                color: resetMsg.includes('✅') ? '#00FF9C' : '#FF4444'
              }}>
                {resetMsg}
              </p>
            )}

            <button className="btn-primary" onClick={handleResetPassword}
              disabled={resetLoading || !isPasswordValid || newPassword !== confirmPassword}>
              {resetLoading ? '> RESETTING...' : '> RESET_PASSWORD'}
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
