import React, { useEffect } from 'react';
import { BackButton } from './BackButton';
import { AdPlaceholder } from './AdPlaceholder';
import { Link } from 'react-router-dom';
import { TOOLS, getCategorySlug } from '../constants';
import * as Icons from 'lucide-react';
import { Tool, ToolCategory } from '../types';

interface ToolLayoutProps {
  title: string;
  description: string;
  toolId: string;
  category: ToolCategory | string;
  children: React.ReactNode;
  faqs?: Array<{ question: string; answer: string }>;
}

export const ToolLayout: React.FC<ToolLayoutProps> = ({ 
  title, 
  description, 
  toolId,
  category, 
  children,
  faqs 
}) => {
  useEffect(() => {
    document.title = `${title} - ToolSewa.in`;
    window.scrollTo(0, 0);
  }, [title]);

  const relatedTools = TOOLS.filter(t => t.category === category && t.id !== toolId).slice(0, 3);
  const categorySlug = getCategorySlug(category as ToolCategory);

  const getIcon = (iconName: string) => {
    // @ts-ignore
    const Icon = Icons[iconName] || Icons.HelpCircle;
    return <Icon size={20} />;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky Back Button Header */}
      <div className="sticky top-16 z-30 bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm transition-all">
        <div className="container mx-auto px-4 py-3 max-w-5xl flex items-center">
          <BackButton fallbackUrl={`/category/${categorySlug}`} className="mr-4 !mb-0 bg-gray-100 hover:bg-gray-200 border border-gray-200" />
          <h1 className="text-lg font-bold text-gray-800 truncate">{title}</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Tool Header Info */}
          <div className="bg-gradient-to-r from-blue-50 to-white p-6 border-b">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">{title}</h2>
            <p className="text-gray-600 max-w-2xl">{description}</p>
          </div>

          <div className="p-4 md:p-8">
            <AdPlaceholder position="top" />
            
            {/* Tool Logic Area */}
            <div className="min-h-[400px]">
              {children}
            </div>

            <AdPlaceholder position="bottom" />
          </div>
        </div>

        {/* FAQs Section */}
        {faqs && faqs.length > 0 && (
          <div className="mt-12 max-w-3xl mx-auto">
            <div className="flex items-center gap-2 mb-6">
              <Icons.HelpCircle className="text-india-orange" />
              <h2 className="text-2xl font-bold text-gray-900">Frequently Asked Questions</h2>
            </div>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <details key={index} className="group bg-white rounded-lg border border-gray-200 overflow-hidden open:shadow-md transition-shadow">
                  <summary className="flex cursor-pointer items-center justify-between gap-1.5 p-4 text-gray-900 font-medium hover:bg-gray-50 transition-colors">
                    {faq.question}
                    <Icons.ChevronDown className="h-5 w-5 shrink-0 transition duration-300 group-open:-rotate-180 text-gray-400" />
                  </summary>
                  <p className="px-4 pb-4 leading-relaxed text-gray-700 bg-gray-50/50 border-t border-gray-100 pt-4 text-sm">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        )}

        {/* Related Tools */}
        {relatedTools.length > 0 && (
          <div className="mt-12 border-t pt-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Related Tools</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedTools.map(tool => (
                <Link 
                  key={tool.id}
                  to={`/tool/${tool.slug}`}
                  className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-all hover:-translate-y-1 flex items-start gap-3 group"
                >
                  <div className="bg-gray-50 p-2 rounded-lg text-india-blue group-hover:text-india-orange transition-colors">
                    {getIcon(tool.icon)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{tool.name}</h4>
                    <p className="text-xs text-gray-500 line-clamp-2 mt-1">{tool.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};