import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, User as UserIcon, LogOut, Wrench } from 'lucide-react';
import { AuthModal } from './AuthModal';

interface LayoutProps {
  children?: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout, setShowLoginModal } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const isActive = (path: string) => location.pathname === path ? 'text-india-orange font-semibold' : 'text-gray-600 hover:text-india-orange';

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
      <AuthModal />
      
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40 border-t-4 border-india-orange">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="bg-india-orange text-white p-1.5 rounded-lg group-hover:bg-orange-600 transition-colors">
                <Wrench size={20} />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-gray-900 leading-none">ToolSewa<span className="text-india-orange">.in</span></h1>
                <p className="text-[10px] text-gray-500 font-medium tracking-wide">Daily Tools for India</p>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8">
              <Link to="/" className={isActive('/')}>Home</Link>
              <Link to="/category/salary-finance" className={isActive('/category/salary-finance')}>Salary</Link>
              <Link to="/category/gst-business" className={isActive('/category/gst-business')}>GST</Link>
              <Link to="/category/student-tools" className={isActive('/category/student-tools')}>Students</Link>
            </nav>

            {/* User Action */}
            <div className="hidden md:flex items-center">
              {user ? (
                <div className="flex items-center gap-4">
                  <Link to="/dashboard" className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-india-blue bg-blue-50 px-3 py-1.5 rounded-full">
                    <UserIcon size={16} />
                    {user.name}
                  </Link>
                  <button onClick={logout} className="text-gray-400 hover:text-red-500 transition-colors" title="Logout">
                    <LogOut size={20} />
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => setShowLoginModal(true)}
                  className="bg-india-blue text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-blue-900 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  Login
                </button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden text-gray-700 p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu size={24} />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t p-4 space-y-4 shadow-lg animate-fade-in">
            <Link to="/" className="block py-2 text-gray-700 font-medium" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
            <Link to="/category/salary-finance" className="block py-2 text-gray-700 font-medium" onClick={() => setIsMobileMenuOpen(false)}>Salary & Finance</Link>
            <Link to="/category/gst-business" className="block py-2 text-gray-700 font-medium" onClick={() => setIsMobileMenuOpen(false)}>GST & Business</Link>
            <Link to="/category/student-tools" className="block py-2 text-gray-700 font-medium" onClick={() => setIsMobileMenuOpen(false)}>Student Tools</Link>
            <div className="pt-4 border-t">
              {user ? (
                <div className="space-y-3">
                  <div className="font-medium flex items-center gap-2">
                      <UserIcon size={16} /> {user.name}
                  </div>
                  <Link to="/dashboard" className="block text-india-blue text-sm" onClick={() => setIsMobileMenuOpen(false)}>Go to Dashboard</Link>
                  <button onClick={() => { logout(); setIsMobileMenuOpen(false); }} className="text-red-500 text-sm w-full text-left py-2">Logout</button>
                </div>
              ) : (
                <button 
                  onClick={() => { setShowLoginModal(true); setIsMobileMenuOpen(false); }}
                  className="w-full bg-india-blue text-white py-3 rounded-lg font-medium"
                >
                  Login / Sign Up
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 border-t border-gray-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                 <Wrench size={18} className="text-india-orange" /> ToolSewa.in
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed">Making daily digital tasks easier for every Indian. Free, fast, and secure online tools for finance, education, and business.</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Categories</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/category/salary-finance" className="hover:text-india-orange transition-colors">Salary & Finance</Link></li>
                <li><Link to="/category/gst-business" className="hover:text-india-orange transition-colors">GST & Business</Link></li>
                <li><Link to="/category/student-tools" className="hover:text-india-orange transition-colors">Student Tools</Link></li>
                <li><Link to="/category/pdf-tools" className="hover:text-india-orange transition-colors">PDF Tools</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/legal/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link to="/legal/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link to="/legal/disclaimer" className="hover:text-white transition-colors">Disclaimer</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Contact</h4>
              <p className="text-sm text-gray-400">support@toolsewa.in</p>
              <p className="text-sm text-gray-400 mt-2">New Delhi, India</p>
              <div className="flex gap-4 mt-4">
                 {/* Social placeholders */}
                 <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-india-orange transition-colors cursor-pointer">
                    <span className="text-xs">IN</span>
                 </div>
                 <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-india-orange transition-colors cursor-pointer">
                    <span className="text-xs">TW</span>
                 </div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-6 text-center text-xs text-gray-500">
            &copy; {new Date().getFullYear()} ToolSewa.in. All rights reserved. Made with ❤️ in India.
          </div>
        </div>
      </footer>
    </div>
  );
};