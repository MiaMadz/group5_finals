'use client'
import { useDispatch, useSelector } from 'react-redux'
import { toggleFavorite } from '../rtk/favoritesSlice'

export default function BreweryCard({ brewery }) {
    const dispatch = useDispatch()
    const isFavorited = useSelector(state =>
        state.favorites.items.some(b => b.id === brewery.id)
    )

    const address = [brewery.street, brewery.city, brewery.state_province]
        .filter(Boolean)
        .join(', ')

    const directionsUrl = brewery.latitude && brewery.longitude
        ? `https://www.google.com/maps/search/?api=1&query=${brewery.latitude},${brewery.longitude}`
        : `https://www.google.com/maps/search/${encodeURIComponent(address)}`

    return (
        <li className="brewery-card">
            <div className="brewery-card__header">
                <div>
                    <h3>{brewery.name}</h3>
                    <span className="brewery-type-pill">{brewery.brewery_type || 'Unknown'}</span>
                </div>
                <button
                    type="button"
                    className={`favorite-toggle ${isFavorited ? 'active' : ''}`}
                    onClick={() => dispatch(toggleFavorite(brewery))}
                    aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
                >
                    <span className="heart-icon">{isFavorited ? '♥' : '♡'}</span>
                </button>
            </div>

            <p className="brewery-address">
                <span className="location-icon">📍</span>
                {address || `${brewery.city}, ${brewery.state_province}`}
            </p>

            <div className="brewery-card__actions">
                {brewery.website_url && (
                    <a className="btn btn-secondary" href={brewery.website_url} target="_blank" rel="noreferrer">Website</a>
                )}
                <a className="btn btn-secondary" href={directionsUrl} target="_blank" rel="noreferrer">Directions</a>
            </div>
        </li>
    )
}