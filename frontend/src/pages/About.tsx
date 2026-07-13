import { motion } from 'motion/react';
import { ArrowRight, MapPin, Clock, Phone, Navigation, Compass } from 'lucide-react';

export default function About() {
  return (
    <div className="pt-32 pb-24 max-w-7xl mx-auto px-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-8"
        >
          <span className="text-xs font-bold uppercase tracking-widest text-primary">Our Story</span>
          <h1 className="text-6xl font-bold text-[#1A237E] leading-tight">
            Crafting the <br />
            <span className="editorial-gradient italic">Tactile Digital</span>
          </h1>
          <p className="text-xl text-on-surface-variant leading-relaxed">
            Stilo Stationery was born from a simple observation: in an increasingly digital world, the physical act of writing remains the most powerful way to connect with our thoughts.
          </p>
          <p className="text-on-surface-variant leading-relaxed">
            We curate tools that celebrate this connection. From archival-grade paper that welcomes every stroke to writing instruments designed to last a lifetime, our studio is dedicated to the art of the physical.
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl"
        >
          <img
            src="https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?auto=format&fit=crop&q=80&w=1200"
            alt="Studio"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 py-24 border-y border-outline-variant/10 mb-24">
        <div className="space-y-4">
          <h3 className="text-2xl font-bold text-[#1A237E]">Archival Quality</h3>
          <p className="text-on-surface-variant text-sm leading-relaxed">
            Every product in our atelier is tested for longevity. We believe tools should age with you, becoming artifacts of your creative journey.
          </p>
        </div>
        <div className="space-y-4">
          <h3 className="text-2xl font-bold text-[#1A237E]">Ethical Sourcing</h3>
          <p className="text-on-surface-variant text-sm leading-relaxed">
            We partner with small-scale mills and family-owned workshops that prioritize sustainable practices and fair labor.
          </p>
        </div>
        <div className="space-y-4">
          <h3 className="text-2xl font-bold text-[#1A237E]">Studio Rituals</h3>
          <p className="text-on-surface-variant text-sm leading-relaxed">
            Beyond products, we are a community. We share insights on creative rituals that help you find focus in a noisy world.
          </p>
        </div>
      </div>

      {/* Google Maps Showroom Location Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="space-y-12"
      >
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="px-4 py-1.5 bg-primary/10 text-primary rounded-full text-xs font-bold uppercase tracking-widest inline-flex items-center gap-2">
            <Compass className="w-3.5 h-3.5" /> Visit Our Atelier Showroom
          </span>
          <h2 className="text-4xl lg:text-5xl font-bold text-[#1A237E] tracking-tight">
            Ghé Thăm Không Gian <br />
            <span className="editorial-gradient italic">Trải Nghiệm Trực Tiếp</span>
          </h2>
          <p className="text-on-surface-variant text-base leading-relaxed">
            Hãy đến trực tiếp Showroom The Atelier để chạm tay vào từng chất liệu giấy cao cấp, thử nghiệm các dòng bút viết tay nghệ thuật và tận hưởng không gian thư giãn dành riêng cho bạn.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch bg-white rounded-[3rem] p-6 lg:p-8 border border-outline-variant/10 shadow-2xl shadow-primary/5">
          {/* Left Column: Address Info Cards */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6 p-4 lg:p-6 bg-surface-container-low rounded-[2rem] border border-outline-variant/10">
            <div className="space-y-6">
              <div className="flex items-start gap-4 p-4 bg-white rounded-2xl shadow-sm border border-outline-variant/10">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 text-primary">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-base text-[#1A237E]">Địa chỉ Showroom chính thức</h4>
                  <p className="text-sm font-medium text-on-surface mt-1">
                    140 Lê Trọng Tấn, Phường Tây Thạnh
                  </p>
                  <p className="text-xs text-on-surface-variant mt-0.5">
                    Quận Tân Phú, TP. Hồ Chí Minh
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-white rounded-2xl shadow-sm border border-outline-variant/10">
                <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center shrink-0 text-secondary">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-base text-[#1A237E]">Giờ mở cửa phục vụ</h4>
                  <p className="text-sm font-medium text-on-surface mt-1">
                    08:30 - 21:00 (Thứ 2 đến Chủ Nhật)
                  </p>
                  <p className="text-xs text-on-surface-variant mt-0.5">
                    Mở cửa xuyên trưa & tất cả các ngày lễ
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-white rounded-2xl shadow-sm border border-outline-variant/10">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0 text-emerald-600">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-base text-[#1A237E]">Hotline hỗ trợ & Đặt hẹn</h4>
                  <p className="text-sm font-bold text-emerald-700 mt-1">
                    (028) 3816 1673 • 0909 140 140
                  </p>
                  <p className="text-xs text-on-surface-variant mt-0.5">
                    Hỗ trợ tư vấn quà tặng doanh nghiệp & cá nhân
                  </p>
                </div>
              </div>
            </div>

            <a
              href="https://www.google.com/maps/search/?api=1&query=140+Lê+Trọng+Tấn,+Tây+Thạnh,+Tân+Phú,+Hồ+Chí+Minh"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-4 bg-primary text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2.5 hover:bg-primary-dim transition-all shadow-lg shadow-primary/20 hover:scale-[1.01]"
            >
              <Navigation className="w-4 h-4" /> Chỉ Đường Trên Google Maps
            </a>
          </div>

          {/* Right Column: Google Maps iFrame */}
          <div className="lg:col-span-7 rounded-[2rem] overflow-hidden min-h-[420px] shadow-inner border border-outline-variant/15 relative bg-surface">
            <iframe
              title="Google Map - The Atelier 140 Lê Trọng Tấn"
              src="https://maps.google.com/maps?q=140%20L%C3%AA%20Tr%E1%BB%8Dng%20T%E1%BA%A5n,%20T%C3%A2y%20Th%E1%BA%A1nh,%20T%C3%A2n%20Ph%C3%BA,%20H%E1%BB%93%20Ch%C3%AD%20Minh&t=&z=16&ie=UTF8&iwloc=&output=embed"
              className="w-full h-full absolute inset-0 border-0"
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
