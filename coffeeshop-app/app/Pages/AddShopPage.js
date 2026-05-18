'use client'

import { useState, useEffect } from 'react'
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
        businessPermit: null,
    })
    const [previewUrl, setPreviewUrl] = useState('')

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
        setError('')
    }

    const handleFileChange = (e) => {
        const file = e.target.files?.[0] || null
        setFormData(prev => ({
            ...prev,
            businessPermit: file,
        }))
        setError('')
    }

    const handleRemoveFile = () => {
        setFormData(prev => ({
            ...prev,
            businessPermit: null,
        }))
        setPreviewUrl('')
        setError('')
    }

    useEffect(() => {
        if (!formData.businessPermit) {
            setPreviewUrl('')
            return
        }

        const url = URL.createObjectURL(formData.businessPermit)
        setPreviewUrl(url)

        return () => {
            URL.revokeObjectURL(url)
        }
    }, [formData.businessPermit])

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
        if (!formData.country.trim()) {
            setError('Country is required')
            return
        }
        if (!formData.shopType) {
            setError('Shop type is required')
            return
        }
        if (!formData.businessPermit) {
            setError('A photo of your business permit is required')
            return
        }

        setIsLoading(true)

        try {
            const coords = await geocodeAddress(formData.address, formData.country.trim())

            const shopData = {
                name: formData.shopName.trim(),
                address: formData.address.trim(),
                website_url: formData.websiteUrl.trim(),
                directions_url: formData.directionsUrl.trim() || `https://www.google.com/maps/search/${encodeURIComponent(formData.shopName + ' ' + formData.address)}`,
                country: formData.country.trim(),
                brewery_type: formData.shopType,
                latitude: coords.latitude,
                longitude: coords.longitude,
                isUserShop: true,
                businessPermitName: formData.businessPermit?.name || '',
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
        <div className={styles.wrapper}>
            <div className={styles.bg} />
            <div className={styles.grain} />
            <div className={styles.container}>
                <div className={styles.imagePanel} />
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
                        <input
                            type="text"
                            id="country"
                            name="country"
                            value={formData.country}
                            onChange={handleChange}
                            placeholder="Enter country"
                            disabled={isLoading}
                        />
                    </div>

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

                    <div className={styles.formGroup}>
                        <label htmlFor="businessPermit">Business Permit Photo *</label>
                        <label className={styles.dropZone} htmlFor="businessPermit">
                            <input
                                type="file"
                                id="businessPermit"
                                name="businessPermit"
                                accept="image/*"
                                onChange={handleFileChange}
                                disabled={isLoading}
                            />

                            {previewUrl ? (
                                <div className={styles.dropZonePreviewWrap}>
                                    <img src={previewUrl} alt="Business permit preview" className={styles.dropZonePreview} />
                                    <button
                                        type="button"
                                        className={styles.removeFileBtn}
                                        onClick={handleRemoveFile}
                                        disabled={isLoading}
                                    >
                                        Remove photo
                                    </button>
                                </div>
                            ) : (
                                <div className={styles.dropZoneContent}>
                                    <span className={styles.dropZoneIcon}>📷</span>
                                    <p>Drop photo here or click to upload</p>
                                    <span className={styles.dropZoneHint}>Accepted: JPG, PNG</span>
                                </div>
                            )}
                        </label>
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
        </div>
    )
}
