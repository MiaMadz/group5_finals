'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './SignUpPage.module.css';

export default function SignUpPage() {
  const [isVisible, setIsVisible] = useState(true);
  const router = useRouter();

  const handleClose = () => {
    setIsVisible(false);
  };

  const handleSignUp = (e) => {
    e.preventDefault();
    router.push('/Home');
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
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel} htmlFor="name">
                Full Name
              </label>
              <input
                id="name"
                className={styles.fieldInput}
                type="text"
                placeholder="Full Name"
                required
              />
            </div>

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
              <label className={styles.fieldLabel} htmlFor="password">
                Password
              </label>
              <input
                id="password"
                className={styles.fieldInput}
                type="password"
                placeholder="Password"
                required
              />
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel} htmlFor="confirmPassword">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                className={styles.fieldInput}
                type="password"
                placeholder="Confirm Password"
                required
              />
            </div>

            <div className={styles.actions}>
              <label className={styles.rememberMe}>
                <input type="checkbox" />
                I agree to the terms and conditions
              </label>
            </div>

            <button type="submit" className={styles.loginButton}>
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