'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSelector } from 'react-redux'
import { useState, useEffect } from 'react'
import { Heart, Plus } from 'lucide-react'

export default function Navbar() {
    const pathname = usePathname()
    const [mounted, setMounted] = useState(false)
    const favorites = useSelector((state) => state.favorites?.items || [])
    useEffect(() => { setMounted(true) }, [])

    const navLink = (to, label) => (
        <Link href={to} style={{
            fontSize: '20px', // Slightly larger for better match
            fontWeight: pathname === to ? '700' : '500', // Medium weight for better readability
            color: pathname === to ? '#E8A94D' : '#f0f0f0',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.3s ease',
            // LOGO FONT SYNC:
            fontFamily: "'Playfair Display', serif", 
            letterSpacing: '0.5px', // Adds that premium logo feel
            borderBottom: pathname === to ? '2px solid #C9782A' : '2px solid transparent',
            paddingBottom: '2px',
        }}>
            {label}
        </Link>
    )

    const styles = {
        nav: {
            position: 'sticky',
            top: 0,
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '20px 80px',
            background: '#1C0F0A',
            borderBottom: '1px solid rgba(201, 120, 42, 0.25)',
        },
        logo: {
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            transition: 'transform 0.3s ease',
            transform: 'scale(1.35)', // Slightly bigger as requested
            transformOrigin: 'left center',
        },
        logoImage: {
            display: 'block',
            width: '160px',
            height: 'auto',
        },
        rightSection: {
            display: 'flex', 
            alignItems: 'center', 
            gap: '40px' // Increased gap for the slightly larger font
        }
    }

    return (
        <nav style={styles.nav}>
            <Link href="/Home" style={styles.logo}>
                <img src="/images/logo.png" alt="SipSync" style={styles.logoImage} />
            </Link>

            <div style={styles.rightSection}>
                {navLink('/Home', 'Home')}
                {navLink('/Explore', 'Explore')}
                {navLink('/AddShop', 'Add Shop')}

                <Link href="/Favorite" style={{ 
                    position: 'relative', 
                    color: '#F5EFE6',
                    transition: 'transform 0.2s ease',
                    display: 'flex'
                }}>
                    <Heart size={28} strokeWidth={1.2} />
                    {mounted && favorites.length > 0 && (
                        <span style={{
                            position: 'absolute',
                            top: '-8px',
                            right: '-10px',
                            background: '#C9782A',
                            color: '#1C0F0A',
                            fontSize: '11px',
                            fontWeight: '700',
                            borderRadius: '50%',
                            width: '20px',
                            height: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontFamily: 'sans-serif',
                        }}>
                            {favorites.length}
                        </span>
                    )}
                </Link>
            </div>
        </nav>
    )
}