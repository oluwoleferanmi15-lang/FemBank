import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerCustomer, sendOTP, verifyOTP } from '../api/auth';
import { useAuth } from '../context/AuthContext';

const checkPassword = (pass) => ({
  length: pass.length >= 8,
  letter: /[a-zA-Z]/.test(pass),
  number: /[0-9]/.test(pass),
  special: /[!@#$%^&*]/.test(pass)
});

const calculateAge = (dob) => {
  const today = new Date();
  const birthDate = new Date(dob);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) age--;
  return age;
};

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', password: '',
    phone: '', kycType: 'bvn', kycID: '', dob: ''
  });
  const [otp, setOtp] = useState('');
  const [passwordChecks, setPasswordChecks] = useState({
    length: false, letter: false, number: false, special: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [ageError, setAgeError] = useState('');

  const isPasswordValid = Object.values(passwordChecks).every(Boolean);
  const isKycValid = form.kycID.length === 11;
  const isPhoneValid = form.phone.length === 10;

  const handlePasswordChange = (val) => {
    setForm({ ...form, password: val });
    setPasswordChecks(checkPassword(val));
  };

  const handleShowPassword = () => {
    setShowPassword(true);
    setTimeout(() => setShowPassword(false), 2000);
  };

  const handleDobChange = (val) => {
    setForm({ ...form, dob: val });
    if (val) {
      const age = calculateAge(val);
      if (age < 18) {
        setAgeError(`You must be at least 18 years old. You are ${age} years old.`);
      } else {
        setAgeError('');
      }
    }
  };

  const handleSendOTP = async () => {
    if (!form.firstName || !form.email) {
      setError('First name and email are required');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await sendOTP({ email: form.email, firstName: form.firstName });
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    setLoading(true);
    setError('');
    try {
      await verifyOTP({ email: form.email, otp });
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isKycValid) { setError('BVN/NIN must be exactly 11 digits'); return; }
    if (!isPhoneValid) { setError('Phone number must be 10 digits after +234'); return; }
    if (ageError) { setError(ageError); return; }
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
      backgroundImage: 'radial-gradient(ellipse at center, #0D1F0D 0%, #000000 70%)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', padding: '20px'
    }}>
      <div style={{ width: '100%', maxWidth: '400px' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            border: '1px solid #00FF9C', padding: '6px 20px',
            display: 'inline-block', marginBottom: '8px',
            boxShadow: '0 0 20px rgba(0,255,156,0.3)'
          }}>
            <span style={{ fontFamily: 'Orbitron, monospace', fontSize: '24px', fontWeight: '900', color: '#00FF9C' }}>FEM</span>
            <span style={{ fontFamily: 'Orbitron, monospace', fontSize: '24px', color: '#F5A623' }}>BANK</span>
          </div>
          <p style={{ color: '#00CC7A', fontSize: '11px', letterSpacing: '3px' }}>{'>'} NEW_ACCOUNT_REGISTRATION</p>
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

          {/* Step 1 - Basic Info */}
          {step === 1 && (
            <>
              <p style={{ color: '#00FF9C', fontSize: '12px', letterSpacing: '2px', marginBottom: '24px' }}>
                {'>'} STEP_1 :: BASIC_INFO
              </p>

              {[
                { label: 'FIRST_NAME', key: 'firstName', type: 'text', placeholder: 'John' },
                { label: 'LAST_NAME', key: 'lastName', type: 'text', placeholder: 'Doe' },
                { label: 'EMAIL_ADDRESS', key: 'email', type: 'email', placeholder: 'user@fembank.com' },
              ].map(field => (
                <div key={field.key} style={{ marginBottom: '16px' }}>
                  <label style={{ color: '#00CC7A', fontSize: '11px', letterSpacing: '2px', display: 'block', marginBottom: '8px' }}>
                    {'>'} {field.label}
                  </label>
                  <input className="input-field" type={field.type} placeholder={field.placeholder}
                    value={form[field.key]}
                    onChange={(e) => setForm({ ...form, [field.key]: e.target.value })} />
                </div>
              ))}

              {error && <p className="error-msg" style={{ marginBottom: '16px' }}>{'>'} ERROR :: {error}</p>}

              <button className="btn-primary" onClick={handleSendOTP} disabled={loading}>
                {loading ? '> SENDING_OTP...' : '> SEND_OTP_TO_EMAIL'}
              </button>
            </>
          )}

          {/* Step 2 - OTP Verification */}
          {step === 2 && (
            <>
              <p style={{ color: '#00FF9C', fontSize: '12px', letterSpacing: '2px', marginBottom: '24px' }}>
                {'>'} STEP_2 :: EMAIL_VERIFICATION
              </p>

              <div style={{ background: '#000000', border: '1px solid #333', padding: '12px', marginBottom: '20px' }}>
                <p style={{ color: '#333333', fontSize: '10px' }}>
                  OTP sent to :: <span style={{ color: '#00FF9C' }}>{form.email}</span>
                </p>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ color: '#00CC7A', fontSize: '11px', letterSpacing: '2px', display: 'block', marginBottom: '8px' }}>
                  {'>'} ENTER_OTP
                </label>
                <input className="input-field" type="text" placeholder="000000"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  style={{ fontSize: '24px', letterSpacing: '8px', textAlign: 'center' }} />
                <p style={{ color: '#333333', fontSize: '10px', marginTop: '4px', textAlign: 'right' }}>
                  {otp.length}/6
                </p>
              </div>

              {error && <p className="error-msg" style={{ marginBottom: '16px' }}>{'>'} ERROR :: {error}</p>}

              <button className="btn-primary" onClick={handleVerifyOTP}
                disabled={loading || otp.length !== 6} style={{ marginBottom: '12px' }}>
                {loading ? '> VERIFYING...' : '> VERIFY_OTP'}
              </button>

              <button className="btn-gold" onClick={() => { setStep(1); setOtp(''); setError(''); }}>
                {'<'} BACK
              </button>

              <p style={{ color: '#333333', fontSize: '10px', marginTop: '12px', textAlign: 'center' }}>
                Didn't receive OTP?{' '}
                <span style={{ color: '#F5A623', cursor: 'pointer' }}
                  onClick={handleSendOTP}>
                  Resend
                </span>
              </p>
            </>
          )}

          {/* Step 3 - Personal Details */}
          {step === 3 && (
            <>
              <p style={{ color: '#00FF9C', fontSize: '12px', letterSpacing: '2px', marginBottom: '24px' }}>
                {'>'} STEP_3 :: PERSONAL_DETAILS
              </p>

              {/* Phone number */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ color: '#00CC7A', fontSize: '11px', letterSpacing: '2px', display: 'block', marginBottom: '8px' }}>
                  {'>'} PHONE_NUMBER
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <div style={{
                    background: '#000000', border: '1px solid #00CC7A',
                    padding: '12px', color: '#00FF9C', fontSize: '14px',
                    whiteSpace: 'nowrap'
                  }}>
                    +234
                  </div>
                  <input className="input-field" type="tel"
                    placeholder="8012345678"
                    maxLength={10}
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/\D/g, '') })} />
                </div>
                <p style={{
                  fontSize: '10px', marginTop: '4px', textAlign: 'right',
                  color: isPhoneValid ? '#00FF9C' : '#FF4444'
                }}>
                  {form.phone.length}/10 {isPhoneValid ? '✅' : `— need ${10 - form.phone.length} more`}
                </p>
              </div>

              {/* Password */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ color: '#00CC7A', fontSize: '11px', letterSpacing: '2px', display: 'block', marginBottom: '8px' }}>
                  {'>'} PASSWORD
                </label>
                <div style={{ position: 'relative' }}>
                  <input className="input-field"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={form.password}
                    onChange={(e) => handlePasswordChange(e.target.value)}
                    style={{ paddingRight: '48px' }} />
                  <button type="button" onClick={handleShowPassword} style={{
                    position: 'absolute', right: '12px', top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'transparent', border: 'none',
                    cursor: 'pointer', fontSize: '18px'
                  }}>
                    {showPassword ? '🔒' : '👁️'}
                  </button>
                </div>

                {form.password.length > 0 && (
                  <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {[
                      { key: 'length', label: 'At least 8 characters' },
                      { key: 'letter', label: 'Contains a letter' },
                      { key: 'number', label: 'Contains a number' },
                      { key: 'special', label: 'Contains special character (!@#$%^&*)' },
                    ].map(check => (
                      <p key={check.key} style={{
                        fontSize: '10px', letterSpacing: '1px',
                        color: passwordChecks[check.key] ? '#00FF9C' : '#FF4444'
                      }}>
                        {passwordChecks[check.key] ? '✅' : '❌'} {check.label}
                      </p>
                    ))}
                  </div>
                )}
              </div>

              {error && <p className="error-msg" style={{ marginBottom: '16px' }}>{'>'} ERROR :: {error}</p>}

              <button className="btn-primary" onClick={() => {
                if (!form.phone || !form.password) { setError('All fields required'); return; }
                if (!isPasswordValid) { setError('Password does not meet requirements'); return; }
                if (!isPhoneValid) { setError('Phone number must be 10 digits'); return; }
                setError('');
                setStep(4);
              }}>
                {'>'} NEXT_STEP
              </button>

              <button className="btn-gold" onClick={() => setStep(2)} style={{ marginTop: '12px' }}>
                {'<'} BACK
              </button>
            </>
          )}

          {/* Step 4 - KYC */}
          {step === 4 && (
            <form onSubmit={handleSubmit}>
              <p style={{ color: '#00FF9C', fontSize: '12px', letterSpacing: '2px', marginBottom: '24px' }}>
                {'>'} STEP_4 :: KYC_VERIFICATION
              </p>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ color: '#00CC7A', fontSize: '11px', letterSpacing: '2px', display: 'block', marginBottom: '8px' }}>
                  {'>'} KYC_TYPE
                </label>
                <select className="input-field" value={form.kycType}
                  onChange={(e) => setForm({ ...form, kycType: e.target.value, kycID: '' })}
                  style={{ background: '#000000' }}>
                  <option value="bvn">BVN</option>
                  <option value="nin">NIN</option>
                </select>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ color: '#00CC7A', fontSize: '11px', letterSpacing: '2px', display: 'block', marginBottom: '8px' }}>
                  {'>'} {form.kycType.toUpperCase()}_NUMBER (11 digits)
                </label>
                <input className="input-field" type="text"
                  placeholder={`Enter your 11-digit ${form.kycType.toUpperCase()}`}
                  maxLength={11}
                  value={form.kycID}
                  onChange={(e) => setForm({ ...form, kycID: e.target.value.replace(/\D/g, '') })} />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
                  <p style={{ fontSize: '10px', color: isKycValid ? '#00FF9C' : '#FF4444' }}>
                    {isKycValid ? '✅ Valid' : `❌ Need ${11 - form.kycID.length} more digit${11 - form.kycID.length !== 1 ? 's' : ''}`}
                  </p>
                  <p style={{ fontSize: '10px', color: isKycValid ? '#00FF9C' : '#FF4444' }}>
                    {form.kycID.length}/11
                  </p>
                </div>
              </div>

              {/* Date of birth with age validation */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{ color: '#00CC7A', fontSize: '11px', letterSpacing: '2px', display: 'block', marginBottom: '8px' }}>
                  {'>'} DATE_OF_BIRTH (must be 18+)
                </label>
                <input className="input-field" type="date"
                  value={form.dob}
                  onChange={(e) => handleDobChange(e.target.value)}
                  required style={{ colorScheme: 'dark' }} />
                {ageError && (
                  <p style={{ color: '#FF4444', fontSize: '10px', marginTop: '4px' }}>
                    ❌ {ageError}
                  </p>
                )}
                {form.dob && !ageError && (
                  <p style={{ color: '#00FF9C', fontSize: '10px', marginTop: '4px' }}>
                    ✅ Age verified
                  </p>
                )}
              </div>

              {error && <p className="error-msg" style={{ marginBottom: '16px' }}>{'>'} ERROR :: {error}</p>}

              <button className="btn-primary" type="submit"
                disabled={loading || !isKycValid || !!ageError || !form.dob}
                style={{ marginBottom: '12px', opacity: (!isKycValid || !!ageError) ? 0.5 : 1 }}>
                {loading ? '> VERIFYING_IDENTITY...' : '> CREATE_ACCOUNT'}
              </button>

              <button className="btn-gold" type="button" onClick={() => setStep(3)}>
                {'<'} BACK
              </button>
            </form>
          )}
        </div>

        <p style={{ textAlign: 'center', marginTop: '24px', color: '#444444', fontSize: '12px' }}>
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