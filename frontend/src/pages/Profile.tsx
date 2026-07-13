import { useState, useEffect, type FormEvent } from 'react';
import { motion } from 'motion/react';
import { User, Package, Heart, Settings, LogOut, ChevronRight, MapPin, CreditCard, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { validatePayment, maskCardNumber } from '../utils/paymentValidation';

interface AddressItem {
  id: number;
  recipientName: string;
  phone: string;
  detail: string;
  city: string;
  postalCode: string;
  isDefault: boolean;
}

interface PaymentMethod {
  id: number;
  cardholderName: string;
  cardNumber: string;
  expiry: string;
  isDefault: boolean;
}

const ADDRESS_STORAGE_KEY = 'profileAddresses';
const PAYMENT_STORAGE_KEY = 'profilePaymentMethods';

export default function Profile() {
  const { user, logout } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'orders' | 'wishlist' | 'addresses' | 'payments' | 'settings'>('orders');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({ fullName: user?.full_name || '', password: '' });
  const [addresses, setAddresses] = useState<AddressItem[]>(() => {
    const saved = localStorage.getItem(ADDRESS_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });
  const [addressForm, setAddressForm] = useState({ recipientName: '', phone: '', detail: '', city: '', postalCode: '' });
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(() => {
    const saved = localStorage.getItem(PAYMENT_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });
  const [paymentForm, setPaymentForm] = useState({ cardholderName: '', cardNumber: '', expiry: '', cvv: '' });
  const [paymentError, setPaymentError] = useState('');

  useEffect(() => {
    localStorage.setItem(ADDRESS_STORAGE_KEY, JSON.stringify(addresses));
  }, [addresses]);

  useEffect(() => {
    localStorage.setItem(PAYMENT_STORAGE_KEY, JSON.stringify(paymentMethods));
  }, [paymentMethods]);

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await fetch('/api/orders', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) setOrders(await res.json());
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      }
    };

    const fetchWishlist = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await fetch('/api/wishlists', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) setWishlist(await res.json());
      } catch (error) {
        console.error('Failed to fetch wishlist:', error);
      }
    };

    fetchOrders();
    fetchWishlist();
  }, [user]);

  const handleUpdateProfile = async (e: FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          fullName: profileForm.fullName,
          password: profileForm.password
        })
      });
      if (res.ok) {
        alert('Profile updated successfully! Please log out and log in again to see changes.');
        setIsEditingProfile(false);
        setProfileForm({ ...profileForm, password: '' });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddAddress = (e: FormEvent) => {
    e.preventDefault();
    const newAddress: AddressItem = {
      id: Date.now(),
      ...addressForm,
      isDefault: addresses.length === 0
    };
    setAddresses([...addresses, newAddress]);
    setAddressForm({ recipientName: '', phone: '', detail: '', city: '', postalCode: '' });
  };

  const handleSetDefaultAddress = (id: number) => {
    setAddresses(addresses.map(address => ({ ...address, isDefault: address.id === id })));
  };

  const handleDeleteAddress = (id: number) => {
    const nextAddresses = addresses.filter(address => address.id !== id);
    if (nextAddresses.length > 0 && !nextAddresses.some(address => address.isDefault)) {
      nextAddresses[0].isDefault = true;
    }
    setAddresses(nextAddresses);
  };

  const handleAddPaymentMethod = (e: FormEvent) => {
    e.preventDefault();
    const expiryError = validatePayment(paymentForm.expiry);
    if (expiryError) {
      setPaymentError(expiryError);
      return;
    }

    const newPaymentMethod: PaymentMethod = {
      id: Date.now(),
      cardholderName: paymentForm.cardholderName,
      cardNumber: paymentForm.cardNumber,
      expiry: paymentForm.expiry.trim(),
      isDefault: paymentMethods.length === 0
    };

    setPaymentMethods([...paymentMethods, newPaymentMethod]);
    setPaymentForm({ cardholderName: '', cardNumber: '', expiry: '', cvv: '' });
    setPaymentError('');
  };

  const handleSetDefaultPayment = (id: number) => {
    setPaymentMethods(paymentMethods.map(method => ({ ...method, isDefault: method.id === id })));
  };

  const handleDeletePayment = (id: number) => {
    const nextMethods = paymentMethods.filter(method => method.id !== id);
    if (nextMethods.length > 0 && !nextMethods.some(method => method.isDefault)) {
      nextMethods[0].isDefault = true;
    }
    setPaymentMethods(nextMethods);
  };

  const removeWishlistItem = async (productId: number) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`/api/wishlists/${productId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) setWishlist(wishlist.filter(product => product.id !== productId));
  };

  const menuItems = [
    { id: 'orders', icon: Package, label: 'My Orders' },
    { id: 'wishlist', icon: Heart, label: 'Wishlist' },
    { id: 'addresses', icon: MapPin, label: 'Addresses' },
    { id: 'payments', icon: CreditCard, label: 'Payment Methods' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ] as const;

  return (
    <div className="pt-32 pb-24 max-w-7xl mx-auto px-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-16">
        <div className="lg:col-span-1 space-y-8">
          <div className="flex flex-col items-center text-center p-8 bg-white rounded-[2.5rem] border border-outline-variant/10">
            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-4 overflow-hidden border-4 border-white shadow-lg">
              <User className="w-12 h-12 text-primary" />
            </div>
            <h2 className="text-xl font-bold text-on-surface">{user?.full_name}</h2>
            <p className="text-sm text-on-surface-variant mb-6">{user?.email}</p>
            <button onClick={() => setActiveTab('settings')} className="w-full py-3 rounded-full border border-outline-variant text-sm font-bold hover:bg-surface transition-all">
              Edit Profile
            </button>
          </div>

          <nav className="space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${activeTab === item.id ? 'bg-primary text-on-primary shadow-lg shadow-primary/20' : 'hover:bg-white text-on-surface-variant hover:text-primary'}`}
              >
                <div className="flex items-center gap-4">
                  <item.icon className="w-5 h-5" />
                  <span className="font-bold text-sm">{item.label}</span>
                </div>
                <ChevronRight className={`w-4 h-4 ${activeTab === item.id ? 'opacity-100' : 'opacity-0'}`} />
              </button>
            ))}
            <button onClick={logout} className="w-full flex items-center gap-4 p-4 rounded-2xl text-tertiary hover:bg-tertiary/5 transition-all mt-8">
              <LogOut className="w-5 h-5" />
              <span className="font-bold text-sm">Log Out</span>
            </button>
          </nav>
        </div>

        <div className="lg:col-span-3 space-y-12">
          {activeTab === 'orders' && (
            <div>
              <h1 className="text-4xl font-bold text-[#1A237E] mb-8">Recent Orders</h1>
              <div className="space-y-4">
                {orders.length === 0 && <p className="text-on-surface-variant">You have no recent orders.</p>}
                {orders.map((order) => (
                  <motion.div key={order.id} whileHover={{ x: 10 }} className="flex items-center justify-between p-6 bg-white rounded-3xl border border-outline-variant/10 cursor-pointer group">
                    <div className="flex items-center gap-6">
                      <div className="w-12 h-12 bg-surface rounded-2xl flex items-center justify-center">
                        <Package className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-bold text-on-surface">Order #{order.id}</h4>
                        <p className="text-xs text-on-surface-variant">{new Date(order.created_at).toLocaleDateString()}</p>
                        {order.payment_method && <p className="text-xs text-on-surface-variant">{order.payment_method} • Expires {order.payment_expiry}</p>}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-on-surface">${Number(order.total_amount).toFixed(2)}</p>
                      <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full ${order.status === 'delivered' ? 'bg-secondary/10 text-secondary' : 'bg-primary/10 text-primary'}`}>
                        {order.status}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'wishlist' && (
            <div>
              <h1 className="text-4xl font-bold text-[#1A237E] mb-8">Wishlist</h1>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {wishlist.length === 0 ? (
                  <p className="text-on-surface-variant col-span-2">Your wishlist is empty.</p>
                ) : (
                  wishlist.map(product => (
                    <div key={product.id} className="flex gap-4 p-4 border border-outline-variant/10 rounded-2xl bg-white shadow-sm">
                      <img src={product.image_url} alt={product.name} className="w-20 h-20 object-cover rounded-xl" />
                      <div className="flex-1">
                        <h4 className="font-bold text-on-surface line-clamp-1">{product.name}</h4>
                        <p className="text-primary font-bold mb-2">${product.price}</p>
                        <div className="flex gap-3 text-xs font-bold">
                          <Link to={`/product/${product.id}`} className="text-primary hover:underline">View Product</Link>
                          <button onClick={() => removeWishlistItem(product.id)} className="text-red-500 hover:text-red-700">Remove</button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'addresses' && (
            <div className="space-y-8">
              <h1 className="text-4xl font-bold text-[#1A237E]">Addresses</h1>
              <form onSubmit={handleAddAddress} className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white rounded-3xl p-6 border border-outline-variant/10">
                <input required value={addressForm.recipientName} onChange={e => setAddressForm({ ...addressForm, recipientName: e.target.value })} placeholder="Recipient name" className="px-4 py-3 rounded-xl border border-outline-variant/20" />
                <input required value={addressForm.phone} onChange={e => setAddressForm({ ...addressForm, phone: e.target.value })} placeholder="Phone" className="px-4 py-3 rounded-xl border border-outline-variant/20" />
                <input required value={addressForm.detail} onChange={e => setAddressForm({ ...addressForm, detail: e.target.value })} placeholder="Address detail" className="md:col-span-2 px-4 py-3 rounded-xl border border-outline-variant/20" />
                <input required value={addressForm.city} onChange={e => setAddressForm({ ...addressForm, city: e.target.value })} placeholder="City" className="px-4 py-3 rounded-xl border border-outline-variant/20" />
                <input required value={addressForm.postalCode} onChange={e => setAddressForm({ ...addressForm, postalCode: e.target.value })} placeholder="Postal code" className="px-4 py-3 rounded-xl border border-outline-variant/20" />
                <button className="md:col-span-2 py-3 rounded-full bg-primary text-on-primary font-bold">Add Address</button>
              </form>
              <div className="space-y-4">
                {addresses.length === 0 && <p className="text-on-surface-variant">No saved addresses.</p>}
                {addresses.map(address => (
                  <div key={address.id} className="p-6 bg-white rounded-3xl border border-outline-variant/10 flex justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <p className="font-bold">{address.recipientName}</p>
                        {address.isDefault && <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-1 rounded-full">DEFAULT</span>}
                      </div>
                      <p className="text-sm text-on-surface-variant">{address.phone}</p>
                      <p className="text-sm text-on-surface-variant">{address.detail}, {address.city}, {address.postalCode}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      {!address.isDefault && <button onClick={() => handleSetDefaultAddress(address.id)} className="text-xs font-bold text-primary">Set default</button>}
                      <button onClick={() => handleDeleteAddress(address.id)} className="text-red-500"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'payments' && (
            <div className="space-y-8">
              <h1 className="text-4xl font-bold text-[#1A237E]">Payment Methods</h1>
              <form onSubmit={handleAddPaymentMethod} className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white rounded-3xl p-6 border border-outline-variant/10">
                <input required value={paymentForm.cardholderName} onChange={e => setPaymentForm({ ...paymentForm, cardholderName: e.target.value })} placeholder="Cardholder name" className="px-4 py-3 rounded-xl border border-outline-variant/20" />
                <input required value={paymentForm.cardNumber} onChange={e => setPaymentForm({ ...paymentForm, cardNumber: e.target.value })} placeholder="Card number" className="px-4 py-3 rounded-xl border border-outline-variant/20" />
                <input required maxLength={5} value={paymentForm.expiry} onChange={e => setPaymentForm({ ...paymentForm, expiry: e.target.value })} placeholder="MM/YY" className="px-4 py-3 rounded-xl border border-outline-variant/20" />
                <input required maxLength={4} value={paymentForm.cvv} onChange={e => setPaymentForm({ ...paymentForm, cvv: e.target.value })} placeholder="CVV" className="px-4 py-3 rounded-xl border border-outline-variant/20" />
                {paymentError && <p className="md:col-span-2 text-sm font-bold text-red-600">{paymentError}</p>}
                <button className="md:col-span-2 py-3 rounded-full bg-primary text-on-primary font-bold">Add Payment Method</button>
              </form>
              <div className="space-y-4">
                {paymentMethods.length === 0 && <p className="text-on-surface-variant">No saved payment methods.</p>}
                {paymentMethods.map(method => (
                  <div key={method.id} className="p-6 bg-white rounded-3xl border border-outline-variant/10 flex justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <CreditCard className="w-5 h-5 text-primary" />
                        <p className="font-bold">{maskCardNumber(method.cardNumber)}</p>
                        {method.isDefault && <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-1 rounded-full">DEFAULT</span>}
                      </div>
                      <p className="text-sm text-on-surface-variant">{method.cardholderName}</p>
                      <p className="text-sm text-on-surface-variant">Expires {method.expiry}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      {!method.isDefault && <button onClick={() => handleSetDefaultPayment(method.id)} className="text-xs font-bold text-primary">Set default</button>}
                      <button onClick={() => handleDeletePayment(method.id)} className="text-red-500"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-8">
              <h1 className="text-4xl font-bold text-[#1A237E]">Settings</h1>
              <div className="bg-white rounded-3xl p-8 border border-outline-variant/10">
                <h2 className="text-2xl font-bold text-[#1A237E] mb-6">Edit Profile & Password</h2>
                <form onSubmit={handleUpdateProfile} className="space-y-4 max-w-xl">
                  <input type="text" value={profileForm.fullName} onChange={e => setProfileForm({ ...profileForm, fullName: e.target.value })} placeholder="Full Name" className="w-full px-4 py-3 border border-outline-variant/20 rounded-xl" />
                  <input type="password" value={profileForm.password} onChange={e => setProfileForm({ ...profileForm, password: e.target.value })} placeholder="New Password (optional)" className="w-full px-4 py-3 border border-outline-variant/20 rounded-xl" />
                  <button type="submit" className="px-8 py-3 rounded-full bg-primary text-on-primary font-bold">Save Changes</button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
