'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './LogOut.module.css';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function LogOutPage() {
  const router = useRouter();

  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    router.push('/Login');
  };

  const handleDeleteAccount = async () => {
    const currentUserStr = localStorage.getItem('currentUser');
    if (!currentUserStr) {
      router.push('/Login');
      return;
    }

    const confirmed = window.confirm('Are you sure you want to permanently delete your account? This action cannot be undone.');
    if (!confirmed) return;

    const currentUser = JSON.parse(currentUserStr);
    const userId = currentUser.id || currentUser._id;

    try {
      const res = await fetch(`${API_URL}/api/users/${userId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        const message = data.error || 'Failed to delete account. Please try again later.';
        alert(message);
        return;
      }

      // only remove local session and redirect after successful deletion
      localStorage.removeItem('currentUser');
      router.push('/Login');
    } catch (error) {
      console.error('Unable to delete account:', error);
      alert('Unable to delete account. Please try again later.');
    }
  };

  const handleProfile = () => {
    router.push('/Profile');
  };

  const handleManageShops = () => {
    router.push('/AddShop');
  };

  return (
    <main className={styles.logoutPage}>
      <section className={styles.logoutContent}>
        <div className={styles.logoutCard}>
          <div className={styles.sidebar}>
            <button className={styles.sidebarItem} onClick={handleProfile}>
              Profile
            </button>
            <button className={styles.sidebarItem} onClick={handleManageShops}>
              Manage Shops
            </button>
            <button className={`${styles.sidebarItem} ${styles.logoutLink}`} onClick={handleLogout}>
              Logout
            </button>
          </div>

          <div className={styles.logoutMain}>
            <div className={styles.logoutHeader}>
              <h2 className={styles.logoutTitle}>Logout</h2>
            </div>

            <div className={styles.logoutActions}>
              <button className={styles.logoutButton} onClick={handleLogout}>
                Logout
              </button>
              <button className={styles.deleteButton} onClick={handleDeleteAccount}>
                Delete account
              </button>
              <p className={styles.logoutNote}>
                This will permanently delete your account.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
