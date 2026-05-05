import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerCustomer } from '../api/auth';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', password: '',
    phone: '', kycType: 'bvn', kycID: '', dob: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await registerCustomer(form);
      login(data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
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
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
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
          <p style={{ color: '#00CC7A', fontSize: '11px', letterSpacing: '3px' }}>{'>'} NEW_ACCOUNT_REGISTRATION</p>
        </div>

        {/* Progress */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
          {[1, 2].map(s => (
            <div key={s} style={{
              flex: 1, height: '2px',
              background: step >= s ? '#00FF9C' : '#333333',
              boxShadow: step >= s ? '0 0 8px #00FF9C' : 'none',
              transition: 'all 0.3s'
            }} />
          ))}
        </div>

        {/* Form */}
        <div style={{ background: '#0D1F0D', border: '1px solid #00CC7A', padding: '32px' }}>

          {step === 1 && (
            <>
              <p style={{ color: '#00FF9C', fontSize: '12px', letterSpacing: '2px', marginBottom: '24px' }}>
                {'>'} STEP_1 :: PERSONAL_INFO
              </p>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ color: '#00CC7A', fontSize: '11px', letterSpacing: '2px', display: 'block', marginBottom: '8px' }}>{'>'} FIRST_NAME</label>
                <input className="input-field" type="text" placeholder="John"
                  value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} required />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ color: '#00CC7A', fontSize: '11px', letterSpacing: '2px', display: 'block', marginBottom: '8px' }}>{'>'} LAST_NAME</label>
                <input className="input-field" type="text" placeholder="Doe"
                  value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} required />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ color: '#00CC7A', fontSize: '11px', letterSpacing: '2px', display: 'block', marginBottom: '8px' }}>{'>'} EMAIL_ADDRESS</label>
                <input className="input-field" type="email" placeholder="user@fembank.com"
                  value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ color: '#00CC7A', fontSize: '11px', letterSpacing: '2px', display: 'block', marginBottom: '8px' }}>{'>'} PHONE_NUMBER</label>
                <input className="input-field" type="tel" placeholder="08012345678"
                  value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ color: '#00CC7A', fontSize: '11px', letterSpacing: '2px', display: 'block', marginBottom: '8px' }}>{'>'} PASSWORD</label>
                <input className="input-field" type="password" placeholder="••••••••"
                  value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
              </div>

              <button className="btn-primary" onClick={() => {
                if (!form.firstName || !form.lastName || !form.email || !form.phone || !form.password) {
                  setError('All fields are required');
                  return;
                }
                setError('');
                setStep(2);
              }}>
                {'>'} NEXT_STEP
              </button>
            </>
          )}

          {step === 2 && (
            <form onSubmit={handleSubmit}>
              <p style={{ color: '#00FF9C', fontSize: '12px', letterSpacing: '2px', marginBottom: '24px' }}>
                {'>'} STEP_2 :: KYC_VERIFICATION
              </p>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ color: '#00CC7A', fontSize: '11px', letterSpacing: '2px', display: 'block', marginBottom: '8px' }}>{'>'} KYC_TYPE</label>
                <select className="input-field" value={form.kycType}
                  onChange={(e) => setForm({ ...form, kycType: e.target.value })}
                  style={{ background: '#000000' }}>
                  <option value="bvn">BVN</option>
                  <option value="nin">NIN</option>
                </select>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ color: '#00CC7A', fontSize: '11px', letterSpacing: '2px', display: 'block', marginBottom: '8px' }}>{'>'} {form.kycType.toUpperCase()}_NUMBER</label>
                <input className="input-field" type="text" placeholder="12345678901"
                  value={form.kycID} onChange={(e) => setForm({ ...form, kycID: e.target.value })} required />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ color: '#00CC7A', fontSize: '11px', letterSpacing: '2px', display: 'block', marginBottom: '8px' }}>{'>'} DATE_OF_BIRTH</label>
                <input className="input-field" type="date"
                  value={form.dob} onChange={(e) => setForm({ ...form, dob: e.target.value })} required
                  style={{ colorScheme: 'dark' }} />
              </div>

              {error && <p className="error-msg" style={{ marginBottom: '16px' }}>{'>'} ERROR :: {error}</p>}

              <button className="btn-primary" type="submit" disabled={loading}>
                {loading ? '> VERIFYING_IDENTITY...' : '> CREATE_ACCOUNT'}
              </button>

              <button className="btn-gold" type="button"
                onClick={() => setStep(1)} style={{ marginTop: '12px' }}>
                {'<'} BACK
              </button>
            </form>
          )}
        </div>

        <p style={{ textAlign: 'center', marginTop: '24px', color: '#333333', fontSize: '12px' }}>
          HAVE_ACCOUNT?{' '}
          <span style={{ color: '#F5A623', cursor: 'pointer' }} onClick={() => navigate('/login')}>
            {'>'} LOGIN
          </span>
        </p>
      </div>
    </div>
  );
};

export default Register;