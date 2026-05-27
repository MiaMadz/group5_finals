'use client'
import { useState, useMemo, useEffect } from 'react'
import { useSelector } from 'react-redux'
import dynamic from 'next/dynamic'
import BreweryCard from '../Components/BreweryCard'
import Filters from '../Components/Filters'
import Pagination from '../Components/Pagination'
import 'leaflet/dist/leaflet.css'

const BreweryMap = dynamic(() => import('../Components/BreweryMap'), { ssr: false })

export default function FavoritePage() {
    const [search, setSearch] = useState('')
    const [country, setCountry] = useState('')
    const [type, setType] = useState('')
    const [page, setPage] = useState(1)
    const [selectedLocation, setSelectedLocation] = useState(null)
    const [nearMe, setNearMe] = useState(false)
    const [userCity, setUserCity] = useState('')

    const favorites = useSelector((state) => state.favorites.items || [])
    const PER_PAGE = 8
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

    useEffect(() => {
        const loadCurrentUserCity = async () => {
            try {
                const storedUser = window.localStorage.getItem('currentUser')
                if (!storedUser) return
                const currentUser = JSON.parse(storedUser)
                const userId = currentUser.id || currentUser._id
                if (!userId) return
                const response = await fetch(`${API_URL}/api/users/${encodeURIComponent(userId)}`)
                if (!response.ok) return
                const data = await response.json()
                setUserCity(data.city || '')
            } catch (error) {
                console.error('Unable to load current user city:', error)
            }
        }
        loadCurrentUserCity()
    }, [API_URL])

    const handleFilterChange = (setter) => (value) => {
        setter(value)
        setPage(1)
    }

    const getNearMeMatch = (location) => {
        if (!nearMe || !userCity.trim()) return true
        const cityTerm = userCity.trim().toLowerCase()
        return [location.city, location.state_province, location.address, location.name]
            .filter(Boolean)
            .some((text) => text.toLowerCase().includes(cityTerm))
    }

    const filteredFavorites = useMemo(() => {
        return favorites.filter((brewery) => {
            const matchesSearch =
                brewery.name.toLowerCase().includes(search.toLowerCase()) ||
                (brewery.city && brewery.city.toLowerCase().includes(search.toLowerCase()))
            const matchesType = !type || type === 'all' || brewery.brewery_type === type
            const matchesCountry = !country || brewery.country === country
            const matchesNearMe = getNearMeMatch(brewery)
            return matchesSearch && matchesType && matchesCountry && matchesNearMe
        })
    }, [favorites, search, type, country, nearMe, userCity])

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
                        <div className="search-bar-section" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
                            <div className="search-input-wrapper" style={{ flex: '1 1 320px' }}>
                                <input
                                    type="text"
                                    className="search-input"
                                    placeholder="Search favorites..."
                                    value={search}
                                    onChange={(e) => {
                                        setSearch(e.target.value)
                                        setPage(1)
                                    }}
                                />
                            </div>
                            <button
                                type="button"
                                className={`btn h-12 px-5 text-sm ${nearMe ? 'btn-secondary' : 'btn-primary'}`}
                                onClick={() => {
                                    if (!userCity.trim()) return
                                    setNearMe((prev) => !prev)
                                    setPage(1)
                                }}
                                disabled={!userCity.trim()}
                            >
                                {nearMe ? 'Near me: on' : 'Near me'}
                            </button>
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
                            <div>
                                <p className="meta-copy">{filteredFavorites.length} locations</p>
                                
                            </div>
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