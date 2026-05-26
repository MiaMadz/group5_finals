'use client'
import dynamic from 'next/dynamic'
import { useEffect, useMemo, useState } from 'react'
import { useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const MapContainer = dynamic(() => import('react-leaflet').then((mod) => mod.MapContainer), {
    ssr: false,
    loading: () => null,
})
const TileLayer = dynamic(() => import('react-leaflet').then((mod) => mod.TileLayer), {
    ssr: false,
    loading: () => null,
})
const Marker = dynamic(() => import('react-leaflet').then((mod) => mod.Marker), {
    ssr: false,
    loading: () => null,
})
const Popup = dynamic(() => import('react-leaflet').then((mod) => mod.Popup), {
    ssr: false,
    loading: () => null,
})

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
    const [mounted, setMounted] = useState(false)
    const [ready, setReady] = useState(false)

    useEffect(() => {
        setMounted(true)
        const timer = window.requestAnimationFrame(() => setReady(true))
        return () => window.cancelAnimationFrame(timer)
    }, [])

    const breweryIcon = useMemo(() => L.icon({
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
    }), [])

    const userShopIcon = useMemo(() => L.icon({
        iconUrl: "data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2024%2034'%3E%3Cpath%20fill='%230072c6'%20d='M12%202C7.03%202%203%206.03%203%2011c0%206.28%207.36%2015.4%208.14%2016.32a1%201%200%200%200%201.72%200C13.64%2026.4%2021%2017.28%2021%2011c0-4.97-4.03-9-9-9z'/%3E%3Ccircle%20cx='12'%20cy='11'%20r='4'%20fill='%23ffffff'/%3E%3C/svg%3E",
        iconSize: [30, 45],
        iconAnchor: [15, 45],
        popupAnchor: [0, -38],
        shadowSize: [0, 0],
    }), [])

    if (!mounted || !ready) return null

    // Ensure Leaflet is available in the browser before attempting to render
    if (typeof window === 'undefined' || !L || !L.DomUtil) return null

    // Combine breweries and user shops, then keep only valid coordinates
    const allLocations = [
        ...(breweries || []).map(b => ({ ...b, type: 'brewery' })),
        ...(userShops || []).map(s => ({ ...s, type: 'userShop' }))
    ]

    const validLocations = allLocations.filter((location) => {
        const lat = parseFloat(location.latitude)
        const lng = parseFloat(location.longitude)
        return !Number.isNaN(lat) && !Number.isNaN(lng)
    })

    const uniqueLocations = []
    const seen = new Set()

    for (const location of validLocations) {
        const key = `${location.type}-${location.id}`
        if (!seen.has(key)) {
            seen.add(key)
            uniqueLocations.push(location)
        }
    }

    if (!uniqueLocations.length) return null

    const first = uniqueLocations[0]
    const defaultCenter = [parseFloat(first.latitude), parseFloat(first.longitude)]
    const selectedCenter = selectedBrewery && !Number.isNaN(parseFloat(selectedBrewery.latitude)) && !Number.isNaN(parseFloat(selectedBrewery.longitude))
        ? [parseFloat(selectedBrewery.latitude), parseFloat(selectedBrewery.longitude)]
        : null

    const mapKey = `${selectedCenter ? selectedCenter.join(',') : defaultCenter.join(',')}-${uniqueLocations.length}`

    // Only render map if we have valid data and mounted state
    if (!mounted || !uniqueLocations.length) {
        return null
    }

    return (
        <div style={{ height: '100%', width: '100%' }}>
            <MapContainer
                key={mapKey}
                center={selectedCenter || defaultCenter}
                zoom={6}
                scrollWheelZoom={true}
                className="brewery-map"
                style={{ height: '100%', width: '100%' }}
            >
            <TileLayer
                attribution='&copy; OpenStreetMap contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {selectedCenter && <MapCenter center={selectedCenter} zoom={12} />}
            {uniqueLocations.map((location) => {
                const icon = location.type === 'userShop' ? userShopIcon : breweryIcon
                const markerKey = location.id != null
                    ? `${location.type}-${location.id}`
                    : `${location.type}-${location.name}-${location.address}`
                return (
                    <Marker key={markerKey} icon={icon} position={[parseFloat(location.latitude), parseFloat(location.longitude)]}>
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
        </div>
    )
}