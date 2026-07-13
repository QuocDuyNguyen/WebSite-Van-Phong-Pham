import React, { useState } from 'react';
import { Mail, Lock, User, ArrowRight, AlertCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok) {
        login(data.token, data.user);
        navigate('/profile');
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('Network error');
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface p-8">
      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 bg-white rounded-[3rem] overflow-hidden shadow-2xl shadow-primary/5">
        {/* Left Side - Visual */}
        <div className="hidden lg:block relative">
          <img 
            src="https://images.unsplash.com/photo-1516962215378-7fa2e137ae93?auto=format&fit=crop&q=80&w=1200" 
            alt="Login Visual" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-primary/20 backdrop-blur-[2px]" />
          <div className="absolute bottom-12 left-12 right-12 text-white">
            <h2 className="text-4xl font-bold mb-4">Welcome Back to The Atelier</h2>
            <p className="text-white/80 leading-relaxed">
              Your curated workspace awaits. Log in to access your orders, wishlist, and exclusive studio drops.
            </p>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="p-12 md:p-20 flex flex-col justify-center">
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-[#1A237E] mb-2">Sign In</h1>
            <p className="text-on-surface-variant">Enter your credentials to continue your creative journey.</p>
          </div>

            {error && (
              <div className="p-4 bg-red-50 text-red-600 rounded-2xl flex items-center gap-3 text-sm font-bold">
                <AlertCircle className="w-5 h-5" /> {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-primary">Tài khoản / Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant" />
                  <input 
                    type="text" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="name@studio.com" 
                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-surface-container-low border-none focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>
              </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold uppercase tracking-widest text-primary">Password</label>
                <Link to="#" className="text-xs font-bold text-tertiary hover:underline">Forgot?</Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••" 
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-surface-container-low border-none focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
            </div>

            <button type="submit" className="w-full bg-primary text-on-primary py-5 rounded-full font-bold flex items-center justify-center gap-3 hover:bg-primary-dim transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-primary/20">
              Sign In <ArrowRight className="w-5 h-5" />
            </button>
          </form>

          <div className="mt-12 pt-8 border-t border-outline-variant/10 text-center">
            <p className="text-on-surface-variant mb-6">Or continue with</p>
            <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center gap-3 py-4 rounded-2xl border border-outline-variant hover:bg-surface transition-all">
                <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="Google" />
                <span className="text-sm font-bold">Google</span>
              </button>
              <button className="flex items-center justify-center gap-3 py-4 rounded-2xl border border-outline-variant hover:bg-surface transition-all">
                <img src="https://github.com/favicon.ico" className="w-4 h-4" alt="GitHub" />
                <span className="text-sm font-bold">GitHub</span>
              </button>
            </div>
            <p className="mt-10 text-sm text-on-surface-variant">
              New to The Atelier? <Link to="/signup" className="text-primary font-bold hover:underline">Create an account</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
