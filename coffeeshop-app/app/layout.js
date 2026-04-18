import './globals.css'
import Providers from './Components/Providers'
 
export const metadata = {
    title: 'Brewery Finder',
    description: 'Find breweries near you',
}
 
export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>
                <Providers>
                    {children}
                </Providers>
            </body>
        </html>
    )
}