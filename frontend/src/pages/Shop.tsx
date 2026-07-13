import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Search, Filter, Star, ArrowRight, Heart } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category') || 'All';
  const searchParam = searchParams.get('search') || '';

  const [products, setProducts] = useState<any[]>([]);
  const [dbCategories, setDbCategories] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState(categoryParam);
  const [searchQuery, setSearchQuery] = useState(searchParam);
  const [wishlistIds, setWishlistIds] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 12;

  useEffect(() => {
    const cat = searchParams.get('category') || 'All';
    const s = searchParams.get('search') || '';
    setActiveCategory(cat);
    setSearchQuery(s);
  }, [searchParams]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (activeCategory && activeCategory !== 'All') params.append('category', activeCategory);
    if (searchQuery) params.append('search', searchQuery);

    fetch(`/api/products?${params.toString()}`)
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setCurrentPage(1);
      });
  }, [activeCategory, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(products.length / ITEMS_PER_PAGE));
  const paginatedProducts = products.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleCategoryClick = (cat: string) => {
    setActiveCategory(cat);
    setCurrentPage(1);
    const newParams = new URLSearchParams(searchParams);
    if (cat !== 'All') {
      newParams.set('category', cat);
    } else {
      newParams.delete('category');
    }
    // Clear search when switching categories so user sees all items in that category
    newParams.delete('search');
    setSearchQuery('');
    setSearchParams(newParams);
  };

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    setCurrentPage(1);
    const newParams = new URLSearchParams(searchParams);
    if (val) {
      newParams.set('search', val);
      // Automatically reset category to 'All' when typing a search query so all matching products are found
      if (activeCategory !== 'All') {
        setActiveCategory('All');
        newParams.delete('category');
      }
    } else {
      newParams.delete('search');
    }
    setSearchParams(newParams);
  };

  useEffect(() => {
    fetch('/api/categories').then(res => res.json()).then(data => setDbCategories(data));
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    fetch('/api/wishlists', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.ok ? res.json() : [])
      .then(data => setWishlistIds(Array.isArray(data) ? data.map((product: any) => product.id) : []))
      .catch(() => setWishlistIds([]));
  }, []);

  const toggleWishlist = async (productId: number) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login to use wishlist');
      return;
    }

    const alreadySaved = wishlistIds.includes(productId);
    const res = await fetch(`/api/wishlists/${productId}`, {
      method: alreadySaved ? 'DELETE' : 'POST',
      headers: { Authorization: `Bearer ${token}` }
    });

    if (res.ok) {
      setWishlistIds(prev => alreadySaved ? prev.filter(id => id !== productId) : [...prev, productId]);
    }
  };

  const categories = ['All', ...dbCategories.map(c => c.name)];

  return (
    <div className="pt-32 pb-24 max-w-7xl mx-auto px-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
        <div>
          <h1 className="text-6xl font-bold text-[#1A237E] mb-4">The Shop</h1>
          <p className="text-on-surface-variant text-lg max-w-md">
            Browse our full collection of archival-grade tools and studio essentials.
          </p>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
            <input 
              type="text" 
              placeholder="Search products..." 
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-full bg-white border border-outline-variant/10 focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
          <button className="px-6 py-3 bg-white border border-outline-variant/10 rounded-full font-bold flex items-center gap-2 hover:bg-surface transition-all">
            <Filter className="w-4 h-4" /> Filter
          </button>
        </div>
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-3 mb-12">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryClick(cat)}
            className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${activeCategory === cat ? 'bg-primary text-on-primary shadow-lg shadow-primary/20' : 'bg-white text-on-surface-variant hover:bg-surface'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {paginatedProducts.map((item, idx) => (
          <motion.div 
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            key={item.id}
          >
            <Link to={`/product/${item.id}`} className="group">
              <div className="relative aspect-square rounded-3xl overflow-hidden mb-4 bg-white">
                <img 
                  src={item.image_url} 
                  alt={item.name} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 right-4 px-3 py-1 bg-white/80 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-widest text-primary">
                  {item.category_name}
                </div>
                <button
                  type="button"
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    toggleWishlist(item.id);
                  }}
                  className={`absolute top-4 left-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center transition-all ${wishlistIds.includes(item.id) ? 'text-tertiary' : 'text-on-surface-variant hover:text-tertiary'}`}
                  title="Add to wishlist"
                >
                  <Heart className={`w-5 h-5 ${wishlistIds.includes(item.id) ? 'fill-current' : ''}`} />
                </button>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-lg group-hover:text-primary transition-colors">{item.name}</h3>
                  <div className="flex items-center gap-1 text-tertiary">
                    <Star className="w-3 h-3 fill-current" />
                    <span className="text-[10px] font-bold">4.9</span>
                  </div>
                </div>
                <p className="text-on-surface-variant font-medium">${item.price}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {products.length === 0 && (
        <div className="py-24 text-center">
          <p className="text-on-surface-variant text-lg">No products found matching your criteria.</p>
          <button 
            onClick={() => {setActiveCategory('All'); setSearchQuery('');}}
            className="mt-4 text-primary font-bold hover:underline"
          >
            Clear all filters
          </button>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-24 flex justify-center items-center gap-3">
          <button
            onClick={() => {
              setCurrentPage(prev => Math.max(1, prev - 1));
              window.scrollTo({ top: 300, behavior: 'smooth' });
            }}
            disabled={currentPage === 1}
            className={`px-5 h-12 rounded-full border border-outline-variant/20 flex items-center justify-center font-bold transition-all gap-2 ${currentPage === 1 ? 'opacity-40 cursor-not-allowed bg-surface/50 text-on-surface-variant' : 'bg-white text-on-surface-variant hover:bg-surface hover:text-primary shadow-sm'}`}
          >
            ← Prev
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => {
                setCurrentPage(page);
                window.scrollTo({ top: 300, behavior: 'smooth' });
              }}
              className={`w-12 h-12 rounded-full border border-outline-variant/20 flex items-center justify-center font-bold transition-all ${currentPage === page ? 'bg-primary text-on-primary shadow-lg shadow-primary/20 border-primary' : 'bg-white text-on-surface-variant hover:bg-surface'}`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => {
              setCurrentPage(prev => Math.min(totalPages, prev + 1));
              window.scrollTo({ top: 300, behavior: 'smooth' });
            }}
            disabled={currentPage === totalPages}
            className={`px-6 h-12 rounded-full border border-outline-variant/20 flex items-center justify-center font-bold transition-all gap-2 ${currentPage === totalPages ? 'opacity-40 cursor-not-allowed bg-surface/50 text-on-surface-variant' : 'bg-white text-on-surface-variant hover:bg-surface hover:text-primary shadow-sm'}`}
          >
            Next <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
