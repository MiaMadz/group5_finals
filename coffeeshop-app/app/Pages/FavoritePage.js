'use client'
import { useState, useMemo } from 'react'
import { useSelector } from 'react-redux'
import dynamic from 'next/dynamic'
import BreweryCard from '../Components/BreweryCard'
import Filters from '../Components/Filters' // Import your existing component
import Pagination from '../Components/Pagination'
import 'leaflet/dist/leaflet.css'

const BreweryMap = dynamic(() => import('../Components/BreweryMap'), { ssr: false })

export default function FavoritePage() {
    const [search, setSearch] = useState('')
    const [country, setCountry] = useState('')
    const [type, setType] = useState('')
    const [page, setPage] = useState(1)
    const [selectedLocation, setSelectedLocation] = useState(null)
    
    const favorites = useSelector((state) => state.favorites.items || [])

    // Handler to match ExplorePage's filter logic
    const PER_PAGE = 8

    const handleFilterChange = (setter) => (value) => {
        setter(value)
        setPage(1)
    }

    const filteredFavorites = useMemo(() => {
        return favorites.filter((brewery) => {
            const matchesSearch = brewery.name.toLowerCase().includes(search.toLowerCase()) ||
                                 (brewery.city && brewery.city.toLowerCase().includes(search.toLowerCase()))
            const matchesType = !type || type === 'all' || brewery.brewery_type === type
            const matchesCountry = !country || brewery.country === country
            return matchesSearch && matchesType && matchesCountry
        })
    }, [favorites, search, type, country])

    const mappableFavorites = useMemo(() => 
        filteredFavorites.filter((brewery) => brewery.latitude && brewery.longitude),
        [filteredFavorites]
    )

    const displayedFavorites = useMemo(() => {
        const start = (page - 1) * PER_PAGE
        return filteredFavorites.slice(start, start + PER_PAGE)
    }, [filteredFavorites, page])

    const totalPages = Math.max(1, Math.ceil(filteredFavorites.length / PER_PAGE))

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
                    <p className="subtitle">Search and filter through your saved breweries.</p>
                </div>
                <div className="explore-header__actions">
                    <div className="favorites-count">
                        <span className="favorites-label">Saved:</span>
                        <span className="favorites-number">{favorites.length}</span>
                    </div>
                </div>
            </div>

            <div className="explore-layout">
                <aside className="map-panel">
                    <div className="panel-card panel-card--map">
                        {mappableFavorites.length > 0 ? (
                            <BreweryMap breweries={mappableFavorites} selectedBrewery={selectedLocation} />
                        ) : (
                            <div className="empty-state">No locations match your filters on the map.</div>
                        )}
                    </div>
                </aside>

                <main className="list-panel">
                    <div className="panel-card panel-card--list">
                        <div className="search-bar-section">
                            <div className="search-input-wrapper">
                                <input
                                    type="text"
                                    className="search-input"
                                    placeholder="Search favorites..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="panel-card__controls">
                            <Filters
                                country={country}
                                type={type}
                                onCountryChange={handleFilterChange(setCountry)}
                                onTypeChange={handleFilterChange(setType)}
                            />
                        </div>

                        <div className="panel-meta">
                            <div>
                                <h2>Favorite results</h2>
                            </div>
                            <p className="meta-copy">{filteredFavorites.length} locations</p>
                        </div>

                        <div className="brewery-list-wrapper">
                            {filteredFavorites.length === 0 ? (
                                <div className="empty-state">No breweries match your search.</div>
                            ) : (
                                <>
                                    <ul className="brewery-list">
                                        {displayedFavorites.map((brewery) => (
                                            <BreweryCard
                                                key={brewery.id}
                                                brewery={brewery}
                                                onSelect={() => handleSelectBrewery(brewery)}
                                            />
                                        ))}
                                    </ul>
                                    <div className="pagination-wrapper">
                                        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}