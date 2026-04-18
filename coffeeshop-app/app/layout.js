import './globals.css'
import Providers from './Components/Providers'
import Navbar from './Components/NavBar'
 
export const metadata = {
    title: 'Brewery Finder',
    description: 'Find breweries near you',
}
 
export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>
                <Providers>
                    <Navbar />
                    {children}
                </Providers>
            </body>
        </html>
    )
}