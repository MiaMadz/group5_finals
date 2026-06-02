'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './LoginPage.module.css';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [forgotPasswordMode, setForgotPasswordMode] = useState(false);
  const router = useRouter();


  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!acceptedTerms) {
      setError('⚠️ You must agree to the terms and conditions before logging in.');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok) {
        if (data.user) {
          localStorage.setItem('currentUser', JSON.stringify(data.user));
        }
        router.push('/Home');
        return;
      }

      const errorMessage = data.error?.toLowerCase() || '';

      if (response.status === 404 || errorMessage.includes('not found')) {
        setError('⚠️ Account not found. Please sign up first.');
        return;
      }

      if (response.status === 401 || errorMessage.includes('incorrect password')) {
        setError('⚠️ Incorrect password. Please try again.');
        return;
      }

      setError('Unable to login. Please try again.');
    } catch (err) {
      setError('Unable to connect to the server. Please try again later.');
    }
  };

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email.trim()) {
      setError('⚠️ Please enter your email to reset your password.');
      return;
    }

    setSuccess('If an account exists for that email, a reset link has been sent.');
  };


  return (
    <main className={styles.loginPage}>
      <section className={styles.loginContent}>
        <div className={styles.loginCard}>
          <div className={styles.loginHeader}>
            <h1 className={styles.loginTitle}>Login</h1>
          </div>

          <form
            className={styles.loginForm}
            onSubmit={forgotPasswordMode ? handleForgotPasswordSubmit : handleLogin}
          >
            {error && <div className={styles.errorMessage}>{error}</div>}
            {success && <div className={styles.successMessage}>{success}</div>}
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel} htmlFor="email">
                Email *
              </label>
              <input
                id="email"
                className={styles.fieldInput}
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {!forgotPasswordMode ? (
              <>
                <div className={styles.fieldGroup}>
                  <div className={styles.fieldLabelRow}>
                    <span>Password *</span>
                    <button
                      type="button"
                      className={styles.linkButton}
                      onClick={() => {
                        setForgotPasswordMode(true)
                        setError('')
                        setSuccess('')
                      }}
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <div className={styles.passwordWrapper}>
                    <input
                      id="password"
                      className={styles.fieldInput}
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className={styles.passwordToggle}
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      <img
                        src={showPassword ? '/images/show.png' : '/images/hidden.png'}
                        alt={showPassword ? 'Hide password' : 'Show password'}
                        className={styles.toggleIcon}
                      />
                    </button>
                  </div>
                </div>

                <div className={styles.actions}>
                  <label className={styles.rememberMe}>
                    <input
                      type="checkbox"
                      checked={acceptedTerms}
                      onChange={(e) => setAcceptedTerms(e.target.checked)}
                    />
                    I agree to the terms and conditions
                  </label>
                </div>
              </>
            ) : (
              <div className={styles.fieldGroup}>
                <button
                  type="button"
                  className={styles.linkButton}
                  onClick={() => {
                    setForgotPasswordMode(false)
                    setError('')
                    setSuccess('')
                  }}
                >
                  Back to Login
                </button>
              </div>
            )}

            <button
              type="submit"
              className={styles.loginButton}
              disabled={!forgotPasswordMode && !acceptedTerms}
            >
              {forgotPasswordMode ? 'Send Reset Link' : 'Login'}
            </button>
          </form>

          <p className={styles.signupPrompt}>
            Don’t have an account? <a href="/SignUp">Sign up</a>
          </p>
        </div>
      </section>
    </main>
  );
}
