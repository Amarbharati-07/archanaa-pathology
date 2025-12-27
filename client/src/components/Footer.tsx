import { Link } from "wouter";
import { Phone, Mail, MapPin, Clock, Facebook, Twitter, Instagram } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-200">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <span className="font-display font-bold text-2xl text-white">Archana</span>
              <span className="text-sm font-semibold text-primary tracking-widest uppercase">Pathology Lab</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Committed to providing accurate, timely, and quality diagnostic services with state-of-the-art technology.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="hover:text-primary transition-colors"><Facebook className="h-5 w-5" /></a>
              <a href="#" className="hover:text-primary transition-colors"><Twitter className="h-5 w-5" /></a>
              <a href="#" className="hover:text-primary transition-colors"><Instagram className="h-5 w-5" /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display font-bold text-lg text-white mb-6">Quick Links</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
              <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="/tests" className="hover:text-primary transition-colors">Tests & Services</Link></li>
              <li><Link href="/packages" className="hover:text-primary transition-colors">Health Packages</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-display font-bold text-lg text-white mb-6">Contact Us</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span>123 Healthcare Ave, Medical District, City, State 45678</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-primary shrink-0" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary shrink-0" />
                <span>info@archanalabs.com</span>
              </li>
            </ul>
          </div>

          {/* Working Hours */}
          <div>
            <h3 className="font-display font-bold text-lg text-white mb-6">Working Hours</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div className="flex flex-col">
                  <span className="font-medium text-white">Mon - Sat</span>
                  <span className="text-slate-400">7:00 AM - 9:00 PM</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div className="flex flex-col">
                  <span className="font-medium text-white">Sunday</span>
                  <span className="text-slate-400">8:00 AM - 2:00 PM</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-12 pt-8 text-center text-sm text-slate-500">
          <p>&copy; {new Date().getFullYear()} Archana Pathology Lab. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
