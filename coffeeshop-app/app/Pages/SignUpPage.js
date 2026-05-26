'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './SignUpPage.module.css';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

export default function SignUpPage() {
  const [isVisible, setIsVisible] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const router = useRouter();

  const handleClose = () => {
    setIsVisible(false);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!acceptedTerms) {
      setError('⚠️ You must agree to the terms and conditions before signing up.');
      return;
    }

    if (password !== confirmPassword) {
      setError('⚠️ The password you entered do not match.');
      return;
    }

    if (!PASSWORD_REGEX.test(password)) {
      setError('⚠️ Password must be at least 8 characters long and include at least one uppercase letter and one number.');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/users/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          password,
          address: '',
          city: '',
          state_province: '',
          postal_code: '',
          country: '',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Unable to create account.');
        return;
      }

      setSuccess('Account created successfully. Redirecting to login...');
      setTimeout(() => router.push('/Login'), 1200);
    } catch (err) {
      setError('Unable to connect to the server. Please try again later.');
    }
  };

  if (!isVisible) {
    return (
      <main className={styles.loginPage}>
        <div className={styles.showLogin}>
          <button className={styles.showLoginButton} onClick={() => setIsVisible(true)}>
            Sign Up Here
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
            <h1 className={styles.loginTitle}>Sign Up</h1>
            <button className={styles.closeButton} type="button" aria-label="Close" onClick={handleClose}>
              ×
            </button>
          </div>

          <form className={styles.loginForm} onSubmit={handleSignUp}>
            {error && <div className={styles.errorMessage}>{error}</div>}
            {success && <div className={styles.successMessage}>{success}</div>}
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel} htmlFor="name">
                Full Name *
              </label>
              <input
                id="name"
                className={styles.fieldInput}
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

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

            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel} htmlFor="password">
                Password *
              </label>
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

            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel} htmlFor="confirmPassword">
                Confirm Password *
              </label>
              <div className={styles.passwordWrapper}>
                <input
                  id="confirmPassword"
                  className={styles.fieldInput}
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className={styles.passwordToggle}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  <img
                    src={showConfirmPassword ? "/images/show.png" : "/images/hidden.png"}
                    alt={showConfirmPassword ? "Hide password" : "Show password"}
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
              Sign Up
            </button>
          </form>

          <p className={styles.signupPrompt}>
            Already have an account? <a href="/Login">Login</a>
          </p>
        </div>
      </section>
    </main>
  );
}