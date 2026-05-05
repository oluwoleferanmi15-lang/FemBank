import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginCustomer } from '../api/auth';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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

  return (
    <div style={{
      minHeight: '100vh',
      background: '#000000',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      backgroundImage: 'radial-gradient(ellipse at center, #0D1F0D 0%, #000000 70%)'
    }}>
      <div style={{ width: '100%', maxWidth: '400px' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{
            border: '1px solid #00FF9C',
            padding: '6px 20px',
            display: 'inline-block',
            marginBottom: '8px',
            boxShadow: '0 0 20px rgba(0,255,156,0.3)'
          }}>
            <span style={{ fontFamily: 'Orbitron, monospace', fontSize: '24px', fontWeight: '900', color: '#00FF9C' }}>FEM</span>
            <span style={{ fontFamily: 'Orbitron, monospace', fontSize: '24px', color: '#F5A623' }}>BANK</span>
          </div>
          <p style={{ color: '#00CC7A', fontSize: '11px', letterSpacing: '3px' }}>{'>'} AUTHENTICATE_USER</p>
        </div>

        {/* Form */}
        <div style={{
          background: '#0D1F0D',
          border: '1px solid #00CC7A',
          padding: '32px'
        }}>
          <p style={{ color: '#00FF9C', fontSize: '12px', letterSpacing: '2px', marginBottom: '24px' }}>
            {'>'} ENTER_CREDENTIALS
          </p>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ color: '#00CC7A', fontSize: '11px', letterSpacing: '2px', display: 'block', marginBottom: '8px' }}>
                {'>'} EMAIL_ADDRESS
              </label>
              <input
                className="input-field"
                type="email"
                placeholder="user@fembank.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ color: '#00CC7A', fontSize: '11px', letterSpacing: '2px', display: 'block', marginBottom: '8px' }}>
                {'>'} PASSWORD
              </label>
              <input
                className="input-field"
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>

            {error && <p className="error-msg" style={{ marginBottom: '16px' }}>{'>'} ERROR :: {error}</p>}

            <button className="btn-primary" type="submit" disabled={loading}>
              {loading ? '> AUTHENTICATING...' : '> LOGIN_TO_ACCOUNT'}
            </button>
          </form>
        </div>

        {/* Register link */}
        <p style={{ textAlign: 'center', marginTop: '24px', color: '#333333', fontSize: '12px', letterSpacing: '1px' }}>
          NO_ACCOUNT?{' '}
          <span
            style={{ color: '#F5A623', cursor: 'pointer' }}
            onClick={() => navigate('/register')}
          >
            {'>'} CREATE_ONE
          </span>
        </p>

        {/* Back */}
        <p style={{ textAlign: 'center', marginTop: '12px', color: '#333333', fontSize: '11px', cursor: 'pointer' }}
          onClick={() => navigate('/')}>
          {'<'} BACK_TO_HOME
        </p>

      </div>
    </div>
  );
};

export default Login;