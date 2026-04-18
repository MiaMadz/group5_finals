'use client'
import { useDispatch, useSelector } from 'react-redux'
import { toggleFavorite } from '../rtk/favoritesSlice'

export default function BreweryCard({ brewery }) {
    const dispatch = useDispatch()
    const isFavorited = useSelector(state =>
        state.favorites.items.some(b => b.id === brewery.id)
    )

    return (
        <li style={{ border: '1px solid #ddd', padding: '12px', marginBottom: '8px', borderRadius: '4px' }}>
            <strong>{brewery.name}</strong>
            <span style={{ marginLeft: '8px', color: '#666', fontSize: '0.85em' }}>({brewery.brewery_type})</span>
            <p style={{ margin: '4px 0' }}>{brewery.city}, {brewery.state_province} · {brewery.country}</p>
            {brewery.website_url && (
                <a href={brewery.website_url} target="" rel="">Website</a>
            )}
            <div style={{ marginTop: '8px' }}>
                <button onClick={() => dispatch(toggleFavorite(brewery))}>
                    {isFavorited ? '★ Unfavorite' : '☆ Favorite'}
                </button>
            </div>
        </li>
    )
}