import './globals.css'
import Providers from './Components/Providers'
import Navbar from './Components/NavBar'
import LeafletLoader from './Components/LeafletLoader' // ← replace the direct import

export const metadata = {
    title: 'Brewery Finder',
    description: 'Find breweries near you',
}

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>
                <Providers>
                    <LeafletLoader /> {/* ← add this */}
                    <Navbar />
                    {children}
                </Providers>
            </body>
        </html>
    )
}