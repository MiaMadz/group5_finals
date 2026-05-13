'use client'

import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { addShop } from '../rtk/userShopsSlice'
import { useRouter } from 'next/navigation'
import styles from './AddShopPage.module.css'

const SHOP_TYPES = [
    { value: 'micro', label: 'Micro' },
    { value: 'nano', label: 'Nano' },
    { value: 'regional', label: 'Regional' },
    { value: 'brewpub', label: 'Brewpub' },
    { value: 'large', label: 'Large' },
    { value: 'planning', label: 'Planning' },
    { value: 'taproom', label: 'Taproom' },
    { value: 'contract', label: 'Contract' },
    { value: 'proprietor', label: 'Proprietor' },
]

const COUNTRIES = [
    'United States', 'Canada', 'Mexico', 'United Kingdom', 'Germany', 'Belgium',
    'France', 'Czech Republic', 'Ireland', 'Netherlands', 'Italy', 'Spain',
    'Australia', 'New Zealand', 'Japan', 'Brazil', 'Argentina', 'South Africa',
    'Other'
]

export default function AddShopPage() {
    const dispatch = useDispatch()
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    const [formData, setFormData] = useState({
        shopName: '',
        address: '',
        websiteUrl: '',
        directionsUrl: '',
        country: '',
        shopType: '',
    })
    const [customCountry, setCustomCountry] = useState('')

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
        if (name === 'country' && value !== 'Other') {
            setCustomCountry('')
        }
        setError('')
    }

    const handleCustomCountryChange = (e) => {
        setCustomCountry(e.target.value)
        setError('')
    }

    const geocodeAddress = async (address, country) => {
        try {
            const query = `${address}, ${country}`
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`
            )
            const data = await response.json()

            if (data.length > 0) {
                return {
                    latitude: parseFloat(data[0].lat),
                    longitude: parseFloat(data[0].lon),
                }
            }
            throw new Error('Address not found')
        } catch (err) {
            throw new Error('Could not geocode address. Please verify the address and try again.')
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setSuccess('')

        if (!formData.shopName.trim()) {
            setError('Shop name is required')
            return
        }
        if (!formData.address.trim()) {
            setError('Address is required')
            return
        }
        if (!formData.country) {
            setError('Country is required')
            return
        }
        if (formData.country === 'Other' && !customCountry.trim()) {
            setError('Please enter a country name')
            return
        }
        if (!formData.shopType) {
            setError('Shop type is required')
            return
        }

        setIsLoading(true)

        try {
            const countryForGeocode = formData.country === 'Other' ? customCountry : formData.country
            const coords = await geocodeAddress(formData.address, countryForGeocode)

            const finalCountry = formData.country === 'Other' ? customCountry.trim() : formData.country
            const shopData = {
                name: formData.shopName.trim(),
                address: formData.address.trim(),
                website_url: formData.websiteUrl.trim(),
                directions_url: formData.directionsUrl.trim() || `https://www.google.com/maps/search/${encodeURIComponent(formData.shopName + ' ' + formData.address)}`,
                country: finalCountry,
                brewery_type: formData.shopType,
                latitude: coords.latitude,
                longitude: coords.longitude,
                isUserShop: true,
            }

            dispatch(addShop(shopData))
            setSuccess('Shop added successfully!')

            setTimeout(() => {
                router.push('/Explore')
            }, 1500)
        } catch (err) {
            setError(err.message || 'Failed to add shop. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <div className={styles.header}>
                    <h1>Add Your Coffee Shop</h1>
                    <p>Share your shop with the SipSync community</p>
                </div>

                <form onSubmit={handleSubmit} className={styles.form}>
                    {error && <div className={styles.alert + ' ' + styles.error}>{error}</div>}
                    {success && <div className={styles.alert + ' ' + styles.success}>{success}</div>}

                    <div className={styles.formGroup}>
                        <label htmlFor="shopName">Shop Name *</label>
                        <input
                            type="text"
                            id="shopName"
                            name="shopName"
                            value={formData.shopName}
                            onChange={handleChange}
                            placeholder="Enter your shop name"
                            disabled={isLoading}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="address">Address *</label>
                        <input
                            type="text"
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            placeholder="Street address, City, State/Province"
                            disabled={isLoading}
                        />
                    </div>

                    {/* Scrollable country list box */}
                    <div className={styles.formGroup}>
                        <label htmlFor="country">Country *</label>
                        <select
                            id="country"
                            name="country"
                            value={formData.country}
                            onChange={handleChange}
                            disabled={isLoading}
                        >
                            <option value="">Select a country</option>
                            {COUNTRIES.map(country => (
                                <option key={country} value={country}>{country}</option>
                            ))}
                        </select>
                    </div>

                    {formData.country === 'Other' && (
                        <div className={styles.formGroup}>
                            <label htmlFor="customCountry">Enter Country Name *</label>
                            <input
                                type="text"
                                id="customCountry"
                                value={customCountry}
                                onChange={handleCustomCountryChange}
                                placeholder="e.g., New Zealand"
                                disabled={isLoading}
                            />
                        </div>
                    )}

                    <div className={styles.formGroup}>
                        <label htmlFor="shopType">Shop Type *</label>
                        <select
                            id="shopType"
                            name="shopType"
                            value={formData.shopType}
                            onChange={handleChange}
                            disabled={isLoading}
                        >
                            <option value="">Select a shop type</option>
                            {SHOP_TYPES.map(type => (
                                <option key={type.value} value={type.value}>{type.label}</option>
                            ))}
                        </select>
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="websiteUrl">Website (Optional)</label>
                        <input
                            type="url"
                            id="websiteUrl"
                            name="websiteUrl"
                            value={formData.websiteUrl}
                            onChange={handleChange}
                            placeholder="https://yourshop.com"
                            disabled={isLoading}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="directionsUrl">Directions Link (Optional)</label>
                        <input
                            type="url"
                            id="directionsUrl"
                            name="directionsUrl"
                            value={formData.directionsUrl}
                            onChange={handleChange}
                            placeholder="Google Maps link"
                            disabled={isLoading}
                        />
                    </div>

                    <button
                        type="submit"
                        className={styles.submitBtn}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Adding Shop...' : 'Add Shop'}
                    </button>
                </form>
            </div>
        </div>
    )
}
