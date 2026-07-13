import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ChevronRight, CreditCard, Truck, ShieldCheck, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { AlertCircle } from 'lucide-react';
import { validatePayment, maskCardNumber } from '../utils/paymentValidation';

export default function Checkout() {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const { cartItems, subtotal, shipping, total, clearCart } = useCart();
  const { user } = useAuth();
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const [paymentMethod, setPaymentMethod] = useState<'card' | 'momo'>('card');
  const [showMoMoModal, setShowMoMoModal] = useState(false);
  const [moMoOrderData, setMoMoOrderData] = useState<any>(null);
  const [momoCountdown, setMomoCountdown] = useState(899);

  useEffect(() => {
    let timer: any;
    if (showMoMoModal && momoCountdown > 0) {
      timer = setInterval(() => {
        setMomoCountdown(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [showMoMoModal, momoCountdown]);

  const formatCountdown = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const validateShippingInfo = () => {
    if (!firstName.trim() || !lastName.trim() || !address.trim() || !city.trim() || !postalCode.trim()) {
      setError('Please fill in all shipping information.');
      return false;
    }
    setError('');
    return true;
  };

  const validatePaymentInfo = () => {
    if (paymentMethod === 'momo') {
      setError('');
      return true;
    }
    if (!cardNumber.trim() || !expiryDate.trim() || !cvv.trim()) {
      setError('Please fill in all payment information.');
      return false;
    }

    const paymentError = validatePayment(expiryDate);
    if (paymentError) {
      setError(paymentError);
      return false;
    }

    setError('');
    return true;
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    if (!validateShippingInfo() || !validatePaymentInfo()) {
      return;
    }
    
    setIsProcessing(true);
    setError('');

    if (paymentMethod === 'momo') {
      try {
        const res = await fetch('/api/payment/momo/create-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount: total, cartItems })
        });
        const data = await res.json();
        setMoMoOrderData(data);
        setShowMoMoModal(true);
      } catch (err) {
        setError('Không thể kết nối cổng thanh toán MoMo.');
      } finally {
        setIsProcessing(false);
      }
      return;
    }

    await submitFinalOrder('Card');
  };

  const submitFinalOrder = async (method: string) => {
    setIsProcessing(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const items = cartItems.map(item => ({
        product_id: item.id,
        quantity: item.quantity,
        unit_price: item.price
      }));
      const shippingAddress = `${firstName} ${lastName}, ${address}, ${city}, ${postalCode}`;

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          total_amount: total,
          shipping_address: shippingAddress,
          payment_method: method === 'MoMo' ? 'Ví MoMo (QR Code Payment)' : maskCardNumber(cardNumber),
          payment_expiry: method === 'MoMo' ? 'MoMo' : expiryDate.trim(),
          items
        })
      });

      const data = await res.json();
      if (res.ok) {
        clearCart();
        setShowMoMoModal(false);
        navigate('/profile');
      } else {
        setError(data.error || 'Failed to place order.');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="pt-32 pb-24 max-w-7xl mx-auto px-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        {/* Main Checkout Flow */}
        <div className="lg:col-span-2">
          <div className="flex items-center gap-4 mb-12">
            <Link to="/cart" className="w-10 h-10 rounded-full border border-outline-variant/20 flex items-center justify-center hover:bg-white transition-all">
              <ArrowLeft className="w-5 h-5 text-on-surface-variant" />
            </Link>
            <h1 className="text-4xl font-bold text-[#1A237E]">Checkout</h1>
          </div>

          {/* Steps Indicator */}
          <div className="flex items-center gap-4 mb-12">
            <div className={`flex items-center gap-2 ${step >= 1 ? 'text-primary' : 'text-on-surface-variant'}`}>
              <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${step >= 1 ? 'bg-primary text-on-primary' : 'bg-surface-container-low'}`}>1</span>
              <span className="font-bold text-sm">Shipping</span>
            </div>
            <div className="h-px w-12 bg-outline-variant/20" />
            <div className={`flex items-center gap-2 ${step >= 2 ? 'text-primary' : 'text-on-surface-variant'}`}>
              <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${step >= 2 ? 'bg-primary text-on-primary' : 'bg-surface-container-low'}`}>2</span>
              <span className="font-bold text-sm">Payment</span>
            </div>
            <div className="h-px w-12 bg-outline-variant/20" />
            <div className={`flex items-center gap-2 ${step >= 3 ? 'text-primary' : 'text-on-surface-variant'}`}>
              <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${step >= 3 ? 'bg-primary text-on-primary' : 'bg-surface-container-low'}`}>3</span>
              <span className="font-bold text-sm">Review</span>
            </div>
          </div>

          {step === 1 && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-primary">First Name</label>
                  <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="Julianne" className="w-full px-6 py-4 rounded-2xl bg-white border border-outline-variant/10 focus:ring-2 focus:ring-primary/20 transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-primary">Last Name</label>
                  <input type="text" value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Moore" className="w-full px-6 py-4 rounded-2xl bg-white border border-outline-variant/10 focus:ring-2 focus:ring-primary/20 transition-all" />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-primary">Shipping Address</label>
                  <input type="text" value={address} onChange={e => setAddress(e.target.value)} placeholder="123 Creative Way" className="w-full px-6 py-4 rounded-2xl bg-white border border-outline-variant/10 focus:ring-2 focus:ring-primary/20 transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-primary">City</label>
                  <input type="text" value={city} onChange={e => setCity(e.target.value)} placeholder="Brooklyn" className="w-full px-6 py-4 rounded-2xl bg-white border border-outline-variant/10 focus:ring-2 focus:ring-primary/20 transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-primary">Postal Code</label>
                  <input type="text" value={postalCode} onChange={e => setPostalCode(e.target.value)} placeholder="11211" className="w-full px-6 py-4 rounded-2xl bg-white border border-outline-variant/10 focus:ring-2 focus:ring-primary/20 transition-all" />
                </div>
              </div>
              <button 
                onClick={() => { if (validateShippingInfo()) setStep(2); }}
                className="w-full sm:w-auto px-12 py-5 bg-primary text-on-primary rounded-full font-bold flex items-center justify-center gap-3 hover:bg-primary-dim transition-all hover:scale-[1.02]"
              >
                Continue to Payment <ChevronRight className="w-5 h-5" />
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-8"
            >
              <div className="space-y-4">
                {/* Option 1: Credit or Debit Card */}
                <div 
                  onClick={() => setPaymentMethod('card')}
                  className={`p-6 rounded-3xl border-2 flex items-center justify-between cursor-pointer transition-all ${paymentMethod === 'card' ? 'bg-white border-primary shadow-lg shadow-primary/10' : 'bg-surface border-outline-variant/20 hover:bg-white'}`}
                >
                  <div className="flex items-center gap-4">
                    <CreditCard className={`w-6 h-6 ${paymentMethod === 'card' ? 'text-primary' : 'text-on-surface-variant'}`} />
                    <div>
                      <p className="font-bold text-on-surface">Credit or Debit Card</p>
                      <p className="text-xs text-on-surface-variant">Secure encrypted payment</p>
                    </div>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'card' ? 'border-primary' : 'border-outline-variant/40'}`}>
                    {paymentMethod === 'card' && <div className="w-3 h-3 rounded-full bg-primary" />}
                  </div>
                </div>

                {/* Option 2: MoMo QR E-Wallet Payment */}
                <div 
                  onClick={() => setPaymentMethod('momo')}
                  className={`p-6 rounded-3xl border-2 flex items-center justify-between cursor-pointer transition-all ${paymentMethod === 'momo' ? 'bg-[#AE2070]/5 border-[#AE2070] shadow-lg shadow-[#AE2070]/10' : 'bg-surface border-outline-variant/20 hover:bg-white'}`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-2xl bg-[#AE2070] flex items-center justify-center font-black text-white tracking-tighter shadow-md shadow-[#AE2070]/30 text-base shrink-0">
                      MoMo
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-bold text-on-surface">Thanh toán qua Ví MoMo</p>
                        <span className="px-2.5 py-0.5 bg-[#AE2070]/10 text-[#AE2070] rounded-full text-[11px] font-bold uppercase tracking-wider">
                          QR Code • Nhanh & Bảo Mật
                        </span>
                      </div>
                      <p className="text-xs text-on-surface-variant mt-0.5">Quét mã QR bằng ứng dụng MoMo trên điện thoại</p>
                    </div>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${paymentMethod === 'momo' ? 'border-[#AE2070]' : 'border-outline-variant/40'}`}>
                    {paymentMethod === 'momo' && <div className="w-3 h-3 rounded-full bg-[#AE2070]" />}
                  </div>
                </div>

                {/* PayPal (Disabled) */}
                <div className="p-6 bg-surface-container-low rounded-3xl border border-outline-variant/10 flex items-center justify-between opacity-60 cursor-not-allowed">
                  <div className="flex items-center gap-4">
                    <img src="https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_37x23.jpg" alt="PayPal" className="h-5" />
                    <div>
                      <p className="font-bold text-on-surface">PayPal</p>
                      <p className="text-xs text-on-surface-variant">Coming soon to the Atelier</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Inputs */}
              {paymentMethod === 'card' && (
                <div className="space-y-6 animate-fade-in">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-primary">Card Number</label>
                    <input type="text" value={cardNumber} onChange={e => setCardNumber(e.target.value)} placeholder="•••• •••• •••• ••••" className="w-full px-6 py-4 rounded-2xl bg-white border border-outline-variant/10 focus:ring-2 focus:ring-primary/20 transition-all" />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-primary">Expiry Date</label>
                      <input type="text" value={expiryDate} onChange={e => setExpiryDate(e.target.value)} maxLength={5} placeholder="MM/YY" className="w-full px-6 py-4 rounded-2xl bg-white border border-outline-variant/10 focus:ring-2 focus:ring-primary/20 transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-primary">CVV</label>
                      <input type="text" value={cvv} onChange={e => setCvv(e.target.value)} maxLength={4} placeholder="•••" className="w-full px-6 py-4 rounded-2xl bg-white border border-outline-variant/10 focus:ring-2 focus:ring-primary/20 transition-all" />
                    </div>
                  </div>
                </div>
              )}

              {/* MoMo Helper Notice */}
              {paymentMethod === 'momo' && (
                <div className="p-6 bg-[#AE2070]/5 border border-[#AE2070]/20 rounded-3xl animate-fade-in space-y-3">
                  <div className="flex items-center gap-2 font-bold text-sm text-[#AE2070]">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#AE2070] animate-pulse" />
                    Quy trình thanh toán MoMo API v2
                  </div>
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    Sau khi nhấn <strong>Review Order</strong> và xác nhận đơn hàng ở bước tiếp theo, cổng thanh toán <strong>MoMo Payment Gateway</strong> sẽ hiển thị Mã QR chính thức. Bạn chỉ cần mở App MoMo để quét mã hoàn tất đơn hàng trong tích tắc.
                  </p>
                </div>
              )}

              {error && (
                <div className="p-4 bg-red-50 text-red-600 rounded-2xl flex items-center gap-3 text-sm font-bold">
                  <AlertCircle className="w-5 h-5" /> {error}
                </div>
              )}

              <div className="flex gap-4">
                <button 
                  onClick={() => setStep(1)}
                  className="px-8 py-5 border-2 border-outline-variant text-on-surface-variant rounded-full font-bold hover:bg-surface transition-all"
                >
                  Back
                </button>
                <button 
                  onClick={() => { if (validatePaymentInfo()) setStep(3); }}
                  className="flex-1 py-5 bg-primary text-on-primary rounded-full font-bold flex items-center justify-center gap-3 hover:bg-primary-dim transition-all hover:scale-[1.02]"
                >
                  Review Order <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-8"
            >
              <div className="p-8 bg-white rounded-[2.5rem] border border-outline-variant/10 space-y-8">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg text-[#1A237E] mb-2">Shipping To</h3>
                    <p className="text-on-surface-variant text-sm">{firstName} {lastName}</p>
                    <p className="text-on-surface-variant text-sm">{address}, {city} {postalCode}</p>
                  </div>
                  <button onClick={() => setStep(1)} className="text-xs font-bold text-primary uppercase tracking-widest hover:underline">Edit</button>
                </div>
                <div className="h-px bg-outline-variant/10" />
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg text-[#1A237E] mb-2">Payment Method</h3>
                    {paymentMethod === 'momo' ? (
                      <div className="flex items-center gap-2 text-[#AE2070] font-bold text-sm">
                        <span className="px-2.5 py-1 bg-[#AE2070] text-white rounded-lg text-xs font-black tracking-tight shadow-sm">MoMo</span>
                        <span>Ví MoMo (QR Code Payment) • Thanh toán nhanh</span>
                      </div>
                    ) : (
                      <p className="text-on-surface-variant text-sm">{maskCardNumber(cardNumber)} • Expires {expiryDate}</p>
                    )}
                  </div>
                  <button onClick={() => setStep(2)} className="text-xs font-bold text-primary uppercase tracking-widest hover:underline">Edit</button>
                </div>
              </div>

              {error && (
                <div className="p-4 bg-red-50 text-red-600 rounded-2xl flex items-center gap-3 text-sm font-bold">
                  <AlertCircle className="w-5 h-5" /> {error}
                </div>
              )}
              
              <button 
                onClick={handleCheckout}
                disabled={isProcessing}
                className="w-full py-6 bg-primary text-on-primary rounded-full font-bold text-xl flex items-center justify-center gap-3 hover:bg-primary-dim transition-all hover:scale-[1.02] shadow-2xl shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? 'Processing...' : 'Complete Purchase'} <CheckCircle2 className="w-6 h-6" />
              </button>
            </motion.div>
          )}
        </div>

        {/* Order Summary Sidebar */}
        <div className="space-y-8">
          <div className="bg-white rounded-[2.5rem] p-10 border border-outline-variant/10 shadow-xl shadow-primary/5">
            <h2 className="text-2xl font-bold text-[#1A237E] mb-8">Order Summary</h2>
            
            <div className="space-y-6 mb-8 text-center text-on-surface-variant">
              {cartItems.length === 0 ? "Your cart is empty." : (
                <div className="space-y-6 text-left">
                  {cartItems.map(item => (
                    <div key={item.id} className="flex gap-4">
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-surface shrink-0">
                        <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-sm text-on-surface">{item.name}</p>
                        <p className="text-xs text-on-surface-variant">Qty: {item.quantity} • {item.color}</p>
                        <p className="text-sm font-bold text-primary mt-1">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-4 pt-8 border-t border-outline-variant/10">
              <div className="flex justify-between text-on-surface-variant text-sm">
                <span>Subtotal</span>
                <span className="font-bold text-on-surface">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-on-surface-variant text-sm">
                <span>Shipping</span>
                <span className="font-bold text-secondary">{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div className="pt-4 flex justify-between items-end">
                <span className="text-lg font-bold">Total</span>
                <span className="text-2xl font-headline font-bold text-primary">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 text-on-surface-variant">
              <ShieldCheck className="w-5 h-5 text-secondary" />
              <p className="text-xs font-medium">Secure SSL Encrypted Checkout</p>
            </div>
            <div className="flex items-center gap-3 text-on-surface-variant">
              <Truck className="w-5 h-5 text-secondary" />
              <p className="text-xs font-medium">Archival-grade protective packaging</p>
            </div>
          </div>
        </div>
      </div>

      {/* MoMo QR Payment Gateway Modal */}
      {showMoMoModal && moMoOrderData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-fade-in overflow-y-auto">
          <div className="bg-white rounded-[2.5rem] max-w-2xl w-full overflow-hidden shadow-2xl border border-outline-variant/20 my-auto">
            {/* MoMo Header Band */}
            <div className="bg-[#AE2070] text-white p-6 md:p-8 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white text-[#AE2070] font-black text-lg flex items-center justify-center shadow-lg tracking-tighter">
                  MoMo
                </div>
                <div>
                  <h3 className="font-bold text-xl tracking-tight">Cổng Thanh Toán MoMo v2</h3>
                  <p className="text-xs text-white/80">Quét mã QR Code bằng ứng dụng MoMo</p>
                </div>
              </div>
              <div className="text-right hidden sm:block">
                <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-bold tracking-wider uppercase">
                  Mã đơn: #{moMoOrderData.orderId}
                </span>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              {/* Left Column: Order Info */}
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="pb-4 border-b border-outline-variant/10">
                    <p className="text-xs text-on-surface-variant uppercase tracking-wider font-bold mb-1">Nhà Cung Cấp</p>
                    <p className="font-bold text-lg text-[#1A237E]">The Atelier Vietnam</p>
                  </div>
                  <div className="pb-4 border-b border-outline-variant/10">
                    <p className="text-xs text-on-surface-variant uppercase tracking-wider font-bold mb-1">Tổng Tiền Thanh Toán</p>
                    <p className="text-3xl font-black text-[#AE2070]">
                      {Number(moMoOrderData.amount).toLocaleString('vi-VN')} <span className="text-lg">VND</span>
                    </p>
                    <p className="text-xs text-on-surface-variant mt-0.5">({total.toFixed(2)} USD)</p>
                  </div>
                  <div>
                    <p className="text-xs text-on-surface-variant uppercase tracking-wider font-bold mb-1">Nội Dung Thanh Toán</p>
                    <p className="text-sm font-medium text-on-surface bg-surface-container-low p-3 rounded-xl border border-outline-variant/10 break-all">
                      {moMoOrderData.orderInfo}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3.5 bg-red-50 text-red-700 rounded-xl text-xs font-bold border border-red-100">
                  <span>⏳ Thời gian còn lại:</span>
                  <span className="font-mono text-sm">{formatCountdown(momoCountdown)}</span>
                </div>
              </div>

              {/* Right Column: QR Scanner */}
              <div className="flex flex-col items-center justify-center p-6 bg-surface-container-low rounded-3xl border-2 border-dashed border-[#AE2070]/30 space-y-4 text-center">
                <div className="bg-white p-3.5 rounded-2xl shadow-xl border border-[#AE2070]/20 relative group">
                  <img 
                    src={moMoOrderData.qrCodeUrl} 
                    alt="MoMo QR Code" 
                    className="w-48 h-48 object-contain mx-auto"
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 rounded-2xl text-white text-xs font-bold p-2">
                    Quét bằng App MoMo
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-on-surface">Sử dụng App MoMo để quét mã</p>
                  <p className="text-[11px] text-on-surface-variant">Hỗ trợ thanh toán nhanh chóng & bảo mật 100%</p>
                </div>
              </div>
            </div>

            {/* Modal Actions / Sandbox Simulation */}
            <div className="p-6 md:p-8 bg-surface border-t border-outline-variant/10 flex flex-col sm:flex-row gap-4 justify-end items-center">
              <button
                type="button"
                onClick={() => setShowMoMoModal(false)}
                disabled={isProcessing}
                className="w-full sm:w-auto px-6 py-4 rounded-full font-bold text-on-surface-variant hover:bg-white border border-outline-variant/20 transition-all text-sm"
              >
                Hủy / Đổi Phương Thức
              </button>
              <button
                type="button"
                onClick={() => submitFinalOrder('MoMo')}
                disabled={isProcessing}
                className="w-full sm:w-auto px-8 py-4 bg-[#AE2070] text-white rounded-full font-bold hover:bg-[#961860] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#AE2070]/25 text-sm hover:scale-[1.02]"
              >
                {isProcessing ? 'Đang Xử Lý...' : 'Đã Quét Mã & Xác Nhận Thanh Toán'} <CheckCircle2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
