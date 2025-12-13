import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CATEGORIES, TOOLS, getCategorySlug } from '../constants';
import * as Icons from 'lucide-react';
import { Tool } from '../types';

export const Home: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTools = TOOLS.filter(tool => 
    tool.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    tool.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getIcon = (iconName: string) => {
    // @ts-ignore
    const Icon = Icons[iconName] || Icons.HelpCircle;
    return <Icon size={24} className="text-india-orange" />;
  };

  return (
    <div>
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-blue-50 to-white py-16 px-4">
        <div className="container mx-auto text-center max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Free Daily-Use <span className="text-india-orange">Online Tools</span> for India
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Simple, fast, and secure tools for salary calculation, GST, resumes, PDFs, and more. No installation required.
          </p>
          
          {/* Search Bar */}
          <div className="relative max-w-xl mx-auto shadow-xl rounded-full transform hover:scale-[1.01] transition-transform">
            <input
              type="text"
              placeholder="Search tools (e.g., Salary, GST, Resume)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-6 py-4 rounded-full border-2 border-gray-100 focus:border-india-orange outline-none text-lg text-gray-700 placeholder-gray-400"
            />
            <button className="absolute right-2 top-2 bg-india-orange text-white p-2.5 rounded-full hover:bg-orange-600 transition-colors">
              <Icons.Search size={24} />
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Search Results */}
        {searchTerm && (
          <div className="mb-12">
            <h2 className="text-xl font-semibold mb-4">Search Results</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTools.map(tool => (
                <ToolCard key={tool.id} tool={tool} getIcon={getIcon} />
              ))}
              {filteredTools.length === 0 && (
                <p className="text-gray-500 text-center py-8">No tools found matching "{searchTerm}"</p>
              )}
            </div>
          </div>
        )}

        {/* Categories */}
        {!searchTerm && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-16">
              {CATEGORIES.map(cat => {
                const slug = getCategorySlug(cat);
                return (
                  <Link 
                    to={`/category/${slug}`} 
                    key={cat}
                    className="flex flex-col items-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 group"
                  >
                    <div className="bg-blue-50 p-3 rounded-full mb-3 group-hover:bg-india-orange/10 transition-colors">
                      {cat.includes('Finance') ? <Icons.IndianRupee className="text-india-blue group-hover:text-india-orange" /> :
                       cat.includes('Business') ? <Icons.Briefcase className="text-india-blue group-hover:text-india-orange" /> :
                       cat.includes('Student') ? <Icons.GraduationCap className="text-india-blue group-hover:text-india-orange" /> :
                       cat.includes('AI') ? <Icons.Bot className="text-india-blue group-hover:text-india-orange" /> :
                       <Icons.FileText className="text-india-blue group-hover:text-india-orange" />}
                    </div>
                    <span className="font-medium text-gray-700 text-center">{cat}</span>
                  </Link>
                );
              })}
            </div>

            {/* Popular Tools */}
            <div className="mb-12">
              <div className="flex items-center gap-2 mb-6">
                <Icons.TrendingUp className="text-india-orange" />
                <h2 className="text-2xl font-bold text-gray-900">Popular Tools</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {TOOLS.filter(t => t.isPopular).map(tool => (
                  <ToolCard key={tool.id} tool={tool} getIcon={getIcon} />
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const ToolCard: React.FC<{ tool: Tool, getIcon: any }> = ({ tool, getIcon }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all hover:-translate-y-1">
    <div className="flex items-start gap-4">
      <div className="bg-gray-50 p-3 rounded-lg">
        {getIcon(tool.icon)}
      </div>
      <div>
        <h3 className="font-bold text-gray-900 mb-1">{tool.name}</h3>
        <p className="text-sm text-gray-500 line-clamp-2 mb-4">{tool.description}</p>
        <Link 
          to={`/tool/${tool.slug}`} 
          className="inline-flex items-center text-sm font-semibold text-india-blue hover:text-india-orange"
        >
          Open Tool <Icons.ArrowRight size={16} className="ml-1" />
        </Link>
      </div>
    </div>
  </div>
);