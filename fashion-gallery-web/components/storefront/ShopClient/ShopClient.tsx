'use client';

import { useState, useMemo } from 'react';
import ProductCard from '@/components/ui/ProductCard';
import { PRODUCTS, CATEGORIES_LIST, SIZES_LIST } from '@/lib/data/products';
import styles from './ShopClient.module.css';

export default function ShopClient({ initialCategory = 'all' }: { initialCategory?: string }) {
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [activeSize, setActiveSize] = useState<string>('all');
  const [sortBy, setSortBy] = useState('newest');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const filtered = useMemo(() => {
    let list = [...PRODUCTS];

    // Category filter
    if (activeCategory !== 'all') {
      if (activeCategory === 'best-sellers') {
        list = list.filter((p) => p.isBestSeller);
      } else {
        list = list.filter((p) => p.categorySlug === activeCategory);
      }
    }

    // Size filter
    if (activeSize !== 'all') {
      list = list.filter((p) => p.sizes.includes(activeSize));
    }

    // Sort
    if (sortBy === 'price-asc') list.sort((a, b) => a.price - b.price);
    else if (sortBy === 'price-desc') list.sort((a, b) => b.price - a.price);
    else if (sortBy === 'popular') list.sort((a, b) => b.reviewCount - a.reviewCount);
    else list.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));

    return list;
  }, [activeCategory, activeSize, sortBy]);

  return (
    <div className={styles.wrapper}>
      {/* ──── SIDEBAR FILTERS ──── */}
      <aside className={`${styles.sidebar} ${mobileFiltersOpen ? styles.sidebarOpen : ''}`}>
        <div className={styles.sidebarInner}>
          <div className={styles.filterSection}>
            <h3 className={styles.filterTitle}>Category</h3>
            <ul className={styles.filterList}>
              {CATEGORIES_LIST.map((cat) => (
                <li key={cat.slug}>
                  <button
                    className={`${styles.filterBtn} ${activeCategory === cat.slug ? styles.active : ''}`}
                    onClick={() => { setActiveCategory(cat.slug); setMobileFiltersOpen(false); }}
                    id={`filter-cat-${cat.slug}`}
                  >
                    {cat.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.filterSection}>
            <h3 className={styles.filterTitle}>Size</h3>
            <div className={styles.sizeGrid}>
              <button
                className={`${styles.sizeBtn} ${activeSize === 'all' ? styles.active : ''}`}
                onClick={() => setActiveSize('all')}
              >
                All
              </button>
              {SIZES_LIST.map((size) => (
                <button
                  key={size}
                  className={`${styles.sizeBtn} ${activeSize === size ? styles.active : ''}`}
                  onClick={() => setActiveSize(size)}
                  id={`filter-size-${size}`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.filterSection}>
            <h3 className={styles.filterTitle}>Price Range</h3>
            <p className={styles.priceRange}>LKR 3,500 – LKR 6,000</p>
          </div>
        </div>
      </aside>

      {/* Backdrop for mobile */}
      {mobileFiltersOpen && (
        <div className={styles.backdrop} onClick={() => setMobileFiltersOpen(false)} />
      )}

      {/* ──── MAIN CONTENT ──── */}
      <main className={styles.main}>
        {/* Toolbar */}
        <div className={styles.toolbar}>
          <div className={styles.resultCount}>
            <span>{filtered.length}</span> products
          </div>

          <div className={styles.toolbarRight}>
            <button
              className={styles.mobileFilterToggle}
              onClick={() => setMobileFiltersOpen(true)}
              id="mobile-filter-btn"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/>
              </svg>
              Filters
            </button>

            <select
              className={styles.sortSelect}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              id="sort-select"
            >
              <option value="newest">Newest First</option>
              <option value="popular">Most Popular</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Active filters chips */}
        {(activeCategory !== 'all' || activeSize !== 'all') && (
          <div className={styles.chips}>
            {activeCategory !== 'all' && (
              <span className={styles.chip}>
                {CATEGORIES_LIST.find((c) => c.slug === activeCategory)?.label}
                <button onClick={() => setActiveCategory('all')}>×</button>
              </span>
            )}
            {activeSize !== 'all' && (
              <span className={styles.chip}>
                Size: {activeSize}
                <button onClick={() => setActiveSize('all')}>×</button>
              </span>
            )}
            <button className={styles.clearAll} onClick={() => { setActiveCategory('all'); setActiveSize('all'); }}>
              Clear All
            </button>
          </div>
        )}

        {/* Products Grid */}
        {filtered.length > 0 ? (
          <div className={styles.grid}>
            {filtered.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                price={product.price}
                image={product.image}
                rating={product.rating}
                reviewCount={product.reviewCount}
                isNew={product.isNew}
                href={`/product/${product.slug}`}
              />
            ))}
          </div>
        ) : (
          <div className={styles.empty}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--color-rose-gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
            <p>No products found for these filters.</p>
            <button className="btn btn-outline" onClick={() => { setActiveCategory('all'); setActiveSize('all'); }}>
              Clear filters
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
