import { motion } from 'motion/react';
import { Trash2, Plus, Minus, ArrowRight, CreditCard, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const { cartItems, updateQuantity, removeFromCart, subtotal, tax, shipping, total } = useCart();

  return (
    <div className="pt-32 pb-24 max-w-7xl mx-auto px-8">
      <h1 className="text-5xl font-bold text-[#1A237E] mb-12">Your Shopping Bag</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        {/* Items List */}
        <div className="lg:col-span-2 space-y-8">
          {cartItems.map((item) => (
            <motion.div 
              layout
              key={item.id} 
              className="flex gap-8 p-6 bg-white rounded-3xl border border-outline-variant/10"
            >
              <div className="w-32 h-32 rounded-2xl overflow-hidden bg-surface">
                <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <div className="flex-1 flex flex-col justify-between">
                <div className="flex justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-on-surface mb-1">{item.name}</h3>
                    <p className="text-sm text-on-surface-variant">Color: <span className="font-bold text-primary">{item.color}</span></p>
                  </div>
                  <p className="text-xl font-headline font-semibold">${item.price.toFixed(2)}</p>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center border border-outline-variant rounded-full px-3 py-1">
                    <button onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))} className="p-1 hover:text-primary"><Minus className="w-4 h-4" /></button>
                    <span className="w-10 text-center font-bold text-sm">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1 hover:text-primary"><Plus className="w-4 h-4" /></button>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} className="text-on-surface-variant hover:text-tertiary transition-colors flex items-center gap-2 text-sm font-bold">
                    <Trash2 className="w-4 h-4" /> Remove
                  </button>
                </div>
              </div>
            </motion.div>
          ))}

          <div className="p-8 bg-secondary-container/30 rounded-3xl flex items-center gap-6">
            <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center text-on-primary">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <p className="font-bold text-secondary">You've unlocked Free Shipping!</p>
              <p className="text-sm text-secondary/70">Studio orders over $100 qualify for complimentary archival shipping.</p>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="space-y-8">
          <div className="bg-white rounded-[2.5rem] p-10 border border-outline-variant/10 shadow-xl shadow-primary/5">
            <h2 className="text-2xl font-bold text-[#1A237E] mb-8">Order Summary</h2>
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-on-surface-variant">
                <span>Subtotal</span>
                <span className="font-bold text-on-surface">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-on-surface-variant">
                <span>Shipping</span>
                <span className="font-bold text-secondary">{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between text-on-surface-variant">
                <span>Estimated Tax</span>
                <span className="font-bold text-on-surface">${tax.toFixed(2)}</span>
              </div>
              <div className="pt-4 border-t border-outline-variant/10 flex justify-between items-end">
                <span className="text-xl font-bold">Total</span>
                <span className="text-3xl font-headline font-bold text-primary">${total.toFixed(2)}</span>
              </div>
            </div>

            <Link to="/checkout" className="w-full bg-primary text-on-primary py-5 rounded-full font-bold flex items-center justify-center gap-3 hover:bg-primary-dim transition-all hover:scale-[1.02] active:scale-95">
              Proceed to Checkout <ArrowRight className="w-5 h-5" />
            </Link>

            <div className="mt-8 flex items-center justify-center gap-4 opacity-40 grayscale">
              <CreditCard className="w-6 h-6" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Secure Encrypted Checkout</span>
            </div>
          </div>

          <div className="p-8 bg-surface-container-low rounded-3xl">
            <h4 className="font-bold text-sm mb-4">Studio Notes</h4>
            <textarea 
              placeholder="Add a gift message or special instructions..." 
              className="w-full h-24 bg-white border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-primary/20 resize-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
