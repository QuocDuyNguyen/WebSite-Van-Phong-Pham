import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

export default function Contact() {
  return (
    <div className="pt-32 pb-24 max-w-7xl mx-auto px-8">
      <div className="text-center mb-20">
        <h1 className="text-6xl font-bold text-[#1A237E] mb-4">Get in Touch</h1>
        <p className="text-on-surface-variant text-lg max-w-xl mx-auto">
          Have a question about our archival tools or want to discuss a wholesale partnership? Our studio team is here to help.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        {/* Contact Info */}
        <div className="space-y-12">
          <div className="flex gap-6">
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shrink-0">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-on-surface mb-1">Email Us</h4>
              <p className="text-on-surface-variant text-sm">hello@thestilo.com</p>
              <p className="text-on-surface-variant text-sm">wholesale@thestilo.com</p>
            </div>
          </div>

          <div className="flex gap-6">
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shrink-0">
              <Phone className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-on-surface mb-1">Call Us</h4>
              <p className="text-on-surface-variant text-sm">+1 (555) 123-4567</p>
              <p className="text-on-surface-variant text-sm">Mon-Fri, 9am-5pm EST</p>
            </div>
          </div>

          <div className="flex gap-6">
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shrink-0">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-on-surface mb-1">Visit Studio</h4>
              <p className="text-on-surface-variant text-sm">123 Creative Way</p>
              <p className="text-on-surface-variant text-sm">Brooklyn, NY 11211</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="lg:col-span-2 bg-white rounded-[3rem] p-12 border border-outline-variant/10 shadow-xl shadow-primary/5">
          <form className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-primary">Full Name</label>
              <input 
                type="text" 
                placeholder="Julianne Moore" 
                className="w-full px-6 py-4 rounded-2xl bg-surface-container-low border-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-primary">Email Address</label>
              <input 
                type="email" 
                placeholder="name@studio.com" 
                className="w-full px-6 py-4 rounded-2xl bg-surface-container-low border-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-primary">Subject</label>
              <select className="w-full px-6 py-4 rounded-2xl bg-surface-container-low border-none focus:ring-2 focus:ring-primary/20 transition-all appearance-none">
                <option>General Inquiry</option>
                <option>Order Support</option>
                <option>Wholesale Partnership</option>
                <option>Press & Media</option>
              </select>
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-primary">Message</label>
              <textarea 
                placeholder="How can we help you?" 
                className="w-full h-48 px-6 py-4 rounded-2xl bg-surface-container-low border-none focus:ring-2 focus:ring-primary/20 transition-all resize-none"
              />
            </div>
            <div className="md:col-span-2">
              <button className="w-full sm:w-auto px-12 py-5 bg-primary text-on-primary rounded-full font-bold flex items-center justify-center gap-3 hover:bg-primary-dim transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-primary/20">
                Send Message <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
