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

export default function BreweryMap({ breweries, selectedBrewery }) {
    const icon = L.icon({
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
    })

    if (!breweries?.length) return null

    const first = breweries[0]
    const defaultCenter = [parseFloat(first.latitude), parseFloat(first.longitude)]
    const selectedCenter = selectedBrewery ? [selectedBrewery.latitude, selectedBrewery.longitude] : null

    return (
        <MapContainer center={selectedCenter || defaultCenter} zoom={6} scrollWheelZoom={true} className="brewery-map">
            <TileLayer
                attribution='&copy; OpenStreetMap contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {selectedCenter && <MapCenter center={selectedCenter} zoom={12} />}
            {breweries.map(brewery => (
                <Marker key={brewery.id} icon={icon} position={[parseFloat(brewery.latitude), parseFloat(brewery.longitude)]}>
                    <Popup>
                        <strong>{brewery.name}</strong><br />
                        {brewery.city}, {brewery.state_province}<br />
                        {brewery.brewery_type}<br />
                        {brewery.website_url && (
                            <a href={brewery.website_url} target="_blank" rel="noreferrer">Website</a>
                        )}
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    )
}