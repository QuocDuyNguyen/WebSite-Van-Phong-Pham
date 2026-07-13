import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ShoppingBag, User, Search, Menu, Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { cartItems } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [wishlistCount, setWishlistCount] = useState(0);
  const [navSearch, setNavSearch] = useState(searchParams.get('search') || '');
  const itemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    setNavSearch(searchParams.get('search') || '');
  }, [searchParams]);

  const handleNavSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (navSearch.trim()) {
      navigate(`/shop?search=${encodeURIComponent(navSearch.trim())}`);
    } else {
      navigate('/shop');
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!user || !token) {
      setWishlistCount(0);
      return;
    }

    fetch('/api/wishlists', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.ok ? res.json() : [])
      .then(data => setWishlistCount(Array.isArray(data) ? data.length : 0))
      .catch(() => setWishlistCount(0));
  }, [user]);
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-surface/80 backdrop-blur-md border-b border-outline-variant/10">
      <div className="max-w-7xl mx-auto px-8 h-20 flex items-center justify-between">
        <div className="flex items-center gap-12">
          <Link to="/" className="text-2xl font-bold tracking-tight text-[#1A237E] font-headline">
            The Atelier
          </Link>
          <div className="hidden md:flex items-center gap-8 font-headline tracking-tight font-semibold">
            <Link to="/" className="text-on-surface hover:text-primary transition-colors">Home</Link>
            <Link to="/shop" className="text-on-surface hover:text-primary transition-colors">Shop</Link>
            <Link to="/about" className="text-on-surface hover:text-primary transition-colors">About Us</Link>
            <Link to="/contact" className="text-on-surface hover:text-primary transition-colors">Contact</Link>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <form onSubmit={handleNavSearchSubmit} className="hidden lg:flex items-center bg-surface-container-low px-4 py-2 rounded-full border border-outline-variant/10 focus-within:ring-2 focus-within:ring-primary/20 transition-all">
            <button type="submit" className="flex items-center justify-center hover:opacity-80 transition-opacity">
              <Search className="w-4 h-4 text-on-surface-variant mr-2 cursor-pointer" />
            </button>
            <input
              type="text"
              placeholder="Search curated goods..."
              value={navSearch}
              onChange={(e) => setNavSearch(e.target.value)}
              className="bg-transparent border-none focus:outline-none focus:ring-0 text-sm w-48 text-on-surface placeholder:text-on-surface-variant/60"
            />
          </form>
          <div className="flex items-center gap-6">
            <Link to="/cart" className="relative p-2 hover:bg-surface rounded-full transition-colors text-on-surface hover:text-primary">
              <ShoppingBag className="w-5 h-5" />
              {cartItems.length > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-primary text-on-primary text-[10px] font-bold flex items-center justify-center rounded-full">
                  {itemCount}
                </span>
              )}
            </Link>

            {user && (
              <Link to="/profile" className="relative p-2 hover:bg-surface rounded-full transition-colors text-on-surface hover:text-primary" title="Wishlist">
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute top-0 right-0 w-4 h-4 bg-tertiary text-on-primary text-[10px] font-bold flex items-center justify-center rounded-full">
                    {wishlistCount}
                  </span>
                )}
              </Link>
            )}
            {user ? (
              <>
                {user.role === 'admin' && (
                  <Link to="/admin" className="text-sm font-bold text-primary hover:underline">Admin</Link>
                )}
                <Link to="/profile" className="flex items-center gap-2 p-2 hover:bg-surface rounded-full transition-colors text-on-surface hover:text-primary">
                  <User className="w-5 h-5" />
                  <span className="hidden sm:inline text-sm font-bold">{user.full_name}</span>
                </Link>
                <button onClick={logout} className="text-xs font-bold text-on-surface-variant hover:text-primary transition-colors">
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" className="hover:scale-95 transition-transform">
                <User className="w-6 h-6" />
              </Link>
            )}
            <button className="md:hidden">
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
