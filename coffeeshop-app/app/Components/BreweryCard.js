'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toggleFavorite } from '../rtk/favoritesSlice'

const ratingSummaryCache = new Map();

export default function BreweryCard({ brewery, onSelect }) {
    const [ratingSummary, setRatingSummary] = useState(() => ratingSummaryCache.get(brewery?.id) || null)
    const dispatch = useDispatch()
    const isFavorited = useSelector(state =>
        state.favorites.items.some(b => b.id === brewery.id)
    )

    const address = brewery.street || brewery.address || ''
    const city = brewery.city || ''
    const state = brewery.state_province || ''
    const postalCode = brewery.postal_code || ''
    const cityState = [city, state].filter(Boolean).join(', ')
    const displayAddress = address || cityState

    const directionsUrl = brewery.latitude && brewery.longitude
        ? `https://www.google.com/maps/search/?api=1&query=${brewery.latitude},${brewery.longitude}`
        : `https://www.google.com/maps/search/${encodeURIComponent(displayAddress || brewery.name)}`

    const fullAddress = [address, city, state, postalCode].filter(Boolean).join(', ')

    useEffect(() => {
        if (!brewery?.id) return
        if (ratingSummaryCache.has(brewery.id)) {
            setRatingSummary(ratingSummaryCache.get(brewery.id))
            return
        }

        const controller = new AbortController()
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

        fetch(`${API_URL}/api/reviews/cafe/${brewery.id}/summary`, { signal: controller.signal })
            .then((res) => res.ok ? res.json() : null)
            .then((data) => {
                if (!data?.summary) return
                ratingSummaryCache.set(brewery.id, data.summary)
                setRatingSummary(data.summary)
            })
            .catch((err) => {
                if (err.name !== 'AbortError') {
                    console.error('Unable to load review summary:', err)
                }
            })

        return () => controller.abort()
    }, [brewery?.id])

    return (
        <li className="brewery-card" onClick={onSelect} style={{ cursor: onSelect ? 'pointer' : 'default' }}>
            <div className="brewery-card__header">
                <div>
                    <h3>{brewery.name}</h3>
                    <div className="brewery-type-row">
                        <span className="brewery-type-pill">{brewery.brewery_type || 'Unknown'}</span>
                        {ratingSummary && (
                            <span className="brewery-rating" title={`${ratingSummary.average > 0 ? ratingSummary.average.toFixed(1) : '0.0'} average rating`}>
                                <span className="brewery-rating-value">{ratingSummary.average > 0 ? ratingSummary.average.toFixed(1) : '0.0'}</span>
                            </span>
                        )}
                    </div>
                </div>
                <button
                    type="button"
                    className={`favorite-toggle ${isFavorited ? 'active' : ''}`}
                    onClick={(e) => {
                        e.stopPropagation()
                        dispatch(toggleFavorite(brewery))
                    }}
                    aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
                >
                    <span className="heart-icon">{isFavorited ? '♥' : '♡'}</span>
                </button>
            </div>

            <p className="brewery-address">
                <span className="location-icon" aria-hidden="true">
                    <svg width="18" height="24" viewBox="0 0 18 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 0C4.03 0 0 4.03 0 9C0 15.75 9 24 9 24C9 24 18 15.75 18 9C18 4.03 13.97 0 9 0ZM9 12.6C7.16 12.6 5.7 11.14 5.7 9.3C5.7 7.46 7.16 6 9 6C10.84 6 12.3 7.46 12.3 9.3C12.3 11.14 10.84 12.6 9 12.6Z" fill="#FBC02D"/>
                    </svg>
                </span>
                {fullAddress}
            </p>

            <div className="brewery-card__actions">
                {brewery.website_url && (
                    <a className="btn btn-secondary" href={brewery.website_url} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}>Website</a>
                )}
                <a className="btn btn-secondary" href={directionsUrl} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}>Directions</a>
                <Link href={`/Review?cafe_id=${brewery.id}`} onClick={(e) => e.stopPropagation()} className="btn btn-secondary">Reviews</Link>
            </div>
        </li>
    )
}