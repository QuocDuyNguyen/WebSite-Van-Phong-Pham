import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Star, ShoppingBag, Heart, ShieldCheck, Truck, RotateCcw, ChevronRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [product, setProduct] = useState<any>(null);
  const [activeImage, setActiveImage] = useState<string>('');
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then(res => res.json())
      .then(data => {
        setProduct(data);
        if (data?.image_url) {
          setActiveImage(data.image_url);
        }
        const opts = getOptionsForProduct(data);
        if (opts && opts.length > 0) {
          setSelectedOption(opts[0].name);
        }
      });
    
    // Check if in wishlist
    const token = localStorage.getItem('token');
    if (token) {
      fetch('/api/wishlists', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.some((p: any) => p.id === Number(id))) {
          setIsInWishlist(true);
        }
      });
    }
  }, [id]);

  const toggleWishlist = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Vui lòng đăng nhập để sử dụng danh sách yêu thích');
      navigate('/login');
      return;
    }
    
    try {
      const method = isInWishlist ? 'DELETE' : 'POST';
      const res = await fetch(`/api/wishlists/${id}`, {
        method,
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setIsInWishlist(!isInWishlist);
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (!product) return <div className="pt-32 pb-24 text-center text-lg font-bold text-on-surface-variant">Loading product details...</div>;

  const getOptionsForProduct = (p: any) => {
    if (!p) return [];
    const cat = (p.category_name || p.category?.name || '').toLowerCase();
    const name = (p.name || '').toLowerCase();
    if (cat.includes('paper') || cat.includes('sketch') || name.includes('series') || name.includes('book')) {
      return [
        { name: 'Natural Vellum', hex: '#f5f5dc' },
        { name: 'Blush Linen', hex: '#f8bbd0' },
        { name: 'Charcoal Grey', hex: '#2f3336' },
        { name: 'Deep Navy', hex: '#1A237E' },
      ];
    } else if (cat.includes('pen') || cat.includes('writing') || name.includes('pen')) {
      return [
        { name: 'Polished Brass', hex: '#d4af37' },
        { name: 'Matte Black', hex: '#1c1c1c' },
        { name: 'Sterling Silver', hex: '#c0c0c0' },
      ];
    }
    return [
      { name: 'Standard Edition', hex: '#1A237E' },
      { name: 'Studio Dark', hex: '#2f3336' }
    ];
  };

  const options = getOptionsForProduct(product);
  const stock = product.stock_quantity !== undefined ? Number(product.stock_quantity) : 0;
  const ratingVal = product.rating ? Number(product.rating) : 4.9;
  const categoryTitle = product.category_name || product.category?.name || 'Collection';

  return (
    <div className="pt-32 pb-24 max-w-7xl mx-auto px-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-12">
        <Link to="/shop" className="hover:text-primary cursor-pointer">Shop</Link>
        <ChevronRight className="w-3 h-3" />
        <Link to={`/shop?category=${encodeURIComponent(categoryTitle)}`} className="hover:text-primary cursor-pointer">
          {categoryTitle}
        </Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-primary">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Gallery */}
        <div className="space-y-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="aspect-[4/5] rounded-3xl overflow-hidden bg-white border border-outline-variant/10 shadow-lg"
          >
            <img 
              src={activeImage || product.image_url} 
              alt={product.name} 
              className="w-full h-full object-cover transition-all duration-300"
              referrerPolicy="no-referrer"
            />
          </motion.div>
          <div className="flex gap-4">
            <div 
              onClick={() => setActiveImage(product.image_url)}
              className={`w-24 h-24 rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${activeImage === product.image_url ? 'border-primary ring-2 ring-primary/20 scale-105' : 'border-transparent opacity-70 hover:opacity-100'}`}
            >
              <img 
                src={product.image_url} 
                alt="Main" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-col">
          <div className="mb-8">
            <div className="flex items-center gap-2 text-tertiary mb-4">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className={`w-4 h-4 ${i <= Math.round(ratingVal) ? 'fill-current text-tertiary' : 'text-outline-variant'}`} />
                ))}
              </div>
              <span className="text-sm font-bold">({ratingVal.toFixed(1)} / 5.0 Rating)</span>
            </div>
            <h1 className="text-5xl font-bold text-[#1A237E] mb-4">{product.name}</h1>
            <p className="text-3xl font-headline font-medium text-on-surface">${Number(product.price).toFixed(2)}</p>
          </div>

          <p className="text-on-surface-variant leading-relaxed mb-10 text-lg">
            {product.description || 'Không có mô tả chi tiết cho sản phẩm này.'}
          </p>

          {/* Options */}
          <div className="space-y-8 mb-12">
            {options.length > 0 && (
              <div>
                <p className="text-sm font-bold uppercase tracking-widest mb-4">
                  Option: <span className="text-primary">{selectedOption}</span>
                </p>
                <div className="flex gap-4">
                  {options.map((opt) => (
                    <button 
                      key={opt.name}
                      onClick={() => setSelectedOption(opt.name)}
                      className={`w-10 h-10 rounded-full border-2 transition-all ${selectedOption === opt.name ? 'border-primary ring-2 ring-primary/20 scale-110 shadow-md' : 'border-transparent opacity-80 hover:opacity-100'}`}
                      style={{ backgroundColor: opt.hex }}
                      title={opt.name}
                    />
                  ))}
                </div>
              </div>
            )}

            <div>
              <p className="text-sm font-bold uppercase tracking-widest mb-4">Quantity</p>
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-outline-variant rounded-full px-4 py-2">
                  <button 
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))} 
                    className="w-8 h-8 flex items-center justify-center hover:text-primary font-bold text-lg"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="1"
                    max={stock > 0 ? stock : 1}
                    value={quantity}
                    onChange={(e) => {
                      const val = Math.max(1, Math.min(stock > 0 ? stock : 1, Number(e.target.value) || 1));
                      setQuantity(val);
                    }}
                    className="w-14 text-center font-bold bg-transparent outline-none"
                  />
                  <button 
                    type="button"
                    onClick={() => setQuantity(stock > 0 ? Math.min(stock, quantity + 1) : 1)} 
                    className="w-8 h-8 flex items-center justify-center hover:text-primary font-bold text-lg"
                  >
                    +
                  </button>
                </div>
                <p className={`text-xs font-medium ${stock > 0 ? 'text-on-surface-variant' : 'text-red-600 font-bold'}`}>
                  {stock > 0 ? `Only ${stock} left in stock` : 'Out of stock'}
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 mb-12">
            <button 
              type="button"
              onClick={() => {
                if (!user) {
                  alert('Vui lòng đăng nhập tài khoản trước khi thêm sản phẩm vào giỏ hàng!');
                  navigate('/login');
                  return;
                }
                if (stock <= 0) {
                  alert('Sản phẩm hiện đang tạm hết hàng!');
                  return;
                }
                addToCart({
                  id: product.id,
                  name: product.name,
                  price: parseFloat(product.price),
                  image_url: product.image_url,
                  category_name: categoryTitle,
                  quantity: quantity,
                  color: selectedOption
                });
                alert('Đã thêm sản phẩm vào giỏ hàng thành công!');
              }}
              disabled={stock <= 0}
              className={`flex-1 py-5 rounded-full font-bold flex items-center justify-center gap-3 transition-all shadow-lg ${
                stock > 0
                  ? 'bg-primary text-on-primary hover:bg-primary-dim hover:scale-[1.02] active:scale-95 shadow-primary/20'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none'
              }`}
            >
              <ShoppingBag className="w-5 h-5" /> {stock > 0 ? 'Add to Bag' : 'Out of Stock'}
            </button>
            <button 
              type="button"
              onClick={toggleWishlist}
              className={`w-16 h-16 border-2 rounded-full flex items-center justify-center transition-all group ${isInWishlist ? 'border-primary text-primary' : 'border-outline-variant hover:border-tertiary hover:text-tertiary'}`}
            >
              <Heart className={`w-6 h-6 ${isInWishlist ? 'fill-current' : 'group-hover:fill-current'}`} />
            </button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-3 gap-4 py-8 border-y border-outline-variant/10">
            <div className="flex flex-col items-center text-center gap-2">
              <Truck className="w-5 h-5 text-primary" />
              <p className="text-[10px] font-bold uppercase tracking-tighter">Free Shipping</p>
            </div>
            <div className="flex flex-col items-center text-center gap-2">
              <RotateCcw className="w-5 h-5 text-primary" />
              <p className="text-[10px] font-bold uppercase tracking-tighter">30 Day Returns</p>
            </div>
            <div className="flex flex-col items-center text-center gap-2">
              <ShieldCheck className="w-5 h-5 text-primary" />
              <p className="text-[10px] font-bold uppercase tracking-tighter">Lifetime Warranty</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
