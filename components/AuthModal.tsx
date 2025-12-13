import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, Lock, CheckCircle } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { showLoginModal, setShowLoginModal, login } = useAuth();
  const [email, setEmail] = useState('');

  if (!showLoginModal) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) login(email);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden relative animate-fade-in-up">
        <button 
          onClick={() => setShowLoginModal(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X size={24} />
        </button>
        
        <div className="bg-gradient-to-r from-india-orange to-red-500 p-6 text-white">
          <div className="flex items-center gap-2 mb-2">
            <Lock size={20} />
            <span className="text-sm font-semibold uppercase tracking-wider">Usage Limit Reached</span>
          </div>
          <h2 className="text-2xl font-bold">Join ToolSewa.in</h2>
          <p className="opacity-90 mt-1">Create a free account to continue using tools without limits.</p>
        </div>

        <div className="p-6">
          <ul className="space-y-3 mb-6">
            <li className="flex items-center gap-3 text-sm text-gray-600">
              <CheckCircle size={16} className="text-india-green" />
              Unlimited access to all 50+ tools
            </li>
            <li className="flex items-center gap-3 text-sm text-gray-600">
              <CheckCircle size={16} className="text-india-green" />
              Save your invoices and resumes
            </li>
            <li className="flex items-center gap-3 text-sm text-gray-600">
              <CheckCircle size={16} className="text-india-green" />
              Access usage history
            </li>
          </ul>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-india-orange focus:border-transparent outline-none"
                placeholder="you@example.com"
              />
            </div>
            
            <button 
              type="submit"
              className="w-full bg-india-blue text-white py-3 rounded-lg font-semibold hover:bg-blue-900 transition-colors shadow-lg hover:shadow-xl"
            >
              Continue with Email
            </button>
          </form>

          <div className="mt-4 pt-4 border-t border-gray-100 text-center">
            <button 
              onClick={() => login('google_user@gmail.com')}
              className="w-full flex items-center justify-center gap-2 border border-gray-300 bg-white py-2.5 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>
          </div>
          
          <p className="text-xs text-center text-gray-500 mt-4">
            By continuing, you agree to our Terms & Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
};