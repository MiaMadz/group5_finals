'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Star, MapPin, Globe, Tag } from 'lucide-react';
import styles from './ReviewPage.module.css';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const CAFE_ID  = process.env.NEXT_PUBLIC_CAFE_ID  || '1';

const defaultSummary = {
    total: 0,
    average: 0,
    breakdown: [
        { label: '5', count: 0, percentage: '0%' },
        { label: '4', count: 0, percentage: '0%' },
        { label: '3', count: 0, percentage: '0%' },
        { label: '2', count: 0, percentage: '0%' },
        { label: '1', count: 0, percentage: '0%' },
    ],
};

export default function ReviewPage() {
    const [summary, setSummary]             = useState(defaultSummary);
    const [reviews, setReviews]             = useState([]);
    const [cafeDetails, setCafeDetails]     = useState(null);
    const [loadingPage, setLoadingPage]     = useState(true);
    const [loadingCafe, setLoadingCafe]     = useState(true);
    const [submitting, setSubmitting]       = useState(false);
    const [submitError, setSubmitError]     = useState('');
    const [submitSuccess, setSubmitSuccess] = useState('');
    const [cafeId, setCafeId]               = useState(null);
    const [currentUser, setCurrentUser]     = useState(null);

    const [formData, setFormData]           = useState({ rating: 0, review: '' });
    const [hoveredRating, setHoveredRating] = useState(0);

    // ── fetch summary + reviews ───────────────────────────────────────────────
    const fetchData = useCallback(async () => {
        if (!cafeId) return;
        console.log('=== fetchData called with cafeId:', cafeId);
        setLoadingPage(true);
        setSummary(defaultSummary);
        setReviews([]);
        try {
            const [summaryRes, reviewsRes] = await Promise.all([
                fetch(`${API_BASE}/api/reviews/cafe/${cafeId}/summary`),
                fetch(`${API_BASE}/api/reviews/cafe/${cafeId}`),
            ]);
            console.log('summary status:', summaryRes.status); // add this
            console.log('reviews status:', reviewsRes.status);
            if (summaryRes.ok) {
                const summaryJson = await summaryRes.json();
                console.log('summary response:', summaryJson);
                setSummary(summaryJson.summary);
            }
            if (reviewsRes.ok) {
                const reviewsData = await reviewsRes.json();
                console.log('reviews response:', reviewsData);
                const reviewsList = Array.isArray(reviewsData) ? reviewsData : reviewsData.reviews || [];
                setReviews(reviewsList);
            }
        } catch (err) {
            console.error('Failed to load review data:', err);
        } finally {
            setLoadingPage(false);
        }
    }, [cafeId]);

    // ── fetch cafe details ────────────────────────────────────────────────────
    const fetchCafeDetails = useCallback(async () => {
        if (!cafeId) return;
        setLoadingCafe(true);
        try {
            const res = await fetch(`${API_BASE}/api/cafes/${cafeId}`);
            if (res.ok) {
                const data = await res.json();
                setCafeDetails(data);
            }
        } catch (err) {
            console.error('Failed to load cafe details:', err);
        } finally {
            setLoadingCafe(false);
        }
    }, [cafeId]);

    // ── bootstrap: read URL params + localStorage ─────────────────────────────
    useEffect(() => {
        if (typeof window === 'undefined') return;
        const params    = new URLSearchParams(window.location.search);
        const urlCafeId = params.get('cafe_id') || params.get('cafeId') || params.get('id');
        console.log('=== URL params:', window.location.search); // add this
        console.log('=== cafeId set to:', urlCafeId || CAFE_ID); // add this
        setCafeId(urlCafeId || CAFE_ID);

        const storedUser = window.localStorage.getItem('currentUser');
        if (storedUser) {
            try { setCurrentUser(JSON.parse(storedUser)); }
            catch (e) { console.error('Unable to parse currentUser:', e); }
        }
    }, []);

    useEffect(() => { fetchData(); },        [fetchData]);
    useEffect(() => { fetchCafeDetails(); }, [fetchCafeDetails]);

    // ── submit ────────────────────────────────────────────────────────────────
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitError('');
        setSubmitSuccess('');

        if (formData.rating === 0) { setSubmitError('Please select a star rating!'); return; }
        if (!currentUser)          { setSubmitError('You must be logged in to submit a review.'); return; }

        const userId  = currentUser.id || currentUser._id;
        const payload = { user_id: userId, cafe_id: cafeId, stars: formData.rating, review_text: formData.review };

        setSubmitting(true);
        try {
            const res          = await fetch(`${API_BASE}/api/reviews`, {
                method:  'POST',
                headers: { 'Content-Type': 'application/json' },
                body:    JSON.stringify(payload),
            });
            const responseText = await res.text();
            let data = {};
            try { data = responseText ? JSON.parse(responseText) : {}; }
            catch (e) { console.error('Failed to parse response:', e); }

            if (!res.ok) {
                setSubmitError(data.error || data.message || `Request failed with status ${res.status}`);
            } else {
                setSubmitSuccess('Thank you! Your review has been submitted.');
                setFormData({ rating: 0, review: '' });
                await fetchData();
            }
        } catch (err) {
            setSubmitError('Network error. Please check your connection.');
        } finally {
            setSubmitting(false);
        }
    };

    const formatDate = (dateStr) =>
        new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

    const renderStars = (count, size = 'w-4 h-4') =>
        [...Array(5)].map((_, i) => (
            <Star key={i} className={`${size} transition-colors ${i < count ? 'fill-[#e8a44a] text-[#e8a44a]' : 'text-stone-700'}`} />
        ));

    return (
        <div className={styles.container}>
            <div className={styles.inner}>

                {/* ── Cafe Header ─────────────────────────────────────────── */}
                {loadingCafe ? (
                    <div className={styles.cafeHeaderSkeleton}>Loading cafe details…</div>
                ) : cafeDetails ? (
                    <div className={styles.cafeHeader}>
                        <div className={styles.cafeHeaderTop}>
                            {cafeDetails.brewery_type && (
                                <span className={styles.cafeBadge}>
                                    <Tag size={11} />
                                    {cafeDetails.brewery_type}
                                </span>
                            )}
                        </div>

                        <h1 className={styles.cafeName}>{cafeDetails.name}</h1>

                        <div className={styles.cafeMetas}>
                            {(cafeDetails.city || cafeDetails.state_province || cafeDetails.country) && (
                                <span className={styles.cafeMeta}>
                                    <MapPin size={13} />
                                    {[cafeDetails.address, cafeDetails.city, cafeDetails.state_province, cafeDetails.country]
                                        .filter(Boolean).join(', ')}
                                </span>
                            )}
                            {cafeDetails.phone && (
                                <span className={styles.cafeMeta}>
                                    📞 {cafeDetails.phone}
                                </span>
                            )}
                            {cafeDetails.website_url && (
                                <a href={cafeDetails.website_url} target="_blank" rel="noopener noreferrer" className={styles.cafeWebsite}>
                                    <Globe size={13} />
                                    {cafeDetails.website_url}
                                </a>
                            )}
                        </div>

                        {/* inline overall rating strip */}
                        <div className={styles.cafeRatingStrip}>
                            <span className={styles.cafeRatingNum}>
                                {summary.average > 0 ? summary.average.toFixed(1) : '—'}
                            </span>
                            <div className={styles.cafeRatingStars}>
                                {renderStars(Math.round(summary.average), 'w-4 h-4')}
                            </div>
                            <span className={styles.cafeRatingCount}>
                                {summary.total} {summary.total === 1 ? 'review' : 'reviews'}
                            </span>
                        </div>
                    </div>
                ) : null}

                {/* ── Rating Summary ──────────────────────────────────────── */}
                <div className={styles.summaryGrid}>
                    <div className={styles.summaryStats}>
                        {summary.breakdown.map((row) => (
                            <div key={row.label} className={styles.statRow}>
                                <span className={styles.statLabel}>{row.label}</span>
                                <Star className="w-4 h-4 text-stone-700 flex-shrink-0" />
                                <div className={styles.statBar}>
                                    <div className={styles.statBarFill} style={{ width: row.percentage }} />
                                </div>
                                <span className={styles.statCount}>{row.count}</span>
                            </div>
                        ))}
                    </div>

                    <div className={styles.summaryCard}>
                        <h1 className={styles.averageScore}>
                            {summary.average > 0 ? summary.average.toFixed(1) : '0.0'}
                        </h1>
                        <div className={styles.reviewStars}>
                            {renderStars(Math.round(summary.average), 'w-5 h-5')}
                        </div>
                        <p className={styles.ratingText}>
                            {summary.total} {summary.total === 1 ? 'Rating' : 'Ratings'}
                        </p>
                    </div>
                </div>

                {/* ── Review Form ─────────────────────────────────────────── */}
                <div className={styles.formSection}>
                    <h2 className={styles.formTitle}>Add a Review</h2>
                    <form onSubmit={handleSubmit} className={styles.form}>
                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>
                                Your Rating <span className="text-red-400">*</span>
                            </label>
                            <div className={styles.ratingButtons}>
                                {[...Array(5)].map((_, i) => {
                                    const val = i + 1;
                                    return (
                                        <button
                                            type="button"
                                            key={i}
                                            className={styles.starButton}
                                            onClick={() => setFormData({ ...formData, rating: val })}
                                            onMouseEnter={() => setHoveredRating(val)}
                                            onMouseLeave={() => setHoveredRating(0)}
                                        >
                                            <Star className={`w-6 h-6 transition-colors ${
                                                val <= (hoveredRating || formData.rating)
                                                    ? 'fill-[#e8a44a] text-[#e8a44a]'
                                                    : 'text-stone-700'
                                            }`} />
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>
                                Your Review <span className="text-red-400">*</span>
                            </label>
                            <textarea
                                required
                                rows={4}
                                placeholder="Write here…"
                                value={formData.review}
                                onChange={(e) => setFormData({ ...formData, review: e.target.value })}
                                className={styles.textarea}
                            />
                        </div>

                        {!currentUser  && <p className={styles.loginPrompt}>You must be logged in to submit a review.</p>}
                        {submitError   && <p className={styles.errorMessage}>{submitError}</p>}
                        {submitSuccess && <p className={styles.successMessage}>{submitSuccess}</p>}

                        <button
                            type="submit"
                            disabled={submitting || !currentUser || !formData.review.trim()}
                            className={styles.submitButton}
                        >
                            {submitting ? 'Submitting…' : 'Submit Review'}
                        </button>
                    </form>
                </div>

                {/* ── Existing Reviews ────────────────────────────────────── */}
                <div className={styles.reviewsSection}>
                    <h2 className={styles.reviewsTitle}>Customer Reviews</h2>
                    {loadingPage ? (
                        <p className={styles.loadingState}>Loading reviews…</p>
                    ) : reviews.length === 0 ? (
                        <p className={styles.emptyState}>No reviews yet. Be the first!</p>
                    ) : (
                        <ul className={styles.reviewsList}>
                            {reviews.map((r) => (
                                <li key={r.id} className={styles.reviewItem}>
                                    <div className={styles.reviewHeader}>
                                        <div>
                                            <p className={styles.reviewAuthor}>{r.user_name || 'Anonymous'}</p>
                                            <p className={styles.reviewDate}>{formatDate(r.created_at)}</p>
                                        </div>
                                        <div className={styles.reviewStars}>
                                            {renderStars(r.stars)}
                                        </div>
                                    </div>
                                    {r.review_text && <p className={styles.reviewText}>{r.review_text}</p>}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

            </div>
        </div>
    );
}