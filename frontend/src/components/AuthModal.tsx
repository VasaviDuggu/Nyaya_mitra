import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../services/authApi';

type Mode = 'choice' | 'email_login' | 'email_signup' | 'phone';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, setSession } = useAuth();

  const [mode, setMode] = useState<Mode>('choice');

  // Email form state
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailOtp, setEmailOtp] = useState('');
  const [emailStep, setEmailStep] = useState<'form' | 'otp'>('form');

  // Phone form state
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [phoneStep, setPhoneStep] = useState<'number' | 'otp'>('number');
  const [needsNameForPhone, setNeedsNameForPhone] = useState(false);

  // Common feedback states
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  const resetForm = () => {
    setMode('choice');
    setFullName('');
    setEmail('');
    setPassword('');
    setEmailOtp('');
    setEmailStep('form');
    setPhoneNumber('');
    setOtp('');
    setPhoneStep('number');
    setNeedsNameForPhone(false);
    setInfoMessage(null);
    setError(null);
    setLoading(false);
  };

  const handleClose = () => {
    resetForm();
    closeAuthModal();
  };

  // ----------------------------------------------------
  // Email Login Handler
  // ----------------------------------------------------
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfoMessage(null);
    setLoading(true);

    try {
      const res = await authApi.loginWithEmail(email, password);
      if (res.token && res.user) {
        setSession(res.token, res.user);
        resetForm();
      }
    } catch (err: any) {
      setError(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------------------------------
  // Email Signup Step 1: Send Real Email Verification OTP
  // ----------------------------------------------------
  const handleSendEmailOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfoMessage(null);
    setLoading(true);

    try {
      if (!fullName.trim()) {
        setError('Full Name is required for registration.');
        setLoading(false);
        return;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters long.');
        setLoading(false);
        return;
      }

      await authApi.sendEmailOTP(email);
      setEmailStep('otp');
      setInfoMessage(`📩 6-digit verification code sent to ${email}. Please check your inbox.`);
    } catch (err: any) {
      setError(err.message || 'Failed to send Email OTP verification code.');
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------------------------------
  // Email Signup Step 2: Verify Email OTP & Complete Registration
  // ----------------------------------------------------
  const handleVerifyEmailOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfoMessage(null);
    setLoading(true);

    try {
      const res = await authApi.verifyEmailOTP(fullName, email, emailOtp, password);
      if (res.token && res.user) {
        setSession(res.token, res.user);
        resetForm();
      }
    } catch (err: any) {
      setError(err.message || 'Invalid or expired 6-digit Email OTP code.');
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------------------------------
  // Phone OTP Handlers (Twilio SMS)
  // ----------------------------------------------------
  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfoMessage(null);
    setLoading(true);

    try {
      const res = await authApi.sendPhoneOTP(phoneNumber);
      setPhoneStep('otp');
      if (!res.is_registered) {
        setNeedsNameForPhone(true);
      }
      setInfoMessage(`📱 6-digit SMS OTP code sent to ${phoneNumber}. Check your phone SMS.`);
    } catch (err: any) {
      setError(err.message || 'Failed to send SMS OTP code.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfoMessage(null);
    setLoading(true);

    try {
      if (needsNameForPhone && !fullName.trim()) {
        setError('Full Name is required for registration.');
        setLoading(false);
        return;
      }

      const res = await authApi.verifyPhoneOTP(phoneNumber, otp, fullName);
      if (res.status === 'requires_name') {
        setNeedsNameForPhone(true);
        setError('First time logging in with this phone number! Please enter your Full Name.');
        setLoading(false);
        return;
      }
      if (res.token && res.user) {
        setSession(res.token, res.user);
        resetForm();
      }
    } catch (err: any) {
      setError(err.message || 'Invalid or expired OTP code.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(3, 7, 18, 0.75)',
        backdropFilter: 'blur(16px)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 99999,
        animation: 'fadeIn 0.25s ease-out',
      }}
    >
      <div
        className="glass-card"
        style={{
          width: '420px',
          padding: '36px',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          background: 'rgba(15, 23, 42, 0.85)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '24px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          color: '#f8fafc',
        }}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            color: '#94a3b8',
            fontSize: '16px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s',
          }}
        >
          ✕
        </button>

        {/* Header */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '36px', marginBottom: '8px' }}>⚖️</div>
          <h2
            style={{
              margin: '4px 0 6px 0',
              fontSize: '22px',
              fontWeight: '800',
              color: '#ffffff',
              letterSpacing: '-0.5px',
            }}
          >
            {mode === 'choice' && 'Welcome to NyayaMitra'}
            {mode === 'email_login' && 'Sign In with Email'}
            {mode === 'email_signup' && (emailStep === 'form' ? 'Create Account' : 'Enter 6-Digit Email OTP')}
            {mode === 'phone' && (phoneStep === 'number' ? 'Sign In with Phone' : 'Enter 6-Digit SMS OTP')}
          </h2>
          <p style={{ margin: 0, fontSize: '13px', color: '#94a3b8' }}>
            {mode === 'choice' && 'Choose your preferred sign in method'}
            {mode === 'email_login' && 'Enter your credentials to access your workspace'}
            {mode === 'email_signup' && (emailStep === 'form' ? 'Real MX deliverability check & Email OTP' : `Code sent directly to ${email}`)}
            {mode === 'phone' && 'Twilio SMS verification code dispatch'}
          </p>
        </div>

        {/* Info Banner */}
        {infoMessage && (
          <div
            style={{
              background: 'rgba(59, 130, 246, 0.15)',
              border: '1px solid rgba(59, 130, 246, 0.4)',
              borderRadius: '12px',
              padding: '10px 14px',
              fontSize: '12.5px',
              color: '#93c5fd',
            }}
          >
            {infoMessage}
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div
            style={{
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              borderRadius: '12px',
              padding: '10px 14px',
              fontSize: '13px',
              color: '#fca5a5',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* MODE 1: CHOICE SCREEN */}
        {mode === 'choice' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '10px' }}>
            <button
              onClick={() => {
                setMode('email_login');
                setError(null);
                setInfoMessage(null);
              }}
              style={{
                width: '100%',
                padding: '14px 20px',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                color: '#ffffff',
                border: 'none',
                fontWeight: '600',
                fontSize: '14px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)',
                transition: 'transform 0.2s',
              }}
            >
              ✉️ Continue with Email
            </button>

            <button
              onClick={() => {
                setMode('phone');
                setError(null);
                setInfoMessage(null);
              }}
              style={{
                width: '100%',
                padding: '14px 20px',
                borderRadius: '14px',
                background: 'rgba(255, 255, 255, 0.06)',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                fontWeight: '600',
                fontSize: '14px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                transition: 'background 0.2s',
              }}
            >
              📱 Continue with Phone Number
            </button>
          </div>
        )}

        {/* MODE 2: EMAIL LOGIN FORM */}
        {mode === 'email_login' && (
          <form onSubmit={handleEmailLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '11px',
                  fontWeight: '700',
                  color: '#94a3b8',
                  marginBottom: '6px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
              >
                Email Address <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="email"
                required
                placeholder="you@nyayamitra.ai"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '12px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  color: '#ffffff',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                  outline: 'none',
                }}
              />
            </div>

            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '11px',
                  fontWeight: '700',
                  color: '#94a3b8',
                  marginBottom: '6px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
              >
                Password <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '12px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  color: '#ffffff',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                  outline: 'none',
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                color: '#ffffff',
                border: 'none',
                fontWeight: '700',
                fontSize: '14px',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
                marginTop: '6px',
                boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)',
              }}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>

            <div style={{ textAlign: 'center', fontSize: '13px', color: '#94a3b8', marginTop: '4px' }}>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('email_signup');
                  setEmailStep('form');
                  setError(null);
                  setInfoMessage(null);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#818cf8',
                  fontWeight: '700',
                  cursor: 'pointer',
                  padding: 0,
                  textDecoration: 'underline',
                }}
              >
                Create Account
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                setMode('choice');
                setError(null);
                setInfoMessage(null);
              }}
              style={{
                background: 'none',
                border: 'none',
                color: '#94a3b8',
                fontSize: '12.5px',
                cursor: 'pointer',
                textAlign: 'center',
                textDecoration: 'underline',
                marginTop: '4px',
              }}
            >
              ← Back to all options
            </button>
          </form>
        )}

        {/* MODE 3: EMAIL SIGNUP FORM (WITH REAL MX DELIVERABILITY & EMAIL OTP) */}
        {mode === 'email_signup' && (
          <div>
            {emailStep === 'form' ? (
              <form onSubmit={handleSendEmailOTP} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '11px',
                      fontWeight: '700',
                      color: '#94a3b8',
                      marginBottom: '6px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}
                  >
                    Full Name <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Hasini Mannepuri"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: '12px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      color: '#ffffff',
                      fontSize: '14px',
                      boxSizing: 'border-box',
                      outline: 'none',
                    }}
                  />
                </div>

                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '11px',
                      fontWeight: '700',
                      color: '#94a3b8',
                      marginBottom: '6px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}
                  >
                    Email Address (Real Domain Check) <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="you@nyayamitra.ai"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: '12px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      color: '#ffffff',
                      fontSize: '14px',
                      boxSizing: 'border-box',
                      outline: 'none',
                    }}
                  />
                </div>

                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '11px',
                      fontWeight: '700',
                      color: '#94a3b8',
                      marginBottom: '6px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}
                  >
                    Password <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: '12px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      color: '#ffffff',
                      fontSize: '14px',
                      boxSizing: 'border-box',
                      outline: 'none',
                    }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '14px',
                    borderRadius: '14px',
                    background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                    color: '#ffffff',
                    border: 'none',
                    fontWeight: '700',
                    fontSize: '14px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    opacity: loading ? 0.7 : 1,
                    marginTop: '6px',
                    boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)',
                  }}
                >
                  {loading ? 'Validating & Sending Email OTP...' : 'Send Verification OTP'}
                </button>

                <div style={{ textAlign: 'center', fontSize: '13px', color: '#94a3b8', marginTop: '4px' }}>
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('email_login');
                      setError(null);
                      setInfoMessage(null);
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#818cf8',
                      fontWeight: '700',
                      cursor: 'pointer',
                      padding: 0,
                      textDecoration: 'underline',
                    }}
                  >
                    Sign In
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setMode('choice');
                    setError(null);
                    setInfoMessage(null);
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#94a3b8',
                    fontSize: '12.5px',
                    cursor: 'pointer',
                    textAlign: 'center',
                    textDecoration: 'underline',
                    marginTop: '4px',
                  }}
                >
                  ← Back to all options
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyEmailOTP} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '11px',
                      fontWeight: '700',
                      color: '#94a3b8',
                      marginBottom: '6px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}
                  >
                    6-Digit Email OTP Code <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="123456"
                    value={emailOtp}
                    onChange={(e) => setEmailOtp(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: '12px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      color: '#ffffff',
                      fontSize: '18px',
                      fontWeight: '700',
                      letterSpacing: '6px',
                      textAlign: 'center',
                      boxSizing: 'border-box',
                      outline: 'none',
                    }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '14px',
                    borderRadius: '14px',
                    background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                    color: '#ffffff',
                    border: 'none',
                    fontWeight: '700',
                    fontSize: '14px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    opacity: loading ? 0.7 : 1,
                    boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)',
                  }}
                >
                  {loading ? 'Verifying OTP & Creating Account...' : 'Verify OTP & Create Account'}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setEmailStep('form');
                    setEmailOtp('');
                    setError(null);
                    setInfoMessage(null);
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#94a3b8',
                    fontSize: '12.5px',
                    cursor: 'pointer',
                    textAlign: 'center',
                    textDecoration: 'underline',
                  }}
                >
                  ← Edit Email Details
                </button>
              </form>
            )}
          </div>
        )}

        {/* MODE 4: PHONE OTP AUTH FORM (TWILIO SMS DISPATCH) */}
        {mode === 'phone' && (
          <div>
            {phoneStep === 'number' ? (
              <form onSubmit={handleSendOTP} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '11px',
                      fontWeight: '700',
                      color: '#94a3b8',
                      marginBottom: '6px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}
                  >
                    Phone Number (with Country Code) <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+14246557119"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: '12px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      color: '#ffffff',
                      fontSize: '14px',
                      boxSizing: 'border-box',
                      outline: 'none',
                    }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '14px',
                    borderRadius: '14px',
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    color: '#ffffff',
                    border: 'none',
                    fontWeight: '700',
                    fontSize: '14px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    opacity: loading ? 0.7 : 1,
                    boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)',
                  }}
                >
                  {loading ? 'Sending Twilio SMS OTP...' : 'Send Twilio SMS OTP'}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMode('choice');
                    setError(null);
                    setInfoMessage(null);
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#94a3b8',
                    fontSize: '12.5px',
                    cursor: 'pointer',
                    textAlign: 'center',
                    textDecoration: 'underline',
                  }}
                >
                  ← Back to all options
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOTP} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {needsNameForPhone && (
                  <div>
                    <label
                      style={{
                        display: 'block',
                        fontSize: '11px',
                        fontWeight: '700',
                        color: '#94a3b8',
                        marginBottom: '6px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                      }}
                    >
                      Full Name <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Enter your Full Name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px 14px',
                        borderRadius: '12px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.12)',
                        color: '#ffffff',
                        fontSize: '14px',
                        boxSizing: 'border-box',
                        outline: 'none',
                      }}
                    />
                  </div>
                )}

                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '11px',
                      fontWeight: '700',
                      color: '#94a3b8',
                      marginBottom: '6px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}
                  >
                    6-Digit SMS OTP Code <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="123456"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: '12px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      color: '#ffffff',
                      fontSize: '18px',
                      fontWeight: '700',
                      letterSpacing: '6px',
                      textAlign: 'center',
                      boxSizing: 'border-box',
                      outline: 'none',
                    }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '14px',
                    borderRadius: '14px',
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    color: '#ffffff',
                    border: 'none',
                    fontWeight: '700',
                    fontSize: '14px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    opacity: loading ? 0.7 : 1,
                    boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)',
                  }}
                >
                  {loading ? 'Verifying OTP...' : 'Verify OTP & Sign In'}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setPhoneStep('number');
                    setOtp('');
                    setError(null);
                    setInfoMessage(null);
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#94a3b8',
                    fontSize: '12.5px',
                    cursor: 'pointer',
                    textAlign: 'center',
                    textDecoration: 'underline',
                  }}
                >
                  ← Re-enter Phone Number
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
