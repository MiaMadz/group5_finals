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

export default function Filters({ city, state, type, onCityChange, onStateChange, onTypeChange }) {
    return (
        <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
            <input type="text" placeholder="Filter by city" value={city} onChange={(e) => onCityChange(e.target.value)} style={{ padding: '8px' }}/>
            <select value={state} onChange={(e) => onStateChange(e.target.value)} style={{ padding: '8px' }}>
                <option value="">All States</option>
                {STATES.map(s => (
                    <option key={s} value={s.toLowerCase()}>{s}</option>
                ))}
            </select>
            <select value={type} onChange={(e) => onTypeChange(e.target.value)} style={{ padding: '8px' }}>
                <option value="">All Types</option>
                {BREWERY_TYPES.map(t => (
                    <option key={t} value={t}>{t}</option>
                ))}
            </select>
        </div>
    )
}