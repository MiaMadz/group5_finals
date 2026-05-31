'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Star } from 'lucide-react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
const CAFE_ID  = process.env.NEXT_PUBLIC_CAFE_ID  || '1';
// ─────────────────────────────────────────────────────────────────────────────

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
    const [summary, setSummary]         = useState(defaultSummary);
    const [reviews, setReviews]         = useState([]);
    const [loadingPage, setLoadingPage] = useState(true);
    const [submitting, setSubmitting]   = useState(false);
    const [submitError, setSubmitError] = useState('');
    const [submitSuccess, setSubmitSuccess] = useState('');

    const [formData, setFormData] = useState({ rating: 0, name: '', email: '', review: '' });
    const [hoveredRating, setHoveredRating] = useState(0);

    const fetchData = useCallback(async () => {
        try {
            const [summaryRes, reviewsRes] = await Promise.all([
                fetch(`${API_BASE}/reviews/cafe/${CAFE_ID}/summary`),
                fetch(`${API_BASE}/reviews/cafe/${CAFE_ID}`),
            ]);

            if (summaryRes.ok) {
                const { summary } = await summaryRes.json();
                setSummary(summary);
            }

            if (reviewsRes.ok) {
                const { reviews } = await reviewsRes.json();
                setReviews(reviews);
            }
        } catch (err) {
            console.error('Failed to load review data:', err);
        } finally {
            setLoadingPage(false);
        }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitError('');
        setSubmitSuccess('');

        if (formData.rating === 0) {
            setSubmitError('Please select a star rating!');
            return;
        }

        setSubmitting(true);
        try {
            const res = await fetch(`${API_BASE}/reviews/add`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cafe_id: CAFE_ID, ...formData }),
            });

            const data = await res.json();

            if (!res.ok) {
                setSubmitError(data.error || 'Something went wrong. Please try again.');
            } else {
                setSubmitSuccess('Thank you! Your review has been submitted.');
                setFormData({ rating: 0, name: '', email: '', review: '' });
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
            <Star
                key={i}
                className={`${size} transition-colors ${i < count ? 'fill-[#e8a44a] text-[#e8a44a]' : 'text-stone-700'}`}
            />
        ));

    return (
        <div className="min-h-screen bg-[#1a0f0a] text-[#f5e6d3] px-6 py-12 md:py-20 font-sans relative overflow-hidden">

            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_20%,rgba(180,100,20,0.06)_0%,transparent_60%)] pointer-events-none" />

            <div className="max-w-6xl mx-auto relative z-10">

                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-16 items-center">

                    <div className="md:col-span-7 space-y-3.5">
                        {summary.breakdown.map((row) => (
                            <div key={row.label} className="flex items-center text-xs font-bold tracking-widest text-[#f5e6d3]/70">
                                <span className="w-14">{row.label}</span>
                                <Star className="w-4 h-4 text-stone-700 mx-2 flex-shrink-0" />
                                <div className="flex-1 bg-[#140b07] h-2 rounded-full mx-4 border border-white/[0.03] overflow-hidden">
                                    <div
                                        className="bg-[#e8a44a] h-full rounded-full transition-all duration-500"
                                        style={{ width: row.percentage }}
                                    />
                                </div>
                                <span className="w-10 text-right font-medium text-[#f5e6d3]/50">{row.count}</span>
                            </div>
                        ))}
                    </div>

                    <div className="md:col-span-5 bg-white/[0.02] border border-[#b46414]/20 rounded-2xl p-8 flex flex-col items-center justify-center text-center backdrop-blur-sm">
                        <h1 className="text-6xl font-black text-[#e8a44a] mb-1 tracking-tight">
                            {summary.average > 0 ? summary.average.toFixed(1) : '0.0'}
                        </h1>
                        <div className="flex space-x-1 mb-3">
                            {renderStars(Math.round(summary.average), 'w-5 h-5')}
                        </div>
                        <p className="text-[#f5e6d3]/50 text-xs font-bold tracking-widest uppercase">
                            {summary.total} {summary.total === 1 ? 'Rating' : 'Ratings'}
                        </p>
                    </div>

                </div>

                <div className="max-w-3xl mx-auto mb-16">
                    <h2 className="text-2xl font-extrabold text-[#f5e6d3] uppercase tracking-wider mb-6 text-center md:text-left">
                        Add a Review
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-5">

                        <div>
                            <label className="block text-xs font-bold text-[#f5e6d3]/70 tracking-widest uppercase mb-2">
                                Add Your Rating <span className="text-red-400">*</span>
                            </label>
                            <div className="flex space-x-1.5">
                                {[...Array(5)].map((_, i) => {
                                    const val = i + 1;
                                    return (
                                        <button
                                            type="button"
                                            key={i}
                                            onClick={() => setFormData({ ...formData, rating: val })}
                                            onMouseEnter={() => setHoveredRating(val)}
                                            onMouseLeave={() => setHoveredRating(0)}
                                            className="focus:outline-none transition-transform active:scale-90"
                                        >
                                            <Star
                                                className={`w-6 h-6 transition-colors ${
                                                    val <= (hoveredRating || formData.rating)
                                                        ? 'fill-[#e8a44a] text-[#e8a44a]'
                                                        : 'text-stone-700'
                                                }`}
                                            />
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-[#f5e6d3]/70 tracking-widest uppercase mb-1.5">
                                Name <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="text"
                                required
                                placeholder="Juan Dela Cruz"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full bg-[#140b07] px-4 py-3 text-sm border border-[#b46414]/20 rounded-lg text-[#f5e6d3] focus:outline-none focus:ring-1 focus:ring-[#e8a44a] focus:border-[#e8a44a] placeholder-stone-600 transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-[#f5e6d3]/70 tracking-widest uppercase mb-1.5">
                                Email <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="email"
                                required
                                placeholder="JuanDelaCruz@gmail.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full bg-[#140b07] px-4 py-3 text-sm border border-[#b46414]/20 rounded-lg text-[#f5e6d3] focus:outline-none focus:ring-1 focus:ring-[#e8a44a] focus:border-[#e8a44a] placeholder-stone-600 transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-[#f5e6d3]/70 tracking-widest uppercase mb-1.5">
                                Write Your Review <span className="text-red-400">*</span>
                            </label>
                            <textarea
                                required
                                rows={4}
                                placeholder="Write here..."
                                value={formData.review}
                                onChange={(e) => setFormData({ ...formData, review: e.target.value })}
                                className="w-full bg-[#140b07] px-4 py-3 text-sm border border-[#b46414]/20 rounded-lg text-[#f5e6d3] focus:outline-none focus:ring-1 focus:ring-[#e8a44a] focus:border-[#e8a44a] placeholder-stone-600 resize-none transition-all"
                            />
                        </div>

                        {submitError   && <p className="text-red-400 text-xs font-bold tracking-wide">{submitError}</p>}
                        {submitSuccess && <p className="text-green-400 text-xs font-bold tracking-wide">{submitSuccess}</p>}

                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full bg-transparent text-[#e8a44a] border border-[#e8a44a] hover:bg-[#e8a44a] hover:text-[#1a0f0a] disabled:opacity-50 disabled:cursor-not-allowed font-bold py-3.5 rounded-lg transition-all duration-200 text-xs tracking-widest uppercase shadow-sm active:translate-y-[1px]"
                        >
                            {submitting ? 'Submitting…' : 'Submit Review'}
                        </button>
                    </form>
                </div>

                <div className="max-w-3xl mx-auto">
                    <h2 className="text-2xl font-extrabold text-[#f5e6d3] uppercase tracking-wider mb-6 text-center md:text-left">
                        Customer Reviews
                    </h2>

                    {loadingPage ? (
                        <p className="text-[#f5e6d3]/40 text-sm tracking-widest text-center py-10">Loading reviews…</p>
                    ) : reviews.length === 0 ? (
                        <p className="text-[#f5e6d3]/40 text-sm tracking-widest text-center py-10">No reviews yet. Be the first!</p>
                    ) : (
                        <div className="space-y-5">
                            {reviews.map((r) => (
                                <div
                                    key={r.id}
                                    className="bg-white/[0.02] border border-[#b46414]/20 rounded-2xl p-6 backdrop-blur-sm"
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <p className="font-bold text-[#f5e6d3] text-sm tracking-wide">{r.name}</p>
                                            <p className="text-[#f5e6d3]/40 text-xs mt-0.5">{formatDate(r.created_at)}</p>
                                        </div>
                                        <div className="flex space-x-0.5">
                                            {renderStars(r.stars)}
                                        </div>
                                    </div>
                                    {r.review_text && (
                                        <p className="text-[#f5e6d3]/70 text-sm leading-relaxed">{r.review_text}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}