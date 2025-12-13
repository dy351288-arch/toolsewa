import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

interface BackButtonProps {
  fallbackUrl?: string;
  className?: string;
}

export const BackButton: React.FC<BackButtonProps> = ({ fallbackUrl = '/', className = '' }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    // Check if there is a history stack to go back to, otherwise fallback
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      navigate(fallbackUrl);
    }
  };

  return (
    <button 
      onClick={handleBack}
      className={`group flex items-center gap-2 text-gray-600 hover:text-india-blue font-medium transition-all duration-200 mb-4 px-3 py-2 rounded-lg hover:bg-gray-100 ${className}`}
      aria-label="Go back"
    >
      <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
      <span>Back</span>
    </button>
  );
};