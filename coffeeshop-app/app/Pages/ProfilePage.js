'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './ProfilePage.module.css';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [province, setProvince] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const currentUserStr = localStorage.getItem('currentUser');
        if (!currentUserStr) {
          router.push('/Login');
          return;
        }
        const currentUser = JSON.parse(currentUserStr);
        const userId = currentUser.id || currentUser._id;

        const response = await fetch(`${API_URL}/api/users/${userId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch user profile');
        }

        const data = await response.json();
        setUser(data);
        setAddress(data.address || '');
        setCity(data.city || '');
        setCountry(data.country || '');
        setProvince(data.state_province || '');
        setPostalCode(data.postal_code || '');
      } catch (err) {
        setError('Failed to load profile');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [router]);

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const currentUserStr = localStorage.getItem('currentUser');
      const currentUser = JSON.parse(currentUserStr);
      const userId = currentUser.id || currentUser._id;
      const response = await fetch(`${API_URL}/api/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address,
          city,
          country,
          state_province: province,
          postal_code: postalCode,
        }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        const message = data.error || 'Failed to update profile';
        throw new Error(message);
      }

      // update local state and localStorage with returned user
      if (data.user) {
        setUser(data.user);
        setAddress(data.user.address || '');
        setCity(data.user.city || '');
        setCountry(data.user.country || '');
        setProvince(data.user.state_province || '');
        setPostalCode(data.user.postal_code || '');

        const newCurrentUser = { id: data.user.id, name: data.user.name, email: data.user.email };
        localStorage.setItem('currentUser', JSON.stringify(newCurrentUser));
      }

      setSuccess('Profile updated successfully!');
    } catch (err) {
      setError('Unable to save changes. Please try again later.');
      console.error(err);
    }
  };

  const handleLogout = () => {
    router.push('/LogOut');
  };

  const handleManageShops = () => {
    router.push('/AddShop');
  };

  if (loading) {
    return <div className={styles.profilePage}><div>Loading...</div></div>;
  }

  if (!user) {
    return <div className={styles.profilePage}><div>User not found</div></div>;
  }

  return (
    <main className={styles.profilePage}>
      <section className={styles.profileContent}>
        <div className={styles.profileCard}>
          <div className={styles.sidebar}>
            <button className={styles.sidebarItem} onClick={() => {}}>
              Profile
            </button>
            <button className={styles.sidebarItem} onClick={handleManageShops}>
              Manage Shops
            </button>
            <button className={styles.sidebarItem + ' ' + styles.logout} onClick={handleLogout}>
              Logout
            </button>
          </div>

          <div className={styles.profileMain}>
            <div className={styles.profileHeader}>
              <h2 className={styles.profileName}>{user.name}</h2>
              <p className={styles.profileEmail}>{user.email}</p>
            </div>

            <form className={styles.profileForm} onSubmit={handleSave}>
              <h3 className={styles.formTitle}>User Address</h3>
              
              {error && <div className={styles.errorMessage}>{error}</div>}
              {success && <div className={styles.successMessage}>{success}</div>}

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Address</label>
                <input
                  className={styles.formInput}
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Country</label>
                <input
                  className={styles.formInput}
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Province/State</label>
                <input
                  className={styles.formInput}
                  type="text"
                  value={province}
                  onChange={(e) => setProvince(e.target.value)}
                />
              </div>
              
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>City</label>
                <input
                  className={styles.formInput}
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>              

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Postal Code</label>
                <input
                  className={styles.formInput}
                  type="text"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                />
              </div>

              <button type="submit" className={styles.saveButton}>
                Save
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
