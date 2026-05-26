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

const PERMIT_KEYWORDS = [
    'business permit',
    'business license',
    'permit no',
    'office of the mayor',
    'bplo',
    'business permit and licensing',
    'mayor',
    'valid until',
    'approved by',
    'permit number',
    'municipal',
    'city government',
]

export default function AddShopPage() {
    const dispatch = useDispatch()
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [isVerifying, setIsVerifying] = useState(false)
    const [permitInfo, setPermitInfo] = useState(null)

    const [formData, setFormData] = useState({
        shopName: '',
        address: '',
        city: '',
        stateProvince: '',
        postalCode: '',
        websiteUrl: '',
        directionsUrl: '',
        phone: '',
        country: '',
        shopType: '',
        businessPermit: null,
    })
    const [previewUrl, setPreviewUrl] = useState('')
    const [currentUser, setCurrentUser] = useState(null)

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
        setError('')
    }

    const handleFileChange = (e) => {
        const file = e.target.files?.[0] || null
        setFormData(prev => ({ ...prev, businessPermit: file }))
        setPermitInfo(null)
        setError('')
    }

    const handleRemoveFile = () => {
        setFormData(prev => ({ ...prev, businessPermit: null }))
        setPreviewUrl('')
        setPermitInfo(null)
        setError('')
    }

    useEffect(() => {
        if (!formData.businessPermit) {
            setPreviewUrl('')
            return
        }
        const url = URL.createObjectURL(formData.businessPermit)
        setPreviewUrl(url)
        return () => URL.revokeObjectURL(url)
    }, [formData.businessPermit])

    useEffect(() => {
        try {
            const storedUser = window.localStorage.getItem('currentUser')
            if (storedUser) setCurrentUser(JSON.parse(storedUser))
        } catch (err) {
            console.warn('Could not load current user from localStorage', err)
        }
    }, [])

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

    const geocodeAddress = async (address, city, state, postalCode, country) => {
        try {
            const parts = [address, city, state, postalCode, country].filter(Boolean)
            const query = parts.join(', ')

            let response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`
            )
            let data = await response.json()

            if (!data || data.length === 0) {
                const fallbackQuery = [address, country].filter(Boolean).join(', ')
                response = await fetch(
                    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(fallbackQuery)}`
                )
                data = await response.json()
            }

            if (data && data.length > 0) {
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

    const extractPermitInfo = (text) => {
        const lower = text.toLowerCase()

        const foundKeywords = PERMIT_KEYWORDS.filter(k => lower.includes(k))
        const isPermit = foundKeywords.length >= 2

        const permitNoMatch = text.match(/permit\s*no[:\s#]*([A-Z0-9\-]+)/i)
        const permitNumber = permitNoMatch ? permitNoMatch[1].trim() : null

        const validUntilMatch = text.match(/valid\s*until\s*[:\s]*([A-Z]+\s+\d{1,2},?\s*\d{4}|\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}|december\s+\d{1,2},?\s*\d{4})/i)
        const validUntilText = validUntilMatch ? validUntilMatch[1].trim() : null

        let isExpired = false
        let validUntilDate = null
        if (validUntilText) {
            validUntilDate = new Date(validUntilText)
            if (!isNaN(validUntilDate)) {
                isExpired = validUntilDate < new Date()
            }
        }

        const businessNameMatch = text.match(/business\s*name[:\s]*([A-Z &\-']+)/i)
        const extractedBusinessName = businessNameMatch ? businessNameMatch[1].trim() : null

        const mayorMatch = text.match(/(hon\.|honorable|mayor)[:\s]*([A-Z\s.]+)/i)
        const issuingAuthority = mayorMatch ? mayorMatch[0].trim() : null

        return {
            isPermit,
            foundKeywords,
            permitNumber,
            validUntilText,
            validUntilDate,
            isExpired,
            extractedBusinessName,
            issuingAuthority,
        }
    }

    const verifyBusinessPermit = async (file) => {
        const { createWorker } = await import('tesseract.js')
        const worker = await createWorker('eng')

        try {
            const { data: { text } } = await worker.recognize(file)
            console.log('OCR extracted text:', text)
            const info = extractPermitInfo(text)
            setPermitInfo(info)
            await worker.terminate()
            return info
        } catch (err) {
            await worker.terminate()
            throw err
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setSuccess('')

        if (!formData.shopName.trim()) { setError('Shop name is required'); return }
        if (!formData.address.trim()) { setError('Address is required'); return }
        if (!formData.city.trim()) { setError('City is required'); return }
        if (!formData.stateProvince.trim()) { setError('Province/State is required'); return }
        if (!formData.postalCode.trim()) { setError('Postal Code is required'); return }
        if (!formData.country.trim()) { setError('Country is required'); return }
        if (!formData.shopType) { setError('Shop type is required'); return }
        if (!formData.phone.trim()) { setError('Business phone number is required'); return }
        if (!currentUser) { setError('You must be logged in to add a shop.'); return }
        if (!formData.businessPermit) { setError('A photo of your business permit is required'); return }

        // Verify permit with Tesseract OCR
        try {
            setIsVerifying(true)
            const info = await verifyBusinessPermit(formData.businessPermit)
            setIsVerifying(false)

            if (!info.isPermit) {
                setError('The uploaded image does not appear to be a valid business permit. Please upload a clear photo of your official business permit.')
                return
            }

            if (info.isExpired) {
                setError(`Your business permit expired on ${info.validUntilText}. Please upload a valid and current business permit.`)
                return
            }
        } catch (err) {
            setIsVerifying(false)
            setError('Could not read your business permit. Please upload a clearer image.')
            return
        }

        setIsLoading(true)

        try {
            const coords = await geocodeAddress(
                formData.address.trim(),
                formData.city.trim(),
                formData.stateProvince.trim(),
                formData.postalCode.trim(),
                formData.country.trim()
            )

            // Use FormData to send file + shop data together
            const form = new FormData()
            form.append('name', formData.shopName.trim())
            form.append('address', formData.address.trim())
            form.append('city', formData.city.trim())
            form.append('state_province', formData.stateProvince.trim())
            form.append('postal_code', formData.postalCode.trim())
            form.append('website_url', formData.websiteUrl.trim())
            form.append('directions_url', formData.directionsUrl.trim() || `https://www.google.com/maps/search/${encodeURIComponent(formData.shopName + ' ' + formData.address)}`)
            form.append('country', formData.country.trim())
            form.append('brewery_type', formData.shopType)
            form.append('phone', formData.phone.trim())
            form.append('added_by', currentUser?.id || '')
            form.append('latitude', coords.latitude)
            form.append('longitude', coords.longitude)
            form.append('isUserShop', true)
            form.append('businessPermit', formData.businessPermit)

            const res = await fetch(`${API_URL}/api/cafes`, {
                method: 'POST',
                body: form, // No Content-Type header — browser sets it automatically
            })

            const saved = await res.json()

            const shopToDispatch = {
                name: formData.shopName.trim(),
                address: formData.address.trim(),
                city: formData.city.trim(),
                state_province: formData.stateProvince.trim(),
                postal_code: formData.postalCode.trim(),
                website_url: formData.websiteUrl.trim(),
                country: formData.country.trim(),
                brewery_type: formData.shopType,
                phone: formData.phone.trim(),
                added_by: currentUser?.id || null,
                latitude: coords.latitude,
                longitude: coords.longitude,
                isUserShop: true,
                businessPermitName: formData.businessPermit?.name || '',
                ...saved,
            }

            dispatch(addShop(shopToDispatch))
            setSuccess('Shop added successfully!')

            setTimeout(() => {
                router.push('/Explore')
            }, 1500)
        } catch (err) {
            console.error('Add shop failed:', err)
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
                            <input type="text" id="shopName" name="shopName" value={formData.shopName}
                                onChange={handleChange} placeholder="Enter your shop name"
                                disabled={isLoading || isVerifying} />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="address">Address *</label>
                            <input type="text" id="address" name="address" value={formData.address}
                                onChange={handleChange} placeholder="Street address"
                                disabled={isLoading || isVerifying} />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="city">City *</label>
                            <input type="text" id="city" name="city" value={formData.city}
                                onChange={handleChange} placeholder="Enter city"
                                disabled={isLoading || isVerifying} />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="stateProvince">Province/State *</label>
                            <input type="text" id="stateProvince" name="stateProvince" value={formData.stateProvince}
                                onChange={handleChange} placeholder="Enter province or state"
                                disabled={isLoading || isVerifying} />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="postalCode">Postal Code *</label>
                            <input type="text" id="postalCode" name="postalCode" value={formData.postalCode}
                                onChange={handleChange} placeholder="Enter postal code"
                                disabled={isLoading || isVerifying} />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="country">Country *</label>
                            <input type="text" id="country" name="country" value={formData.country}
                                onChange={handleChange} placeholder="Enter country"
                                disabled={isLoading || isVerifying} />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="shopType">Shop Type *</label>
                            <select id="shopType" name="shopType" value={formData.shopType}
                                onChange={handleChange} disabled={isLoading || isVerifying}>
                                <option value="">Select a shop type</option>
                                {SHOP_TYPES.map(type => (
                                    <option key={type.value} value={type.value}>{type.label}</option>
                                ))}
                            </select>
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="phone">Business Phone *</label>
                            <input type="tel" id="phone" name="phone" value={formData.phone}
                                onChange={handleChange} placeholder="Enter business phone number"
                                disabled={isLoading || isVerifying} />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="websiteUrl">Website (Optional)</label>
                            <input type="url" id="websiteUrl" name="websiteUrl" value={formData.websiteUrl}
                                onChange={handleChange} placeholder="https://yourshop.com"
                                disabled={isLoading || isVerifying} />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="directionsUrl">Directions Link (Optional)</label>
                            <input type="url" id="directionsUrl" name="directionsUrl" value={formData.directionsUrl}
                                onChange={handleChange} placeholder="Google Maps link"
                                disabled={isLoading || isVerifying} />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="businessPermit">Business Permit Photo *</label>
                            <label className={styles.dropZone} htmlFor="businessPermit">
                                <input type="file" id="businessPermit" name="businessPermit"
                                    accept="image/*" onChange={handleFileChange}
                                    disabled={isLoading || isVerifying} />

                                {previewUrl ? (
                                    <div className={styles.dropZonePreviewWrap}>
                                        <img src={previewUrl} alt="Business permit preview"
                                            className={styles.dropZonePreview} />
                                        {permitInfo && permitInfo.isPermit && (
                                            <div className={styles.permitInfo}>
                                                {permitInfo.permitNumber && (
                                                    <p>✅ Permit No: {permitInfo.permitNumber}</p>
                                                )}
                                                {permitInfo.validUntilText && (
                                                    <p>📅 Valid Until: {permitInfo.validUntilText}</p>
                                                )}
                                                {permitInfo.extractedBusinessName && (
                                                    <p>🏪 Business: {permitInfo.extractedBusinessName}</p>
                                                )}
                                            </div>
                                        )}
                                        <button type="button" className={styles.removeFileBtn}
                                            onClick={handleRemoveFile}
                                            disabled={isLoading || isVerifying}>
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

                        <button type="submit" className={styles.submitBtn}
                            disabled={isLoading || isVerifying}>
                            {isVerifying ? '🔍 Reading permit...' : isLoading ? 'Adding Shop...' : 'Add Shop'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}