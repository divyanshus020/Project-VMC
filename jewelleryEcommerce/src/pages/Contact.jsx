import React, { useState } from 'react';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin,
  MessageCircle
} from 'lucide-react';

const ContactPage = () => {
  const [hoveredSocial, setHoveredSocial] = useState(null);

  const contactInfo = [
    {
      icon: <MapPin className="w-7 h-7 text-[#D4AF37]" />,
      title: 'Address',
      content: '123 Business Street, Suite 100\nCity, State 12345\nUnited States',
      subtitle: 'Visit us during business hours'
    },
    {
      icon: <Phone className="w-7 h-7 text-[#D4AF37]" />,
      title: 'Phone',
      content: '+1 (555) 123-4567',
      subtitle: 'Mon-Fri 9AM-6PM'
    },
    {
      icon: <Mail className="w-7 h-7 text-[#D4AF37]" />,
      title: 'Email',
      content: 'hello@yourcompany.com',
      subtitle: 'We reply within 24 hours'
    },
    {
      icon: <Clock className="w-7 h-7 text-[#D4AF37]" />,
      title: 'Business Hours',
      content: 'Monday - Friday: 9:00 AM - 6:00 PM\nSaturday: 10:00 AM - 4:00 PM\nSunday: Closed',
      subtitle: 'Available for appointments'
    }
  ];

  const socialLinks = [
    { 
      icon: <Facebook className="w-6 h-6" />, 
      label: 'Facebook', 
      color: '#1877F2',
      hoverColor: 'hover:bg-blue-600'
    },
    { 
      icon: <Twitter className="w-6 h-6" />, 
      label: 'Twitter', 
      color: '#1DA1F2',
      hoverColor: 'hover:bg-sky-500'
    },
    { 
      icon: <Instagram className="w-6 h-6" />, 
      label: 'Instagram', 
      color: '#E4405F',
      hoverColor: 'hover:bg-pink-600'
    },
    { 
      icon: <Linkedin className="w-6 h-6" />, 
      label: 'LinkedIn', 
      color: '#0A66C2',
      hoverColor: 'hover:bg-blue-700'
    },
    { 
      icon: <MessageCircle className="w-6 h-6" />, 
      label: 'WhatsApp', 
      color: '#25D366',
      hoverColor: 'hover:bg-green-600'
    }
  ];

  return (
    <div className="bg-[#F5F5F5] py-8 md:py-16">
      <div className=" mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 bg-[#D4AF37]/10 text-[#D4AF37] rounded-full font-semibold text-sm tracking-wider mb-4">
            GET IN TOUCH
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-[#333333] mb-4 tracking-tight">
            Contact Us
          </h1>
          <p className="text-lg text-[#666666] mx-auto leading-relaxed">
            We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Left Side - Map */}
          <div className="group">
            <div className="h-full min-h-[400px] rounded-2xl overflow-hidden shadow-xl border border-[#D4AF37]/20 relative transform transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/5 to-transparent z-10 pointer-events-none"></div>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3577.1590424946203!2d73.0218068!3d26.288943699999997!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39418dce48a1a621%3A0x802340f5d17f9473!2sVimla%20Jewellers!5e0!3m2!1sen!2sin!4v1749290769708!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ 
                  border: 0, 
                  minHeight: '400px',
                  filter: 'grayscale(0.2) contrast(1.1)'
                }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Our Location"
                className="w-full h-full"
              />
            </div>
          </div>

          {/* Right Side - Contact Details */}
          <div className="transform transition-all duration-300 hover:-translate-y-1">
            <div className="h-full bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl border border-[#D4AF37]/10 p-6 md:p-8 hover:shadow-2xl transition-all duration-300">
              <div className="mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-[#333333] mb-2">
                  Let's Connect
                </h2>
                <p className="text-[#666666] leading-relaxed">
                  Reach out to us through any of the following channels
                </p>
              </div>

              <div className="space-y-0">
                {contactInfo.map((item, index) => (
                  <div 
                    key={index} 
                    className="flex items-start gap-4 p-4 rounded-xl transition-all duration-300 hover:bg-[#D4AF37]/5 hover:translate-x-2 group cursor-pointer"
                  >
                    <div className="flex-shrink-0 mt-1 transform transition-transform duration-300 group-hover:scale-110">
                      {item.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-[#333333] text-lg mb-1">
                        {item.title}
                      </h3>
                      <p className="text-[#666666] whitespace-pre-line leading-relaxed mb-1">
                        {item.content}
                      </p>
                      <p className="text-[#D4AF37] font-medium text-sm">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-[#D4AF37]/20 mt-8 pt-8">
                <h3 className="text-xl font-semibold text-[#333333] text-center mb-6">
                  Follow Us
                </h3>
                <div className="flex justify-center gap-4 flex-wrap">
                  {socialLinks.map((social, index) => (
                    <button
                      key={index}
                      className={`w-12 h-12 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#F4E18C] text-white shadow-lg transform transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:shadow-xl ${social.hoverColor} flex items-center justify-center group relative overflow-hidden`}
                      onMouseEnter={() => setHoveredSocial(index)}
                      onMouseLeave={() => setHoveredSocial(null)}
                      aria-label={social.label}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      {social.icon}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA Section */}
        <div className="bg-white rounded-2xl shadow-xl border border-[#D4AF37]/10 p-8 text-center transform transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
          <h3 className="text-2xl md:text-3xl font-semibold text-[#333333] mb-4">
            Ready to Get Started?
          </h3>
          <p className="text-[#666666] mb-6 max-w-2xl mx-auto leading-relaxed">
            We're here to help you achieve your goals. Contact us today and let's discuss how we can work together.
          </p>
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-[#D4AF37]/10 border-2 border-[#D4AF37] rounded-full transition-all duration-300 hover:bg-[#D4AF37]/20 hover:scale-105">
            <span className="text-[#D4AF37] font-semibold">Built with</span>
            <span 
              className="text-red-500 text-xl animate-pulse"
              style={{
                animation: 'heartbeat 1.5s ease-in-out infinite'
              }}
            >
              ❤️
            </span>
            <span className="text-[#D4AF37] font-semibold">and precision</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes heartbeat {
          0% { transform: scale(1); }
          14% { transform: scale(1.1); }
          28% { transform: scale(1); }
          42% { transform: scale(1.1); }
          70% { transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default ContactPage;