import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-surface-container-low border-t border-outline-variant/10">
      <div className="max-w-7xl mx-auto px-8 py-16 grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-6">
          <div className="text-2xl font-bold tracking-tighter text-[#1A237E] font-headline">The Atelier</div>
          <p className="text-on-surface-variant leading-relaxed text-sm max-w-xs">
            Curating meaningful tools for a digital world. Our studio celebrates the physical act of creation.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-4">
            <h4 className="font-bold text-sm uppercase tracking-widest text-primary">Guide</h4>
            <nav className="flex flex-col space-y-2 text-sm text-on-surface-variant">
              <Link to="#" className="hover:text-primary transition-colors">Shipping & Returns</Link>
              <Link to="#" className="hover:text-primary transition-colors">Privacy Policy</Link>
              <Link to="#" className="hover:text-primary transition-colors">Terms of Service</Link>
            </nav>
          </div>
          <div className="space-y-4">
            <h4 className="font-bold text-sm uppercase tracking-widest text-primary">Connect</h4>
            <nav className="flex flex-col space-y-2 text-sm text-on-surface-variant">
              <Link to="/contact" className="hover:text-primary transition-colors">Contact Us</Link>
              <Link to="/about" className="hover:text-primary transition-colors">About Us</Link>
              <Link to="/shop" className="hover:text-primary transition-colors">Wholesale</Link>
            </nav>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-8 py-8 border-t border-outline-variant/5 text-xs text-on-surface-variant">
        © 2024 The Tactile Digital Atelier. All rights reserved.
      </div>
    </footer>
  );
}
