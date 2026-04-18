'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'
import { useState, useEffect } from 'react'
import { Heart, Search, MapPin } from 'lucide-react'

export default function Navbar() {
    const pathname = usePathname()
    const router = useRouter()
    const [mounted, setMounted] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')

    const favorites = useSelector((state) => state.favorites?.favorites || [])

    useEffect(() => { setMounted(true) }, [])

    const handleSearchChange = (e) => {
        const value = e.target.value
        setSearchQuery(value)
        router.push(`/Explore?search=${encodeURIComponent(value)}`)
    }

    const navLink = (to, label, icon = null) => (
        <Link href={to} style={{
            fontSize: '23px',
            fontWeight: '400',
            color: pathname === to ? '#ffffff' : '#f0f0f0',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'opacity 0.3s ease',
            fontFamily: "'Playfair Display', serif",
        }}>
            {icon}
            {label}
        </Link>
    )

    const styles = {
        nav: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '30px 80px',
            background: 'linear-gradient(to bottom, rgb(0, 0, 0) 0%, rgba(0, 0, 0, 0.9) 100%)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            position: 'sticky',
            top: 0,
            zIndex: 1000,
        },
        logo: {
            textDecoration: 'none',
            color: '#fff',
            fontSize: '42px',
            fontWeight: '900',
            fontFamily: "'Playfair Display', serif",
            letterSpacing: '-1px',
        },
        centerLinks: {
            display: 'flex',
            alignItems: 'center',
            gap: '50px',
        },
        rightIcons: {
            display: 'flex',
            alignItems: 'center',
            gap: '25px',
            borderLeft: '1px solid rgba(255, 255, 255, 0.3)',
            paddingLeft: '25px',
        }
    }

    return (
        <nav style={styles.nav}>
            <Link href="/" style={styles.logo}>
                KAPEKO
            </Link>

            <div style={styles.centerLinks}>
                {navLink('/', 'Home')}
                {navLink('/Explore', 'Explore')}
                {navLink('/Brewery', 'Near Me', <MapPin size={18} />)}
                {/* About Us link removed */}
            </div>

            <div style={styles.rightIcons}>
                <Link href="/Favorite" style={{ position: 'relative', color: '#fff' }}>
                    <Heart size={24} strokeWidth={1.2} />
                    {mounted && favorites.length > 0 && (
                        <span style={{
                            position: 'absolute',
                            top: '-8px',
                            right: '-8px',
                            background: '#7ABA30',
                            color: '#fff',
                            fontSize: '10px',
                            borderRadius: '50%',
                            width: '18px',
                            height: '18px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontFamily: 'sans-serif'
                        }}>
                            {favorites.length}
                        </span>
                    )}
                </Link>

                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#fff' }}
                    >
                        <Search size={24} strokeWidth={1.2} />
                    </button>
                    {isOpen && (
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={handleSearchChange}
                            autoFocus
                            style={{
                                border: 'none',
                                borderBottom: '1px solid #fff',
                                outline: 'none',
                                background: 'transparent',
                                color: '#fff',
                                marginLeft: '10px',
                                width: '150px',
                                fontSize: '16px',
                                fontFamily: "'Playfair Display', serif"
                            }}
                        />
                    )}
                </div>
            </div>
        </nav>
    )
}