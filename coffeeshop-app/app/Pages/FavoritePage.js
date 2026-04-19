'use client'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import dynamic from 'next/dynamic'
import BreweryCard from '../Components/BreweryCard'
import 'leaflet/dist/leaflet.css'

const BreweryMap = dynamic(() => import('../Components/BreweryMap'), { ssr: false })

export default function FavoritePage() {
  const [selectedLocation, setSelectedLocation] = useState(null)
  const favorites = useSelector((state) => state.favorites.items || [])

  const mappableFavorites = favorites.filter((brewery) => brewery.latitude && brewery.longitude)

  const handleSelectBrewery = (brewery) => {
    if (brewery?.latitude && brewery?.longitude) {
      setSelectedLocation({
        latitude: parseFloat(brewery.latitude),
        longitude: parseFloat(brewery.longitude),
      })
    }
  }

  return (
    <div className="explore-page favorite-page">
      <div className="explore-header favorite-header">
        <div>
          <h1>Your Favorites</h1>
          <p className="subtitle">Only saved breweries appear here, with a map and list layout like Explore.</p>
        </div>
        <div className="explore-header__actions favorites-count">
          <span className="favorites-label">Saved:</span>
          <span className="favorites-number">{favorites.length}</span>
        </div>
      </div>

      <div className="explore-layout">
        <aside className="map-panel">
          <div className="panel-card panel-card--map">
            {mappableFavorites.length > 0 ? (
              <BreweryMap breweries={mappableFavorites} selectedBrewery={selectedLocation} />
            ) : (
              <div className="empty-state">No favorite brewery locations available for the map.</div>
            )}
          </div>
        </aside>

        <main className="list-panel">
          <div className="panel-card panel-card--list">
            <div className="panel-meta">
              <div>
                <h2>Favorite breweries</h2>
              </div>
              <p className="meta-copy">{favorites.length} saved locations</p>
            </div>

            {favorites.length === 0 ? (
              <div className="empty-state">No favorites yet. Add some from the Explore page.</div>
            ) : (
              <div className="brewery-list-wrapper">
                <ul className="brewery-list">
                  {favorites.map((brewery) => (
                    <BreweryCard
                      key={brewery.id}
                      brewery={brewery}
                      onSelect={() => handleSelectBrewery(brewery)}
                    />
                  ))}
                </ul>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}