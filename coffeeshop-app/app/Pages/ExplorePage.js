'use client'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { useSearchBreweriesQuery, useGetBreweryCountQuery } from '../rtk/breweryApi'
import dynamic from 'next/dynamic'
import Filters from '../Components/Filters'
import Pagination from '../Components/Pagination'
import BreweryCard from '../Components/BreweryCard'

const BreweryMap = dynamic(() => import('../Components/BreweryMap'), { ssr: false })

const PER_PAGE = 10

export default function ExplorePage() {
    const favorites = useSelector(state => state.favorites.items)

    const [nameInput, setNameInput] = useState('')
    const [name, setName]           = useState('')
    const [city, setCity]           = useState('')
    const [state, setState]         = useState('')
    const [type, setType]           = useState('')
    const [page, setPage]           = useState(1)
    const [showFavorites, setShowFavorites] = useState(false)

    const filters = { name, city, state, type, page, perPage: PER_PAGE }

    const { data: breweries = [], isLoading, isError } = useSearchBreweriesQuery(filters)
    const { data: meta } = useGetBreweryCountQuery({ name, city, state, type })

    const totalPages = meta?.total ? Math.ceil(Number(meta.total) / PER_PAGE) : 1

    const handleSearch = (e) => {
        e.preventDefault()
        setName(nameInput)
        setPage(1)
    }

    const handleFilterChange = (setter) => (value) => {
        setter(value)
        setPage(1)
    }

    const displayedBreweries = showFavorites ? favorites : breweries
    const mappableBreweries = displayedBreweries.filter(b => b.latitude && b.longitude)

    return (
        <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
            <h1>KAPEKO</h1>

            <form onSubmit={handleSearch} style={{ marginBottom: '16px' }}>
                <input
                    type="text"
                    placeholder="Search by name..."
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    style={{ padding: '8px', width: '300px', marginRight: '8px' }}
                />
                <button type="submit" style={{ padding: '8px 16px' }}>Search</button>
            </form>

            <Filters
                city={city}
                state={state}
                type={type}
                onCityChange={handleFilterChange(setCity)}
                onStateChange={handleFilterChange(setState)}
                onTypeChange={handleFilterChange(setType)}
            />

            <button
                onClick={() => setShowFavorites(prev => !prev)}
                style={{ padding: '8px 16px', marginBottom: '16px', background: showFavorites ? '#f5a623' : '#eee' }}
            >
                {showFavorites ? '★ Showing Favorites' : '☆ Show Favorites'} ({favorites.length})
            </button>

            {mappableBreweries.length > 0 && (
                <div style={{ marginBottom: '24px' }}>
                    <h2>Map</h2>
                    <BreweryMap breweries={mappableBreweries} />
                </div>
            )}

            {isLoading && <p>Loading...</p>}
            {isError && <p>Something went wrong.</p>}
            {!isLoading && !isError && displayedBreweries.length === 0 && <p>No breweries found.</p>}

            <ul style={{ listStyle: 'none', padding: 0 }}>
                {displayedBreweries.map(brewery => (
                    <BreweryCard key={brewery.id} brewery={brewery} />
                ))}
            </ul>

            {!showFavorites && (
                <Pagination
                    page={page}
                    totalPages={totalPages}
                    onPageChange={setPage}
                />
            )}
        </div>
    )
}