'use client'

const BREWERY_TYPES = ['micro', 'nano', 'regional', 'brewpub', 'large', 'planning', 'bar', 'contract', 'proprietor', 'taproom']
const COUNTRIES = [
    'United States',
    'Australia',
    'Canada',
    'South Africa',
    'Ireland',
    'England',
    'South Korea',
    'Poland',
    'Singapore',
    'Austria',
    'Portugal',
    'Japan',
    'Germany',
    'Sweden',
    'Scotland',
    'Italy',
    'France',
    'Philippines'
]

export default function Filters({ country, type, onCountryChange, onTypeChange }) {
    return (
        <div className="filters-row filters-row--compact">
            <div className="filter-control">
                <label className="screen-reader-text" htmlFor="type-filter">Type</label>
                <select
                    id="type-filter"
                    className="select-input"
                    value={type}
                    onChange={(e) => onTypeChange(e.target.value)}
                >
                    <option value="">Filter by type</option>
                    {BREWERY_TYPES.map((t) => (
                        <option key={t} value={t}>{t}</option>
                    ))}
                </select>
            </div>
            <div className="filter-control">
                <label className="screen-reader-text" htmlFor="country-filter">Country</label>
                <select
                    id="country-filter"
                    className="select-input"
                    value={country}
                    onChange={(e) => onCountryChange(e.target.value)}
                >
                    <option value="">Filter by country</option>
                    {COUNTRIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                    ))}
                </select>
            </div>
        </div>
    )
}