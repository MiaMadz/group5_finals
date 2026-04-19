'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSelector } from 'react-redux'
import { useState, useEffect } from 'react'
import { Heart } from 'lucide-react'

export default function Navbar() {
    const pathname = usePathname()
    const [mounted, setMounted] = useState(false)
    const favorites = useSelector((state) => state.favorites?.items || [])
    useEffect(() => { setMounted(true) }, [])

    const navLink = (to, label) => (
        <Link href={to} style={{
            fontSize: '18px',
            fontWeight: pathname === to ? '700' : '400',
            color: pathname === to ? '#E8A94D' : '#f0f0f0',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'color 0.2s ease',
            fontFamily: "'Playfair Display', serif",
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
            fontSize: '60px'
        },
        logoImage: {
            display: 'block',
            width: '160px',
            height: 'auto',
        },
        centerLinks: {
            display: 'flex',
            alignItems: 'center',
            gap: '40px',
        },
        rightIcons: {
            display: 'flex',
            alignItems: 'center',
            gap: '25px',
            borderLeft: '1px solid rgba(201, 120, 42, 0.3)',
            paddingLeft: '25px',
        }
    }

    return (
        <nav style={styles.nav}>
            <Link href="/Home" style={styles.logo}>
                <img src="/images/logo.png" alt="SipSync" style={styles.logoImage} />
            </Link>

            <div style={{ display: 'flex', alignItems: 'center', gap: '25px' }}>
                {navLink('/Home', 'Home')}
                {navLink('/Explore', 'Explore')}

                <Link href="/Favorite" style={{ position: 'relative', color: '#F5EFE6' }}>
                    <Heart size={24} strokeWidth={1.2} />
                    {mounted && favorites.length > 0 && (
                        <span style={{
                            position: 'absolute',
                            top: '-8px',
                            right: '-8px',
                            background: '#C9782A',
                            color: '#1C0F0A',
                            fontSize: '10px',
                            fontWeight: '700',
                            borderRadius: '50%',
                            width: '18px',
                            height: '18px',
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