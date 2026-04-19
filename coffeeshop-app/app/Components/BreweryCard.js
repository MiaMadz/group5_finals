'use client'
import { useDispatch, useSelector } from 'react-redux'
import { toggleFavorite } from '../rtk/favoritesSlice'

export default function BreweryCard({ brewery, onSelect }) {
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
        <li className="brewery-card" onClick={onSelect} style={{ cursor: onSelect ? 'pointer' : 'default' }}>
            <div className="brewery-card__header">
                <div>
                    <h3>{brewery.name}</h3>
                    <span className="brewery-type-pill">{brewery.brewery_type || 'Unknown'}</span>
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
                {address || `${brewery.city}, ${brewery.state_province}`}
            </p>

            <div className="brewery-card__actions">
                {brewery.website_url && (
                    <a className="btn btn-secondary" href={brewery.website_url} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}>Website</a>
                )}
                <a className="btn btn-secondary" href={directionsUrl} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}>Directions</a>
            </div>
        </li>
    )
}