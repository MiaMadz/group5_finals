'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import styles from './ProfilePage.module.css';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const initialFormData = {
  shopName: '', address: '', city: '', stateProvince: '',
  postalCode: '', country: '', shopType: '', phone: '',
  websiteUrl: '', directionsUrl: '',
};

export default function ProfilePage() {
  const router = useRouter();
  const [activeView, setActiveView] = useState('profile');

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [province, setProvince] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [profileError, setProfileError] = useState('');
  const [profileSuccess, setProfileSuccess] = useState('');

  const [shops, setShops] = useState([]);
  const userShops = useSelector((state) => state.userShops?.items || []);
  const [shopsLoading, setShopsLoading] = useState(false);
  const [shopsError, setShopsError] = useState('');
  const [shopsSuccess, setShopsSuccess] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [editingShopId, setEditingShopId] = useState(null);
  const [formData, setFormData] = useState(initialFormData);
  const [confirmDeleteShop, setConfirmDeleteShop] = useState(null);
  const [logoutConfirm, setLogoutConfirm] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const currentUserStr = localStorage.getItem('currentUser');
        if (!currentUserStr) { router.push('/Login'); return; }
        const currentUser = JSON.parse(currentUserStr);
        const userId = currentUser.id || currentUser._id;
        const response = await fetch(`${API_URL}/api/users/${userId}`);
        if (!response.ok) throw new Error('Failed to fetch user profile');
        const data = await response.json();
        setUser(data);
        setAddress(data.address || '');
        setCity(data.city || '');
        setCountry(data.country || '');
        setProvince(data.state_province || '');
        setPostalCode(data.postal_code || '');
      } catch (err) {
        setProfileError('Failed to load profile');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUserProfile();
  }, [router]);

  const loadShops = async (userId) => {
    setShopsLoading(true);
    setShopsError('');
    try {
      const response = await fetch(`${API_URL}/api/cafes?added_by=${encodeURIComponent(userId)}&is_user_shop=1&limit=100`);
      if (!response.ok) throw new Error('Failed to load your shops');
      const data = await response.json();
      setShops(data);
    } catch (err) {
      console.error(err);
      setShopsError('Unable to fetch your shops. Please try again.');
    } finally {
      setShopsLoading(false);
    }
  };

  useEffect(() => {
    if (activeView === 'shops' && user) {
      const currentUserStr = localStorage.getItem('currentUser');
      const currentUser = JSON.parse(currentUserStr);
      const userId = currentUser.id || currentUser._id;
      loadShops(userId);
    }
  }, [activeView, user]);

  const displayedShops = useMemo(() => {
    const seen = new Map();
    shops.forEach((shop) => {
      seen.set(String(shop.id), shop);
    });
    userShops.forEach((shop) => {
      const key = String(shop.id);
      if (!seen.has(key)) {
        seen.set(key, shop);
      }
    });
    return Array.from(seen.values());
  }, [shops, userShops]);

  const handleSave = async (e) => {
    e.preventDefault();
    setProfileError('');
    setProfileSuccess('');
    try {
      const currentUserStr = localStorage.getItem('currentUser');
      const currentUser = JSON.parse(currentUserStr);
      const userId = currentUser.id || currentUser._id;
      const response = await fetch(`${API_URL}/api/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address, city, country, state_province: province, postal_code: postalCode }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || 'Failed to update profile');
      if (data.user) {
        setUser(data.user);
        setAddress(data.user.address || '');
        setCity(data.user.city || '');
        setCountry(data.user.country || '');
        setProvince(data.user.state_province || '');
        setPostalCode(data.user.postal_code || '');
        localStorage.setItem('currentUser', JSON.stringify({ id: data.user.id, name: data.user.name, email: data.user.email }));
      }
      setProfileSuccess('Profile updated successfully!');
    } catch (err) {
      setProfileError('Unable to save changes. Please try again later.');
      console.error(err);
    }
  };

  const handleEditClick = (shop) => {
    setShopsError('');
    setShopsSuccess('');
    setEditingShopId(shop.id);
    setFormData({
      shopName: shop.name || '',
      address: shop.address || '',
      city: shop.city || '',
      stateProvince: shop.state_province || '',
      postalCode: shop.postal_code || '',
      country: shop.country || '',
      shopType: shop.brewery_type || '',
      phone: shop.phone || '',
      websiteUrl: shop.website_url || '',
      directionsUrl: shop.directions_url || '',
    });
  };

  const handleCancelEdit = () => {
    setEditingShopId(null);
    setFormData(initialFormData);
    setShopsError('');
    setShopsSuccess('');
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setShopsError('');
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    setShopsError('');
    setShopsSuccess('');

    if (!editingShopId) { setShopsError('Select a shop to edit first.'); return; }
    if (!formData.shopName.trim()) { setShopsError('Shop name is required'); return; }
    if (!formData.address.trim()) { setShopsError('Address is required'); return; }
    if (!formData.city.trim()) { setShopsError('City is required'); return; }
    if (!formData.stateProvince.trim()) { setShopsError('Province/State is required'); return; }
    if (!formData.postalCode.trim()) { setShopsError('Postal Code is required'); return; }
    if (!formData.country.trim()) { setShopsError('Country is required'); return; }
    if (!formData.shopType) { setShopsError('Shop type is required'); return; }
    if (!formData.phone.trim()) { setShopsError('Business phone number is required'); return; }

    setIsSaving(true);
    try {
      const shopId = String(editingShopId);
      if (!shopId || Number.isNaN(Number(shopId))) {
        throw new Error('Unable to edit this shop because it does not have a valid server ID.');
      }
      const payload = {
        name: formData.shopName.trim(),
        address: formData.address.trim(),
        city: formData.city.trim(),
        state_province: formData.stateProvince.trim(),
        postal_code: formData.postalCode.trim(),
        country: formData.country.trim(),
        brewery_type: formData.shopType,
        phone: formData.phone.trim(),
        website_url: formData.websiteUrl.trim(),
        directions_url: formData.directionsUrl.trim(),
        is_user_shop: 1,
      };

      console.log(`PUT /api/cafes/${shopId}`, payload);

      const response = await fetch(`${API_URL}/api/cafes/${shopId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const responseText = await response.text();
      console.log('Response status:', response.status, '| Body:', responseText);

      let data = {};
      try { data = JSON.parse(responseText); } catch {}

      if (!response.ok) throw new Error(data.error || `Server error ${response.status}`);

      setShopsSuccess('Shop updated successfully.');
      const currentUserStr = localStorage.getItem('currentUser');
      const currentUser = JSON.parse(currentUserStr);
      await loadShops(currentUser.id || currentUser._id);
      handleCancelEdit();
    } catch (err) {
      console.error('Save edit error:', err);
      setShopsError(err.message || 'Unable to save shop changes.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!confirmDeleteShop) return;
    setIsSaving(true);
    setShopsError('');
    try {
      const shopId = String(confirmDeleteShop.id);
      if (!shopId || Number.isNaN(Number(shopId))) {
        throw new Error('Unable to delete this shop because it does not have a valid server ID.');
      }
      const response = await fetch(`${API_URL}/api/cafes/${shopId}`, { method: 'DELETE' });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || 'Unable to delete shop');
      setShopsSuccess(`Deleted shop "${confirmDeleteShop.name}".`);
      setConfirmDeleteShop(null);
      const currentUserStr = localStorage.getItem('currentUser');
      const currentUser = JSON.parse(currentUserStr);
      await loadShops(currentUser.id || currentUser._id);
      if (String(editingShopId) === String(confirmDeleteShop.id)) handleCancelEdit();
    } catch (err) {
      console.error(err);
      setShopsError(err.message || 'Unable to delete shop.');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return <div className={styles.profilePage}><div>Loading...</div></div>;
  if (!user) return <div className={styles.profilePage}><div>User not found</div></div>;

  return (
    <main className={styles.profilePage}>
      <section className={styles.profileContent}>
        <div className={styles.profileCard}>

          <div className={styles.sidebar}>
            <button
              className={`${styles.sidebarItem} ${activeView === 'profile' ? styles.sidebarItemActive : ''}`}
              onClick={() => setActiveView('profile')}
            >
              Profile
            </button>
            <button
              className={`${styles.sidebarItem} ${activeView === 'shops' ? styles.sidebarItemActive : ''}`}
              onClick={() => setActiveView('shops')}
            >
              Manage Shops
            </button>
            <button
              className={`${styles.sidebarItem} ${styles.logout} ${activeView === 'logout' ? styles.sidebarItemActive : ''}`}
              onClick={() => setActiveView('logout')}
            >
              Logout
            </button>
          </div>

          <div className={styles.profileMain}>

            {activeView === 'profile' && (
              <>
                <div className={styles.profileHeader}>
                  <h2 className={styles.profileName}>{user.name}</h2>
                  <p className={styles.profileEmail}>{user.email}</p>
                </div>
                <form className={styles.profileForm} onSubmit={handleSave}>
                  <h3 className={styles.formTitle}>User Address</h3>
                  {profileError && <div className={styles.errorMessage}>{profileError}</div>}
                  {profileSuccess && <div className={styles.successMessage}>{profileSuccess}</div>}
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Address</label>
                    <input className={styles.formInput} type="text" value={address} onChange={(e) => setAddress(e.target.value)} />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Country</label>
                    <input className={styles.formInput} type="text" value={country} onChange={(e) => setCountry(e.target.value)} />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Province/State</label>
                    <input className={styles.formInput} type="text" value={province} onChange={(e) => setProvince(e.target.value)} />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>City</label>
                    <input className={styles.formInput} type="text" value={city} onChange={(e) => setCity(e.target.value)} />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Postal Code</label>
                    <input className={styles.formInput} type="text" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} />
                  </div>
                  <button type="submit" className={styles.saveButton}>Save</button>
                </form>
              </>
            )}

            {activeView === 'logout' && (
              <div className={styles.logoutView}>
                <div className={styles.profileHeader}>
                  <h2 className={styles.profileName}>Logout & Account</h2>
                  <p className={styles.profileEmail}>Manage your session and account settings.</p>
                </div>
                <div className={styles.logoutActions}>
                  <div className={styles.actionGroup}>
                    <h3 className={styles.actionTitle}>Logout</h3>
                    <p className={styles.actionDesc}>End your current session.</p>
                    <button 
                      type="button" 
                      className={styles.logoutButton}
                      onClick={async () => {
                        localStorage.removeItem('currentUser');
                        router.push('/Login');
                      }}
                    >
                      Logout
                    </button>
                  </div>
                  <div className={styles.actionGroup} style={{ borderTop: '1px solid rgba(255, 107, 107, 0.2)', paddingTop: '24px' }}>
                    <h3 className={styles.actionTitle} style={{ color: '#FF8787' }}>Delete Account</h3>
                    <p className={styles.actionDesc}>Permanently delete your account and all associated data. This cannot be undone.</p>
                    <button 
                      type="button" 
                      className={styles.deleteButton}
                      onClick={() => setLogoutConfirm(true)}
                    >
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeView === 'shops' && (
              <>
                <div className={styles.profileHeader}>
                  <h2 className={styles.profileName}>Manage Shops</h2>
                  <p className={styles.profileEmail}>Edit or remove your uploaded coffee shops.</p>
                </div>

                {shopsError && <div className={styles.errorMessage} style={{ marginBottom: '1rem' }}>{shopsError}</div>}
                {shopsSuccess && <div className={styles.successMessage} style={{ marginBottom: '1rem' }}>{shopsSuccess}</div>}

                <div className={styles.shopsLayout}>
                  {/* Shop list */}
                  <div className={styles.shopList}>
                    <div className={styles.shopListHeader}>
                      <span className={styles.shopCount}>{displayedShops.length} shop{displayedShops.length !== 1 ? 's' : ''}</span>
                      <button type="button" className={styles.addShopBtn} onClick={() => router.push('/AddShop')}>
                        + Add New
                      </button>
                    </div>

                    {shopsLoading ? (
                      <p className={styles.shopEmpty}>Loading your shops…</p>
                    ) : displayedShops.length === 0 ? (
                      <p className={styles.shopEmpty}>No shops yet. Add one to get started.</p>
                    ) : (
                      <div className={styles.shopScrollList}>
                        {displayedShops.map((shop) => (
                          <div
                            key={shop.id}
                            className={`${styles.shopItem} ${String(editingShopId) === String(shop.id) ? styles.shopItemActive : ''}`}
                          >
                            <div className={styles.shopItemInfo}>
                              <p className={styles.shopItemType}>{shop.brewery_type || 'Coffee Shop'}</p>
                              <p className={styles.shopItemName}>{shop.name}</p>
                              <p className={styles.shopItemAddress}>{shop.city}, {shop.state_province}</p>
                            </div>
                            <div className={styles.shopItemActions}>
                              <button type="button" className={styles.editBtn} onClick={() => handleEditClick(shop)}>Edit</button>
                              <button type="button" className={styles.deleteBtn} onClick={() => { setConfirmDeleteShop(shop); setShopsError(''); setShopsSuccess(''); }}>Delete</button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className={styles.shopEditPanel}>
                    <h3 className={styles.formTitle}>{editingShopId ? 'Edit shop' : 'Select a shop to edit'}</h3>
                    {!editingShopId ? (
                      <p style={{ color: '#999', fontSize: '13px' }}>Click Edit on any shop from the list to update its details here.</p>
                    ) : (
                      <form onSubmit={handleSaveEdit} className={styles.profileForm}>
                        {[
                          { label: 'Shop Name *', name: 'shopName', placeholder: 'Shop name' },
                          { label: 'Address *', name: 'address', placeholder: 'Street address' },
                          { label: 'City *', name: 'city', placeholder: 'City' },
                          { label: 'Province/State *', name: 'stateProvince', placeholder: 'Province or state' },
                          { label: 'Postal Code *', name: 'postalCode', placeholder: 'Postal code' },
                          { label: 'Country *', name: 'country', placeholder: 'Country' },
                          { label: 'Phone *', name: 'phone', placeholder: 'Business phone' },
                          { label: 'Website', name: 'websiteUrl', placeholder: 'https://yourshop.com' },
                          { label: 'Directions URL', name: 'directionsUrl', placeholder: 'Google Maps link' },
                        ].map(({ label, name, placeholder }) => (
                          <div className={styles.formGroup} key={name}>
                            <label className={styles.formLabel}>{label}</label>
                            <input
                              className={styles.formInput}
                              name={name}
                              value={formData[name]}
                              onChange={handleFormChange}
                              placeholder={placeholder}
                              disabled={isSaving}
                            />
                          </div>
                        ))}
                        <div className={styles.formGroup}>
                          <label className={styles.formLabel}>Shop Type *</label>
                          <select
                            name="shopType"
                            value={formData.shopType}
                            onChange={handleFormChange}
                            className={styles.formInput}
                            disabled={isSaving}
                          >
                            <option value="">Select type</option>
                            {['micro','nano','regional','brewpub','large','planning','taproom','contract','proprietor'].map((t) => (
                              <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                            ))}
                          </select>
                        </div>
                        <div className={styles.shopEditActions}>
                          <button type="button" className={styles.cancelBtn} onClick={handleCancelEdit} disabled={isSaving}>Cancel</button>
                          <button type="submit" className={styles.saveButton} disabled={isSaving}>
                            {isSaving ? 'Saving…' : 'Save Changes'}
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {logoutConfirm && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalBox}>
            <h2 className={styles.profileName} style={{ fontSize: '20px', color: '#FF8787' }}>Delete Account</h2>
            <p style={{ marginTop: '12px', fontSize: '14px', color: '#ccc', lineHeight: 1.6 }}>
              Are you sure you want to <strong>permanently delete</strong> your account? This action cannot be undone and will remove all your data.
            </p>
            <div className={styles.modalActions}>
              <button className={styles.cancelBtn} onClick={() => setLogoutConfirm(false)}>Cancel</button>
              <button 
                className={`${styles.saveButton} ${styles.deleteConfirmBtn}`}
                onClick={async () => {
                  const currentUserStr = localStorage.getItem('currentUser');
                  if (!currentUserStr) { router.push('/Login'); return; }
                  const currentUser = JSON.parse(currentUserStr);
                  const userId = currentUser.id || currentUser._id;
                  try {
                    const res = await fetch(`${API_URL}/api/users/${userId}`, { method: 'DELETE' });
                    if (!res.ok) { const data = await res.json().catch(() => ({})); alert(data.error || 'Failed to delete account'); return; }
                    localStorage.removeItem('currentUser');
                    router.push('/Login');
                  } catch (error) {
                    console.error(error);
                    alert('Unable to delete account. Please try again.');
                  }
                }}
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmDeleteShop && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalBox}>
            <h2 className={styles.profileName} style={{ fontSize: '20px' }}>Confirm deletion</h2>
            <p style={{ marginTop: '12px', fontSize: '14px', color: '#ccc', lineHeight: 1.6 }}>
              Are you sure you want to permanently delete <strong>{confirmDeleteShop.name}</strong>? This cannot be undone.
            </p>
            <div className={styles.modalActions}>
              <button className={styles.cancelBtn} onClick={() => setConfirmDeleteShop(null)}>Cancel</button>
              <button className={`${styles.saveButton} ${styles.deleteConfirmBtn}`} onClick={handleConfirmDelete} disabled={isSaving}>
                {isSaving ? 'Deleting…' : 'Delete shop'}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}