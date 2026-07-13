import { motion } from 'motion/react';
import { ArrowRight, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function Home() {
  const [categories, setCategories] = useState<any[]>([]);
  const [essentials, setEssentials] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/categories').then(res => res.json()).then(data => setCategories(data));
    fetch('/api/products').then(res => res.json()).then(data => setEssentials(data));
  }, []);
  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative h-[85vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?auto=format&fit=crop&q=80&w=2000"
            alt="Hero Background"
            className="w-full h-full object-cover scale-105"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/40 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-8 w-full">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-2xl"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-6">
              Spring Collection 2024
            </span>
            <h1 className="text-7xl font-bold text-[#1A237E] mb-8 leading-[1.1]">
              The Art of <br />
              <span className="editorial-gradient italic">Thoughtful Writing</span>
            </h1>
            <p className="text-xl text-on-surface-variant mb-10 leading-relaxed max-w-lg">
              Curating archival-grade tools for the modern studio. Elevate your daily rituals with our handcrafted stationery.
            </p>
            <div className="flex items-center gap-6">
              <Link to="/shop" className="px-8 py-4 bg-primary text-on-primary rounded-full font-bold hover:bg-primary-dim transition-all hover:scale-105 flex items-center gap-2">
                Shop The Atelier <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/about" className="px-8 py-4 border-2 border-primary text-primary rounded-full font-bold hover:bg-primary/5 transition-all">
                Our Philosophy
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-24 max-w-7xl mx-auto px-8">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-4xl font-bold text-[#1A237E] mb-4">Curated Collections</h2>
            <p className="text-on-surface-variant">Explore our specialized studio departments.</p>
          </div>
          <Link to="/shop" className="text-primary font-bold flex items-center gap-2 group">
            View All <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((cat, idx) => (
            <Link key={cat.name} to={`/shop?category=${encodeURIComponent(cat.name)}`} className="block">
              <motion.div
                whileHover={{ y: -10 }}
                className="relative group cursor-pointer overflow-hidden rounded-3xl aspect-[4/5]"
              >
                <img
                  src={cat.image_url}
                  alt={cat.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-8 left-8 right-8 text-white">
                  <p className="text-xs font-bold uppercase tracking-widest mb-2 opacity-80">{cat.count || 0} Items</p>
                  <h3 className="text-2xl font-bold">{cat.name}</h3>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </section>

      {/* Essentials Section */}
      <section className="py-24 bg-surface-container-low">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#1A237E] mb-4">Studio Essentials</h2>
            <p className="text-on-surface-variant max-w-xl mx-auto">The foundational tools every creative workspace requires for meaningful output.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {essentials.map((item) => (
              <Link to={`/product/${item.id}`} key={item.id} className="group">
                <div className="relative aspect-square rounded-2xl overflow-hidden mb-4 bg-white">
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <button className="absolute bottom-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                    <ArrowRight className="w-5 h-5 text-primary" />
                  </button>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between items-start">
                    <p className="text-xs font-bold text-primary uppercase tracking-widest">{item.category_name}</p>
                    <div className="flex items-center gap-1 text-tertiary">
                      <Star className="w-3 h-3 fill-current" />
                      <span className="text-[10px] font-bold">4.9</span>
                    </div>
                  </div>
                  <h3 className="font-bold text-lg group-hover:text-primary transition-colors">{item.name}</h3>
                  <p className="text-on-surface-variant font-medium">${item.price}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-24 max-w-7xl mx-auto px-8">
        <div className="bg-[#1A237E] rounded-[3rem] p-16 relative overflow-hidden flex flex-col items-center text-center">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-white blur-[100px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-primary blur-[100px]" />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative z-10 max-w-2xl"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Join The Atelier Journal</h2>
            <p className="text-white/70 text-lg mb-10 leading-relaxed">
              Receive monthly insights on creative rituals, exclusive early access to archival drops, and studio updates.
            </p>
            <form className="flex flex-col sm:flex-row gap-4 w-full">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-8 py-4 rounded-full bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/30"
              />
              <button className="px-10 py-4 bg-white text-[#1A237E] rounded-full font-bold hover:bg-white/90 transition-all hover:scale-105">
                Subscribe
              </button>
            </form>
            <p className="text-white/40 text-xs mt-6">By subscribing, you agree to our Privacy Policy and Terms of Service.</p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
