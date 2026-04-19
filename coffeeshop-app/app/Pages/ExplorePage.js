'use client'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { useSearchBreweriesQuery, useGetBreweryCountQuery } from '../rtk/breweryApi'
import dynamic from 'next/dynamic'
import Filters from '../Components/Filters'
import Pagination from '../Components/Pagination'
import BreweryCard from '../Components/BreweryCard'
import 'leaflet/dist/leaflet.css'

const BreweryMap = dynamic(() => import('../Components/BreweryMap'), { ssr: false })

const PER_PAGE = 10

export default function ExplorePage() {
    const [search, setSearch] = useState('')
    const [country, setCountry] = useState('')
    const [type, setType] = useState('')
    const [page, setPage] = useState(1)
    const [selectedLocation, setSelectedLocation] = useState(null)

    const favorites = useSelector((state) => state.favorites?.items || [])

    const filters = { name: search, country, type, page, perPage: PER_PAGE }

    const { data: breweries = [], isLoading, isError } = useSearchBreweriesQuery(filters)
    const { data: meta } = useGetBreweryCountQuery({ name: search, country, type })

    const totalPages = meta?.total ? Math.ceil(Number(meta.total) / PER_PAGE) : 1

    const handleFilterChange = (setter) => (value) => {
        setter(value)
        setPage(1)
    }

    const handleSelectBrewery = (brewery) => {
        if (brewery?.latitude && brewery?.longitude) {
            setSelectedLocation({
                latitude: parseFloat(brewery.latitude),
                longitude: parseFloat(brewery.longitude),
            })
        }
    }

    const displayedBreweries = breweries
    const mappableBreweries = displayedBreweries.filter((b) => b.latitude && b.longitude)

    return (
        <div className="explore-page">
            <div className="explore-header">
                <div>
                    <h1>Explore breweries</h1>
                    <p className="subtitle">Discover breweries, brewpubs, and taprooms with a map-focused layout.</p>
                </div>
                <div className="explore-header__actions">
                    <div className="favorites-count">
                        <span className="favorites-label">Favorites saved:</span>
                        <span className="favorites-number">{favorites.length}</span>
                    </div>
                </div>
            </div>

            <div className="explore-layout">
                <aside className="map-panel">
                    <div className="panel-card panel-card--map">
                        {mappableBreweries.length > 0 ? (
                            <BreweryMap breweries={mappableBreweries} selectedBrewery={selectedLocation} />
                        ) : (
                            <div className="empty-state">No breweries available for the map.</div>
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
                                    placeholder="Search breweries..."
                                    value={search}
                                    onChange={(e) => {
                                        setSearch(e.target.value)
                                        setPage(1)
                                    }}
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
                                <h2>Brewery results</h2>
                            </div>
                            <p className="meta-copy">{displayedBreweries.length} locations</p>
                        </div>

                        <div className="brewery-list-wrapper">
                            <ul className="brewery-list">
                                {displayedBreweries.map((brewery) => (
                                    <BreweryCard
                                        key={brewery.id}
                                        brewery={brewery}
                                        onSelect={() => handleSelectBrewery(brewery)}
                                    />
                                ))}
                            </ul>
                        </div>

                        <div className="pagination-wrapper">
                            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}