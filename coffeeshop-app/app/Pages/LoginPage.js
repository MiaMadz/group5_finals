'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './LoginPage.module.css';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function LoginPage() {
  const [isVisible, setIsVisible] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const router = useRouter();

  const handleClose = () => {
    setIsVisible(false);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch(`${API_URL}/api/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!acceptedTerms) {
        setError('⚠️ You must agree to the terms and conditions before logging in.');
        return;
      }

      if (response.ok) {
        router.push('/Home');
        return;
      }

      let data = {};
      try {
        data = await response.json();
      } catch {
        data = {};
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

  if (!isVisible) {
    return (
      <main className={styles.loginPage}>
        <div className={styles.showLogin}>
          <button className={styles.showLoginButton} onClick={() => setIsVisible(true)}>
            Login Here
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.loginPage}>
      <section className={styles.loginContent}>
        <div className={styles.loginCard}>
          <div className={styles.loginHeader}>
            <h1 className={styles.loginTitle}>Login</h1>
            <button className={styles.closeButton} type="button" aria-label="Close" onClick={handleClose}>
              ×
            </button>
          </div>

          <form className={styles.loginForm} onSubmit={handleLogin}>
            {error && <div className={styles.errorMessage}>{error}</div>}
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel} htmlFor="email">
                Email
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

            <div className={styles.fieldGroup}>
              <div className={styles.fieldLabelRow}>
                <span>Password</span>
                <a className={styles.linkButton} href="#">
                  Forgot Password?
                </a>
              </div>
              <div className={styles.passwordWrapper}>
                <input
                  id="password"
                  className={styles.fieldInput}
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className={styles.passwordToggle}
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  <img
                    src={showPassword ? "/images/show.png" : "/images/hidden.png"}
                    alt={showPassword ? "Hide password" : "Show password"}
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

            <button
              type="submit"
              className={styles.loginButton}
              disabled={!acceptedTerms}
            >
              Login
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
