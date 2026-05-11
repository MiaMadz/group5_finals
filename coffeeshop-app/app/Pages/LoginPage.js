'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './LoginPage.module.css';

export default function LoginPage() {
  const [isVisible, setIsVisible] = useState(true);
  const router = useRouter();

  const handleClose = () => {
    setIsVisible(false);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    router.push('/Home');
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
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel} htmlFor="email">
                Email
              </label>
              <input
                id="email"
                className={styles.fieldInput}
                type="email"
                placeholder="Email Address"
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
              <input
                id="password"
                className={styles.fieldInput}
                type="password"
                placeholder="Password"
                required
              />
            </div>

            <div className={styles.actions}>
              <label className={styles.rememberMe}>
                <input type="checkbox" />
                Remember me
              </label>
            </div>

            <button type="submit" className={styles.loginButton}>
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
