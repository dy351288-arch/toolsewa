import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { TOOLS, getCategoryFromSlug } from '../constants';
import * as Icons from 'lucide-react';

export const CategoryPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const categoryName = getCategoryFromSlug(slug || '');
  const categoryTools = TOOLS.filter(t => t.category === categoryName);

  const getIcon = (iconName: string) => {
    // @ts-ignore
    const Icon = Icons[iconName] || Icons.HelpCircle;
    return <Icon size={24} className="text-india-orange" />;
  };

  if (!categoryName) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-700">Category Not Found</h1>
        <Link to="/" className="text-india-blue mt-4 inline-block hover:underline">Return Home</Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <Link to="/" className="text-sm text-gray-500 hover:text-india-orange mb-2 inline-flex items-center gap-1">
          <Icons.ArrowLeft size={16} /> Back to Home
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">{categoryName}</h1>
        <p className="text-gray-600 mt-2">Explore our collection of free {categoryName.toString().toLowerCase()} for daily use.</p>
      </div>

      {categoryTools.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categoryTools.map(tool => (
            <div key={tool.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
              <div className="flex items-start gap-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  {getIcon(tool.icon)}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">{tool.name}</h3>
                  <p className="text-sm text-gray-500 mb-4 line-clamp-2">{tool.description}</p>
                  <Link 
                    to={`/tool/${tool.slug}`} 
                    className="w-full block text-center bg-gray-50 text-gray-700 py-2 rounded-lg text-sm font-medium hover:bg-india-blue hover:text-white transition-colors"
                  >
                    Open Tool
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
          <p className="text-gray-500">No tools found in this category.</p>
          <Link to="/" className="text-india-blue font-medium mt-4 inline-block">Browse all tools</Link>
        </div>
      )}

      {/* SEO Content Stub */}
      <div className="mt-16 prose max-w-none text-gray-600 border-t pt-8">
        <h2 className="text-xl font-bold text-gray-800">Why use online {categoryName.toString().toLowerCase()}?</h2>
        <p>
          Our range of {categoryName} is designed to help Indian users save time and increase productivity. 
          Whether you are a student, professional, or business owner, ToolSewa.in provides accurate and fast calculations.
        </p>
      </div>
    </div>
  );
};