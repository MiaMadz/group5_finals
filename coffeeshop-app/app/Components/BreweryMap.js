'use client'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'

const icon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
})

export default function BreweryMap({ breweries }) {
    const first = breweries[0]
    const center = [parseFloat(first.latitude), parseFloat(first.longitude)]

    return (
        <MapContainer center={center} zoom={6} style={{ height: '400px', width: '100%', borderRadius: '8px' }}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
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