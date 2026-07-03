'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useCartStore } from '@/lib/store/cartStore';
import styles from './Navbar.module.css';

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'New Arrivals', href: '/new-arrivals' },
  { label: 'Dresses', href: '/dresses' },
  { label: 'Office Wear', href: '/office-wear' },
  { label: 'Wholesale', href: '/wholesale' },
  { label: 'About Us', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const totalItems = useCartStore((state) => state.getTotalItems());
  const pathname = usePathname();
  const { useRouter } = require('next/navigation');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    setMounted(true);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
      <div className={`container ${styles.inner}`}>
        {/* Logo */}
        <Link href="/" className={styles.logo} id="navbar-logo">
          <div className={styles.logoMark}>
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="18" cy="18" r="17" fill="#2B2B2B" stroke="#6B2335" strokeWidth="1.5"/>
              <path d="M22 12C22 15.31 19.31 18 16 18C12.69 18 10 15.31 10 12C10 12 13 13 16 11C19 9 22 12 22 12Z" fill="white"/>
              <path d="M14 19C14 21.21 15.79 23 18 23C20.21 23 22 21.21 22 19" stroke="#6B2335" strokeWidth="2" strokeLinecap="round"/>
              <circle cx="18" cy="24" r="1.5" fill="#6B2335"/>
            </svg>
          </div>
          <div className={styles.logoText}>
            <span className={styles.logoMain}>MY MOON</span>
            <span className={styles.logoSub}>FASHION GALLERY APPAREL</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className={styles.nav} aria-label="Main navigation">
          {NAV_LINKS.map((link) => (
            <div
              key={link.label}
              className={styles.navItem}
              onMouseEnter={() => link.dropdown && setActiveDropdown(link.label)}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <Link
                href={link.href}
                className={`${styles.navLink} ${pathname === link.href ? styles.navLinkActive : ''}`}
                id={`nav-${link.label.toLowerCase().replace(/\s/g, '-')}`}
              >
                {link.label}
                {link.dropdown && (
                  <svg width="10" height="6" viewBox="0 0 10 6" fill="none" style={{ marginLeft: 4 }}>
                    <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                )}
              </Link>
              {link.dropdown && activeDropdown === link.label && (
                <div className={styles.dropdown}>
                  {link.dropdown.map((item) => (
                    <Link key={item.label} href={item.href} className={styles.dropdownItem}>
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}

        </nav>

        {/* Action Icons */}
        <div className={styles.actions}>
          {isSearchOpen && (
            <form onSubmit={handleSearch} className={styles.searchForm}>
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
                autoFocus
              />
            </form>
          )}
          <button 
            className={styles.iconBtn} 
            aria-label="Search" 
            id="btn-search"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
          </button>
          <Link href="/account" className={styles.iconBtn} aria-label="Account" id="btn-account">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
            </svg>
          </Link>
          <Link href="/cart" className={styles.iconBtn} aria-label="Cart" id="btn-cart">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
            <span className={styles.cartBadge}>{mounted ? totalItems : 0}</span>
          </Link>

          {/* Mobile Hamburger */}
          <button
            className={styles.hamburger}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
            id="btn-mobile-menu"
          >
            <span className={`${styles.hamburgerLine} ${mobileOpen ? styles.open : ''}`} />
            <span className={`${styles.hamburgerLine} ${mobileOpen ? styles.open : ''}`} />
            <span className={`${styles.hamburgerLine} ${mobileOpen ? styles.open : ''}`} />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className={styles.mobileMenu}>
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={styles.mobileLink}
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}

        </div>
      )}
    </header>
  );
}
