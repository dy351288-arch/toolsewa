import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { CategoryPage } from './pages/Category';
import { LegalPage } from './pages/Legal';

// Tools
import { SalaryCalculator } from './pages/tools/SalaryCalculator';
import { GSTCalculator } from './pages/tools/GSTCalculator';
import { Handwriter } from './pages/tools/Handwriter';
import { AIAssistant } from './pages/tools/AIAssistant';
import { PFCalculator } from './pages/tools/PFCalculator';
import { GratuityCalculator } from './pages/tools/GratuityCalculator';
import { GSTInvoiceGenerator } from './pages/tools/GSTInvoiceGenerator';
import { ResumeBuilder } from './pages/tools/ResumeBuilder';
import { ImageToPdf } from './pages/tools/ImageToPdf';
import { PdfMerge } from './pages/tools/PdfMerge';
import { PdfCompress } from './pages/tools/PdfCompress';

import { User } from 'lucide-react';
import { useAuth } from './context/AuthContext';

const Dashboard: React.FC = () => {
  const { user, history } = useAuth();
  if (!user) return <Navigate to="/" replace />;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow p-6 mb-6 flex items-center gap-4">
        <div className="bg-blue-100 p-4 rounded-full">
          <User size={32} className="text-india-blue" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">{user.name}</h1>
          <p className="text-gray-500">{user.email}</p>
        </div>
      </div>
      <h2 className="text-xl font-bold mb-4">Usage History</h2>
      <div className="bg-white rounded-xl shadow overflow-hidden">
        {history.length > 0 ? (
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-4 font-medium text-gray-600">Tool</th>
                <th className="p-4 font-medium text-gray-600">Result</th>
                <th className="p-4 font-medium text-gray-600">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {history.map(h => (
                <tr key={h.id} className="hover:bg-gray-50">
                  <td className="p-4">{h.toolName}</td>
                  <td className="p-4 font-medium text-gray-800">{h.result}</td>
                  <td className="p-4 text-sm text-gray-500">{new Date(h.date).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-8 text-center text-gray-500">No history found. Start using tools!</div>
        )}
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/category/:slug" element={<CategoryPage />} />
            
            {/* Tools Routes */}
            <Route path="/tool/salary-calculator" element={<SalaryCalculator />} />
            <Route path="/tool/gst-calculator" element={<GSTCalculator />} />
            <Route path="/tool/handwriting-generator" element={<Handwriter />} />
            <Route path="/tool/ai-assistant" element={<AIAssistant />} />
            <Route path="/tool/pf-calculator" element={<PFCalculator />} />
            <Route path="/tool/gratuity-calculator" element={<GratuityCalculator />} />
            <Route path="/tool/gst-invoice-generator" element={<GSTInvoiceGenerator />} />
            <Route path="/tool/resume-builder" element={<ResumeBuilder />} />
            <Route path="/tool/image-to-pdf" element={<ImageToPdf />} />
            <Route path="/tool/pdf-merge" element={<PdfMerge />} />
            <Route path="/tool/pdf-compress" element={<PdfCompress />} />
            
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/legal/:type" element={<LegalPage />} />
            
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
};

export default App;