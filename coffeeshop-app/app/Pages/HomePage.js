'use client';
import Link from 'next/link';
import { useSearchBreweriesQuery } from '../rtk/breweryApi';

const COUNTRIES = [
  'United States',
  'Canada'
];

export default function HomePage() {

  const handleCoffeeScroll = (direction, countryIndex) => {
    const element = document.getElementById(`carousel-${countryIndex}`);
    const scrollAmount = 320;

    if (element) {
      element.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <main
      style={{
        backgroundImage: 'linear-gradient(to bottom, #2C1E1A, #F8F5F2)'
      }}
    >
      <section 
        className="relative text-white min-h-screen flex items-center overflow-hidden"
        style={{
          backgroundImage: 'url(/images/home_bg.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40"></div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 flex justify-start">
          <div className="max-w-3xl text-left translate-x-[-120px] lg:translate-x-[-200px]">

            <p className="text-sm font-bold tracking-widest text-amber-300 uppercase mb-6">
              Welcome to SipSync
            </p>

            <h1 className="text-6xl lg:text-7xl font-black leading-tight mb-6 text-white drop-shadow-lg">
              Discover the World's Best Breweries
            </h1>

            <div className="text-lg lg:text-xl text-gray-200 leading-relaxed mb-8 max-w-2xl">
              <p>Explore craft breweries and coffee houses across countries.</p>
              <p className="mt-2">Find your next favorite spot or discover hidden gems.</p>
            </div>

          </div>
        </div>
      </section>

      {COUNTRIES.map((country, index) => (
        <CountrySection
          key={country}
          country={country}
          index={index}
          handleScroll={handleCoffeeScroll}
        />
      ))}

      <Footer />

    </main>
  );
}

function CountrySection({ country, index, handleScroll }) {

  const { data: breweriesData, isLoading } = useSearchBreweriesQuery({
    country,
    perPage: 50
  });

  if (isLoading || !breweriesData?.length) return null;

  const backgroundImageUrl = `/images/${country.toLowerCase().replace(/\s+/g, '_')}_bg.png`;

  return (
    <section
      className="py-24 border-b border-white/10"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.8)), url(${backgroundImageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        <div className="mb-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-1 w-12 bg-gradient-to-r from-amber-500 to-orange-500"></div>
            <span className="text-amber-300 font-bold text-sm uppercase">
              Breweries
            </span>
          </div>

          <h2 className="text-4xl lg:text-5xl font-black mb-2 text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
            {country}
          </h2>

          <p className="text-gray-300 text-lg">
            Explore breweries from {country}
          </p>
        </div>

        <div className="relative px-10">

          <button 
            onClick={() => handleScroll('left', index)}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 
                       w-12 h-12 rounded-full 
                       bg-white/80 backdrop-blur
                       flex items-center justify-center
                       shadow-md
                       hover:bg-amber-400 hover:text-white hover:scale-110 transition"
          >
            ‹
          </button>

          <div 
            id={`carousel-${index}`}
            className="flex gap-6 overflow-x-auto scroll-smooth pb-6 snap-x snap-mandatory"
          >
            {breweriesData.map((brewery) => (
              <div key={brewery.id} className="flex-shrink-0 w-[280px] snap-start">
                <div className="rounded-2xl border border-white/10 flex flex-col h-[280px]
                                bg-gradient-to-br from-[#3E2A24] via-[#5A3E36] to-[#7B5E57]
                                shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
                  <div className="p-6 flex flex-col justify-between h-full">
                    <div className="flex items-start justify-between gap-3 mb-2 min-h-[48px]">
                      <h3 className="font-black text-lg text-white line-clamp-2">
                        {brewery.name}
                      </h3>
                      <button className="bg-white/90 rounded-full p-2 hover:scale-110 transition"> ❤️ </button>
                    </div>

                    <p className="text-sm text-amber-200 uppercase">
                      {brewery.brewery_type || 'Brewery'}
                    </p>

                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm text-stone-200">
                        {brewery.city}
                      </span>
                    </div>

                    <Link 
                      href={`/Brewery/${brewery.id}`}
                      className="mt-4 text-center font-bold py-3 rounded-xl
                                 bg-[#F3E5D8]
                                 hover:bg-[#EAD3BE]
                                 transition shadow-md"
                    >
                      Find in Maps
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button 
            onClick={() => handleScroll('right', index)}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 
                       w-12 h-12 rounded-full 
                       bg-white/80 backdrop-blur
                       flex items-center justify-center
                       shadow-md
                       hover:bg-amber-400 hover:text-white hover:scale-110 transition"
          >
            ›
          </button>

        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="text-white">

      <div
        className="relative w-full py-10 md:py-12 flex items-center justify-center text-center overflow-hidden"
        style={{
          backgroundImage: "url('/images/footer_bg.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#1A1210]"></div>

        <div className="relative z-10 mt-4 md:mt-2">
          <h2 className="text-xl md:text-2xl font-semibold text-[#2C1E1A] mb-3 leading-snug">
            Discover more and find the <br /> perfect spot for your next cup. 
          </h2>

          <Link
            href="/Explore"
            className="inline-block px-4 py-2 rounded-full text-xs text-white font-medium
                       bg-[#3B2A24] hover:bg-[#2a1d18]
                       transition duration-300 shadow-sm"
          >
            Explore More Brews →
          </Link>
        </div>
      </div>

      <div className="bg-[#1A1210]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-3">
          <div className="flex flex-col md:flex-row justify-between items-center gap-2">
            <div className="flex gap-4 order-2 md:order-1">
              {['Privacy Policy', 'Terms of Service', 'Contact'].map((link) => (
                <a
                  key={link}
                  href="#"
                  className="text-gray-500 hover:text-amber-400 text-[11px] transition"
                >
                  {link}
                </a>
              ))}
            </div>

            <p className="text-gray-500 text-[11px] order-1 md:order-2">
              © {new Date().getFullYear()} SipSync. All rights reserved.
            </p>

          </div>
        </div>
      </div>

    </footer>
  );
}