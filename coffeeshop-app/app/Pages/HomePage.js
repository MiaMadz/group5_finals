'use client';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchBreweriesQuery, useGetBreweryCountQuery, useGetCountryCountQuery } from '../rtk/breweryApi';
import { toggleFavorite } from '../rtk/favoritesSlice';

const COUNTRIES = [
  'United States', 'Canada', 'England', 'Ireland', 'Scotland',
  'Wales', 'Australia', 'New Zealand', 'South Korea', 'Poland',
  'Portugal', 'Isle of Man', 'Austria', 'France', 'Singapore',
  'Belgium', 'Germany', 'Israel', 'Netherlands', 'Spain'];
const BREWERY_TYPES = ['micro', 'nano', 'regional', 'brewpub', 'large', 'planning', 'bar', 'contract', 'proprietor', 'taproom', 'closed'];

const reviewsCSS = `
  .reviews-section {
    background: #1a0f0a;
    padding: 5rem 0;
    position: relative;
    overflow: hidden;
  }
  .reviews-section::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse at 20% 50%, rgba(180, 100, 20, 0.06) 0%, transparent 60%),
                radial-gradient(ellipse at 80% 20%, rgba(180, 100, 20, 0.04) 0%, transparent 50%);
    pointer-events: none;
  }
  .reviews-section__inner {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
    display: flex;
    flex-direction: column;
    align-items: center; /* Centers contents vertically stacked */
    text-align: center;
  }
  .reviews-section__header {
    margin-bottom: 2.5rem;
  }
  .reviews-section__title {
    font-size: clamp(2.5rem, 5vw, 4rem);
    font-weight: 800;
    color: #f5e6d3;
    line-height: 1.05;
    letter-spacing: -0.02em;
    text-transform: uppercase;
    margin: 0;
  }
  .reviews-section__cta {
    display: flex;
    justify-content: center;
    margin-top: 1rem;
  }
  .btn-submit-review {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    background: transparent;
    color: #e8a44a;
    border: 1.5px solid #e8a44a;
    border-radius: 8px;
    padding: 0.75rem 2rem;
    font-size: 0.9rem;
    font-weight: 600;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    text-decoration: none;
    cursor: pointer;
    transition: background 0.2s ease, color 0.2s ease;
  }
  .btn-submit-review:hover {
    background: #e8a44a;
    color: #1a0f0a;
  }
`;

export default function HomePage() {
  const dispatch = useDispatch();
  const favorites = useSelector((state) => state.favorites.items || []);
  const { data: totalMeta } = useGetBreweryCountQuery();
  const { data: countryMeta } = useGetCountryCountQuery();
  const totalBreweries = Number(totalMeta?.total) || 0;
  const totalCountries = Number(countryMeta?.total) || COUNTRIES.length;

  const handleScroll = (direction, countryIndex) => {
    const element = document.getElementById(`carousel-${countryIndex}`);
    if (element) {
      element.scrollBy({ left: direction === 'left' ? -320 : 320, behavior: 'smooth' });
    }
  };

  return (
    <div className="sipsync-home">
      <style>{reviewsCSS}</style>

      <section className="hero">
        <div className="hero__bg" />
        <div className="hero__grain" />
        <div className="hero__content">
          <div className="hero__left">
            <div className="hero__eyebrow">
              <div className="hero__eyebrow-line" />
              <span className="hero__eyebrow-text">Welcome to SipSync</span>
            </div>
            <h1 className="hero__title">
              Discover the World's <em>Best</em> Breweries
            </h1>
            <p className="hero__body">
              Explore craft breweries and coffee houses across countries.
              Find your next favorite spot or discover hidden gems.
            </p>
            <div className="hero__cta-group">
              <Link href="/Explore" className="btn-primary">Start Exploring →</Link>
            </div>
          </div>
        </div>
      </section>

      <div className="hero__right">
        <div className="hero__stat-stack">
          <div className="hero__stat">
            <div className="hero__stat-num">{totalBreweries.toLocaleString()}</div>
            <div className="hero__stat-label">Breweries listed</div>
          </div>
          <div className="hero__stat">
            <div className="hero__stat-num">{totalCountries.toLocaleString()}</div>
            <div className="hero__stat-label">Countries covered</div>
          </div>
          <div className="hero__stat">
            <div className="hero__stat-num">{BREWERY_TYPES.length}</div>
            <div className="hero__stat-label">Brewery types</div>
          </div>
        </div>
      </div>

      <div id="breweries">
        <CountrySection
          country={COUNTRIES[0]}
          index={0}
          handleScroll={handleScroll}
          favorites={favorites}
          onToggleFavorite={(brewery) => dispatch(toggleFavorite(brewery))}
        />

        <div className="country-divider">
          <div className="country-divider__line" />
          <span className="country-divider__label">More countries</span>
          <div className="country-divider__line" />
        </div>

        <CountrySection
          country={COUNTRIES[1]}
          index={1}
          handleScroll={handleScroll}
          favorites={favorites}
          onToggleFavorite={(brewery) => dispatch(toggleFavorite(brewery))}
        />
      </div>

      <CustomerReviews />

      <Footer />
    </div>
  );
}

