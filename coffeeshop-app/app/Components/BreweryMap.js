'use client'
import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'

function MapCenter({ center, zoom }) {
    const map = useMap()

    useEffect(() => {
        if (center) {
            map.setView(center, zoom || map.getZoom())
        }
    }, [center, map, zoom])

    return null
}

export default function BreweryMap({ breweries, selectedBrewery, userShops }) {
    const breweryIcon = L.icon({
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
    })

    const userShopIcon = L.icon({
        iconUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0iI0U4QTk0RCIgZD0iTTEyIDJDNi40OCAyIDIgNi40OCAyIDEyczQuNDggMTAgMTAgMTAgMTAtNC40OCAxMC0xMFMxNy41MiAyIDEyIDJ6TTEyIDIwYy00LjQxIDAtOC0zLjU5LTgtOHMzLjU5LTggOC04IDggMy41OSA4IDgtMy41OSA4LTggOHptMy41LTljLS44MyAwLTEuNS0uNjctMS41LTEuNXMuNjctMS41IDEuNS0xLjUgMS41LjY3IDEuNSAxLjUtLjY3IDEuNS0xLjUgMS41ek04LjUgMTFjLS44MyAwLTEuNS0uNjctMS41LTEuNXMuNjctMS41IDEuNS0xLjUgMS41LjY3IDEuNSAxLjUtLjY3IDEuNS0xLjUgMS41eiIvPjwvc3ZnPg==',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [0, 0],
    })

    // Combine breweries and user shops
    const allLocations = [
        ...(breweries || []).map(b => ({ ...b, type: 'brewery' })),
        ...(userShops || []).map(s => ({ ...s, type: 'userShop' }))
    ]

    if (!allLocations.length) return null

    const first = allLocations[0]
    const defaultCenter = [parseFloat(first.latitude), parseFloat(first.longitude)]
    const selectedCenter = selectedBrewery ? [selectedBrewery.latitude, selectedBrewery.longitude] : null

    return (
        <MapContainer center={selectedCenter || defaultCenter} zoom={6} scrollWheelZoom={true} className="brewery-map">
            <TileLayer
                attribution='&copy; OpenStreetMap contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {selectedCenter && <MapCenter center={selectedCenter} zoom={12} />}
            {allLocations.map((location) => {
                const icon = location.type === 'userShop' ? userShopIcon : breweryIcon
                return (
                    <Marker key={location.id} icon={icon} position={[parseFloat(location.latitude), parseFloat(location.longitude)]}>
                        <Popup>
                            <strong>{location.name}</strong><br />
                            {location.type === 'userShop' && (
                                <>
                                    {location.address}<br />
                                    {location.country}<br />
                                    <span style={{
                                        display: 'inline-block',
                                        background: '#E8A94D',
                                        color: '#1C0F0A',
                                        padding: '2px 8px',
                                        borderRadius: '4px',
                                        fontSize: '12px',
                                        fontWeight: 'bold',
                                        marginTop: '4px',
                                        marginRight: '4px'
                                    }}>
                                        Community Shop
                                    </span>
                                </>
                            )}
                            {location.type === 'brewery' && (
                                <>
                                    {location.city}, {location.state_province}<br />
                                    {location.brewery_type}<br />
                                </>
                            )}
                            {location.website_url && (
                                <>
                                    <a href={location.website_url} target="_blank" rel="noreferrer">Website</a><br />
                                </>
                            )}
                            {location.directions_url && (
                                <a href={location.directions_url} target="_blank" rel="noreferrer">Directions</a>
                            )}
                        </Popup>
                    </Marker>
                )
            })}
        </MapContainer>
    )
}