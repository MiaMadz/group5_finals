'use client'

const BREWERY_TYPES = ['micro', 'nano', 'regional', 'brewpub', 'large', 'planning', 'bar', 'contract', 'proprietor', 'taproom']
const STATES = [
    'Alaska',
    'Alabama',
    'Arkansas',
    'Arizona',
    'California',
    'Colorado',
    'Connecticut',
    'District of Columbia',
    'Delaware',
    'Florida',
    'Georgia',
    'Hawaii',
    'Iowa',
    'Illinois',
    'Indiana',
    'Kansas',
    'Kentucky',
    'Louisiana',
    'Massachusetts',
    'Maryland',
    'Maine',
    'Michigan',
    'Minnesota',
    'Missouri',
    'Mississippi',
    'Montana',
    'North Carolina',
    'North Dakota',
    'Nebraska',
    'New Hampshire',
    'New Jersey',
    'New Mexico',
    'Nevada',
    'New York',
    'Ohio',
    'Oklahoma',
    'Oregon',
    'Pennsylvania',
    'Puerto Rico',
    'Rhode Island',
    'South Carolina',
    'South Dakota',
    'Tennessee',
    'Texas',
    'Utah',
    'Virginia',
    'Virgin Islands',
    'Vermont',
    'Washington',
    'Wisconsin',
    'West Virginia',
    'Wyoming'
]

export default function Filters({ state, type, onStateChange, onTypeChange }) {
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
                <label className="screen-reader-text" htmlFor="state-filter">State</label>
                <select
                    id="state-filter"
                    className="select-input"
                    value={state}
                    onChange={(e) => onStateChange(e.target.value)}
                >
                    <option value="">Filter by state</option>
                    {STATES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                    ))}
                </select>
            </div>
        </div>
    )
}