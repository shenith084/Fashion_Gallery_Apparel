'use client';

import { useState, useMemo, useEffect } from 'react';
import ProductCard from '@/components/ui/ProductCard';
import { CATEGORIES_LIST, SIZES_LIST } from '@/lib/data/products';
import styles from './ShopClient.module.css';

const COLORS = ['#722F37', '#D8A7B1', '#E8DCC4', '#A8D0E6', '#000000'];

export default function ShopClient({ 
  initialCategory = 'all', 
  columns = 3 
}: { 
  initialCategory?: string,
  columns?: 3 | 4 
}) {
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [activeSize, setActiveSize] = useState<string>('all');
  const [activeColor, setActiveColor] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [sortBy, setSortBy] = useState('newest');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState<any[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/products')
      .then(r => r.json())
      .then(data => { setProducts(Array.isArray(data) ? data : []); setProductsLoading(false); })
      .catch(() => setProductsLoading(false));
  }, []);

  const filtered = useMemo(() => {
    let list = [...products];

    if (activeCategory !== 'all') {
      if (activeCategory === 'best-sellers') {
        list = list.filter((p) => p.isBestSeller);
      } else {
        list = list.filter((p) => p.categorySlug === activeCategory);
      }
    }

    if (activeSize !== 'all') {
      list = list.filter((p) => p.sizes?.includes(activeSize));
    }
    
    list = list.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);

    if (sortBy === 'price-asc') list.sort((a, b) => a.price - b.price);
    else if (sortBy === 'price-desc') list.sort((a, b) => b.price - a.price);
    else if (sortBy === 'popular') list.sort((a, b) => b.reviewCount - a.reviewCount);
    else list.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));

    return list;
  }, [activeCategory, activeSize, priceRange, sortBy, products]);

  const itemsPerPage = 7 * columns;
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const currentProducts = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, activeSize, activeColor, priceRange, sortBy]);

  const getCategoryCount = (slug: string) => {
    if (slug === 'all') return products.length;
    if (slug === 'best-sellers') return products.filter((p) => p.isBestSeller).length;
    return products.filter((p) => p.categorySlug === slug).length;
  };

  const handleClearAll = () => {
    setActiveCategory('all');
    setActiveSize('all');
    setActiveColor(null);
    setPriceRange([0, 10000]);
  };

  const activeCategoryName = CATEGORIES_LIST.find(c => c.slug === activeCategory)?.label || 'All Dresses';

  return (
    <div className={styles.wrapper}>
      {/* ──── SIDEBAR FILTERS ──── */}
      <aside className={`${styles.sidebar} ${mobileFiltersOpen ? styles.sidebarOpen : ''}`}>
        <div className={styles.sidebarInner}>
          
          <div className={styles.shopByHeader}>
            <h2 className={styles.shopByTitle}>SHOP BY</h2>
          </div>

          <div className={styles.filterSection}>
            <h3 className={styles.filterTitle}>CATEGORIES</h3>
            <ul className={styles.filterList}>
              {CATEGORIES_LIST.map((cat) => (
                <li key={cat.slug}>
                  <button
                    className={`${styles.filterBtn} ${activeCategory === cat.slug ? styles.active : ''}`}
                    onClick={() => { setActiveCategory(cat.slug); setMobileFiltersOpen(false); }}
                  >
                    <span className={styles.catLabel}>{cat.label}</span>
                    <span className={styles.catCount}>({getCategoryCount(cat.slug)})</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.filterSection}>
            <h3 className={styles.filterTitle}>SIZE</h3>
            <div className={styles.sizeGrid}>
              <button
                className={`${styles.sizeBtn} ${activeSize === 'all' ? styles.activeSize : ''}`}
                onClick={() => setActiveSize('all')}
              >
                All
              </button>
              {SIZES_LIST.map((size) => (
                <button
                  key={size}
                  className={`${styles.sizeBtn} ${activeSize === size ? styles.activeSize : ''}`}
                  onClick={() => setActiveSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.filterSection}>
            <h3 className={styles.filterTitle}>COLOR</h3>
            <div className={styles.colorGrid}>
              {COLORS.map((col, idx) => (
                <button
                  key={idx}
                  className={`${styles.colorCircle} ${activeColor === col ? styles.activeColor : ''}`}
                  style={{ backgroundColor: col }}
                  onClick={() => setActiveColor(activeColor === col ? null : col)}
                  aria-label={`Filter by color ${col}`}
                />
              ))}
            </div>
          </div>

          <div className={styles.filterSection}>
            <h3 className={styles.filterTitle}>PRICE RANGE</h3>
            <div className={styles.priceSlider}>
              <div className={styles.sliderTrack}>
                <div 
                  className={styles.sliderRange} 
                  style={{ 
                    left: `${(priceRange[0] / 10000) * 100}%`, 
                    right: `${100 - (priceRange[1] / 10000) * 100}%` 
                  }}
                ></div>
                
                <input 
                  type="range" 
                  min="0" 
                  max="10000" 
                  step="100" 
                  value={priceRange[0]} 
                  onChange={(e) => {
                    const val = Math.min(Number(e.target.value), priceRange[1] - 500);
                    setPriceRange([val, priceRange[1]]);
                  }}
                  className={styles.rangeInput} 
                />
                <input 
                  type="range" 
                  min="0" 
                  max="10000" 
                  step="100" 
                  value={priceRange[1]} 
                  onChange={(e) => {
                    const val = Math.max(Number(e.target.value), priceRange[0] + 500);
                    setPriceRange([priceRange[0], val]);
                  }}
                  className={styles.rangeInput} 
                />
              </div>
              <div className={styles.priceLabels}>
                <span>LKR {priceRange[0].toLocaleString()}</span>
                <span>LKR {priceRange[1].toLocaleString()}</span>
              </div>
            </div>
          </div>

          <button className={styles.applyBtn} onClick={() => setMobileFiltersOpen(false)}>
            APPLY FILTERS
          </button>
          
          <button className={styles.clearAllBtn} onClick={handleClearAll}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
            </svg>
            CLEAR ALL
          </button>
        </div>
      </aside>

      {/* ──── MAIN CONTENT ──── */}
      <main className={styles.main}>
        <div className={styles.toolbar}>
          <div className={styles.breadcrumbAndCount}>
            <div className={styles.breadcrumbs}>
              <a href="/">Home</a>
              <span className={styles.breadcrumbSep}>›</span>
              <span className={styles.breadcrumbActive}>{activeCategoryName}</span>
            </div>
            <span className={styles.resultCount}>{filtered.length} Products Found</span>
          </div>

          <div className={styles.toolbarRight}>
            <button className={styles.mobileFilterToggle} onClick={() => setMobileFiltersOpen(true)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="4" y1="21" x2="4" y2="14"></line><line x1="4" y1="10" x2="4" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="3"></line>
                <line x1="20" y1="21" x2="20" y2="16"></line><line x1="20" y1="12" x2="20" y2="3"></line>
                <line x1="1" y1="14" x2="7" y2="14"></line><line x1="9" y1="8" x2="15" y2="8"></line>
                <line x1="17" y1="16" x2="23" y2="16"></line>
              </svg>
              Filters
            </button>

            <select
              className={styles.sortSelect}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              aria-label="Sort products"
            >
              <option value="newest">Newest First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="popular">Most Popular</option>
            </select>

            <div className={styles.viewToggles}>
              <button
                className={`${styles.viewBtn} ${viewMode === 'grid' ? styles.viewActive : ''}`}
                onClick={() => setViewMode('grid')}
                aria-label="Grid view"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
                </svg>
              </button>
              <button
                className={`${styles.viewBtn} ${viewMode === 'list' ? styles.viewActive : ''}`}
                onClick={() => setViewMode('list')}
                aria-label="List view"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        {currentProducts.length > 0 ? (
          <div className={`${styles.grid} ${columns === 4 ? styles.grid4 : styles.grid3} ${viewMode === 'list' ? styles.list : ''}`}>
            {currentProducts.map((p) => (
              <ProductCard
                key={p.id}
                id={p.id}
                name={p.name}
                price={p.price}
                image={p.image}
                rating={p.rating}
                reviewCount={p.reviewCount}
                isNew={p.isNew}
                href={`/product/${p.slug}`}
              />
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <p>No products match your filters.</p>
            <button className="btn btn-primary" onClick={handleClearAll} style={{ marginTop: '16px' }}>Clear Filters</button>
          </div>
        )}

        {totalPages > 1 && (
          <div className={styles.pagination}>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                className={`${styles.pageBtn} ${currentPage === i + 1 ? styles.pageActive : ''}`}
                onClick={() => {
                  setCurrentPage(i + 1);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                {i + 1}
              </button>
            ))}
            <button 
              className={styles.pageBtn}
              onClick={() => {
                if (currentPage < totalPages) {
                  setCurrentPage(currentPage + 1);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
              disabled={currentPage === totalPages}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
