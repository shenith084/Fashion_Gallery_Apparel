'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useCartStore } from '@/lib/store/cartStore';
import styles from './Navbar.module.css';

type NavLink = {
  label: string;
  href: string;
  dropdown?: { label: string; href: string; }[];
};

const NAV_LINKS: NavLink[] = [
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
    setIsSearchOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    setMounted(true);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* ── TOP HEADER ── */}
      <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
        <div className={`container ${styles.inner}`}>
          {/* Logo */}
          <Link href="/" className={styles.logo} id="navbar-logo">
            <div className={styles.logoMark}>
              <img src="/logo.svg" alt="My Moon Clothing" style={{ height: '48px', width: 'auto' }} />
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

          {/* Desktop Action Icons */}
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
          </div>
        </div>
      </header>

      {/* ── MOBILE BOTTOM NAV BAR (5 tabs) ── */}
      <nav className={styles.mobileBottomNav} aria-label="Mobile navigation">

        {/* Home */}
        <Link href="/" className={`${styles.mobileNavItem} ${pathname === '/' ? styles.mobileNavActive : ''}`} id="mobile-nav-home">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
          <span>Home</span>
        </Link>

        {/* Shop */}
        <Link href="/dresses" className={`${styles.mobileNavItem} ${pathname?.startsWith('/dresses') || pathname?.startsWith('/new-arrivals') || pathname?.startsWith('/office-wear') ? styles.mobileNavActive : ''}`} id="mobile-nav-shop">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.57a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.57a2 2 0 0 0-1.34-2.23z"/>
          </svg>
          <span>Shop</span>
        </Link>

        {/* Search */}
        <button
          className={`${styles.mobileNavItem} ${styles.mobileSearchBtn} ${isSearchOpen ? styles.mobileNavActive : ''}`}
          onClick={() => setIsSearchOpen(!isSearchOpen)}
          aria-label="Search"
          id="mobile-nav-search"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <span>Search</span>
        </button>

        {/* Account */}
        <Link href="/account" className={`${styles.mobileNavItem} ${pathname?.startsWith('/account') ? styles.mobileNavActive : ''}`} id="mobile-nav-account">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
          </svg>
          <span>Account</span>
        </Link>

        {/* Cart */}
        <Link href="/cart" className={`${styles.mobileNavItem} ${pathname === '/cart' ? styles.mobileNavActive : ''}`} id="mobile-nav-cart">
          <span className={styles.mobileCartWrap}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
            {mounted && totalItems > 0 && (
              <span className={styles.mobileBadge}>{totalItems}</span>
            )}
          </span>
          <span>Cart</span>
        </Link>

      </nav>

      {/* ── MOBILE SEARCH OVERLAY ── */}
      {isSearchOpen && (
        <div
          className={styles.mobileSearchOverlay}
          onClick={(e) => { if (e.target === e.currentTarget) setIsSearchOpen(false); }}
        >
          <form onSubmit={handleSearch} className={styles.mobileSearchForm}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6b2335" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              type="text"
              placeholder="Search dresses, styles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.mobileSearchInput}
              autoFocus
            />
            <button type="button" onClick={() => setIsSearchOpen(false)} className={styles.mobileSearchClose} aria-label="Close search">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </form>
        </div>
      )}
    </>
  );
}