function CountrySection({ country, index, handleScroll, favorites, onToggleFavorite }) {
  const { data: breweriesData, isLoading } = useSearchBreweriesQuery({ country, perPage: 50 });

  if (isLoading || !breweriesData?.length) return null;

  const bgUrl = `/images/${country.toLowerCase().replace(/\s+/g, '_')}_bg.png`;

  return (
    <section className="country-section">
      <div className="country-section__bg" style={{ backgroundImage: `url(${bgUrl})` }} />
      <div className="country-section__inner">
        <div className="country-section__header">
          <div>
            <div className="country-section__tag">
              <div className="country-section__tag-line" />
              Breweries
            </div>
            <h2 className="country-section__title">{country}</h2>
            <div className="country-section__subtitle">Explore breweries from {country}</div>
          </div>
        </div>

        <div className="carousel-wrap">
          <button className="carousel-btn carousel-btn--left" onClick={() => handleScroll('left', index)} aria-label="Scroll left">‹</button>
          <div id={`carousel-${index}`} className="carousel-track">
            {breweriesData.map((brewery) => {
              const isFav = favorites.some((f) => f.id === brewery.id);
              return (
                <div key={brewery.id} className="brew-card">
                  <div className="brew-card__top">
                    <span className="brew-card__name">{brewery.name}</span>
                    <button
                      className={`brew-card__fav${isFav ? ' active' : ''}`}
                      onClick={() => onToggleFavorite(brewery)}
                      aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
                    >
                      {isFav ? '♥' : '♡'}
                    </button>
                  </div>
                  <div className="brew-card__type">{brewery.brewery_type || 'Brewery'}</div>
                  <div className="brew-card__city">
                    <span className="location-icon" aria-hidden="true">
                      <svg width="18" height="24" viewBox="0 0 18 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 0C4.03 0 0 4.03 0 9C0 15.75 9 24 9 24C9 24 18 15.75 18 9C18 4.03 13.97 0 9 0ZM9 12.6C7.16 12.6 5.7 11.14 5.7 9.3C5.7 7.46 7.16 6 9 6C10.84 6 12.3 7.46 12.3 9.3C12.3 11.14 10.84 12.6 9 12.6Z" fill="#FBC02D"/>
                      </svg>
                    </span>
                    {brewery.city}{brewery.state_province ? `, ${brewery.state_province}` : ''}
                  </div>
                  <Link href={`/Brewery/${brewery.id}`} className="brew-card__link">View on map</Link>
                </div>
              );
            })}
          </div>
          <button className="carousel-btn carousel-btn--right" onClick={() => handleScroll('right', index)} aria-label="Scroll right">›</button>
        </div>
      </div>
    </section>
  );
}

function CustomerReviews() {
  return (
    <section className="reviews-section">
      <div className="reviews-section__inner">
        <div className="reviews-section__header">
          <h2 className="reviews-section__title">Customer Reviews</h2>
        </div>
        
        <div className="reviews-section__cta">
          <Link href="/Review" className="btn-submit-review">Submit a Review</Link>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="footer__banner">
        <div className="footer__banner-bg" />
        <div className="footer__banner-content">
          <h2 className="footer__banner-title">Discover more and find the<br/>perfect spot for your next cup.</h2>
          <Link href="/Explore" className="btn-primary">Explore More Brews →</Link>
        </div>
      </div>
      <div className="footer__bottom">
        <div className="footer__links">
          {['Privacy Policy', 'Terms of Service', 'Contact'].map((label) => (
            <a key={label} href="#" className="footer__link">{label}</a>
          ))}
        </div>
        <p className="footer__copy">© {new Date().getFullYear()} SipSync. All rights reserved.</p>
      </div>
    </footer>
  );
}