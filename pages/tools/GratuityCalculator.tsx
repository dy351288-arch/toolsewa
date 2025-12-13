import React, { useState } from 'react';
import { ToolLayout } from '../../components/ToolLayout';
import { useAuth } from '../../context/AuthContext';
import { ToolCategory } from '../../types';

export const GratuityCalculator: React.FC = () => {
  const { checkUsageLimit, addToHistory } = useAuth();
  const [salary, setSalary] = useState(50000);
  const [years, setYears] = useState(5);
  const [gratuity, setGratuity] = useState<number | null>(null);

  const calculate = () => {
    if (!checkUsageLimit()) return;
    // Formula: (15 * last drawn salary * tenure) / 26
    const val = (15 * salary * years) / 26;
    setGratuity(Math.round(val));
    addToHistory({
        toolId: 'gratuity-calc',
        toolName: 'Gratuity Calculator',
        result: `Gratuity: ₹${Math.round(val).toLocaleString('en-IN')}`
    });
  };

  const faqs = [
    { question: "Who is eligible for gratuity?", answer: "Employees who have completed at least 5 years of continuous service with an organization are eligible for gratuity." },
    { question: "Is gratuity taxable?", answer: "For government employees, gratuity is fully tax-exempt. For private sector employees, it is tax-exempt up to ₹20 Lakhs (as per recent amendments)." }
  ];

  return (
    <ToolLayout
      title="Gratuity Calculator"
      description="Estimate your gratuity amount based on years of service and last drawn salary."
      toolId="gratuity-calc"
      category={ToolCategory.FINANCE}
      faqs={faqs}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
           <label className="block text-sm font-medium text-gray-700 mb-1">Basic Salary + DA (Monthly)</label>
           <input type="number" value={salary} onChange={e => setSalary(Number(e.target.value))} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-india-blue outline-none" placeholder="e.g. 50000" />
           <p className="text-xs text-gray-500 mt-1">Enter your last drawn Basic Salary plus Dearness Allowance.</p>
        </div>
        <div>
           <label className="block text-sm font-medium text-gray-700 mb-1">Years of Service</label>
           <input type="number" value={years} onChange={e => setYears(Number(e.target.value))} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-india-blue outline-none" placeholder="e.g. 5" />
           <p className="text-xs text-gray-500 mt-1">Must be at least 5 years for eligibility.</p>
        </div>
        
        <button onClick={calculate} className="w-full bg-india-blue text-white py-3 rounded-lg font-bold hover:bg-blue-900 transition-colors">Calculate Gratuity</button>
        
        {gratuity !== null && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center animate-fade-in-up">
                <p className="text-gray-600 font-medium">Estimated Gratuity Payable</p>
                <p className="text-4xl font-bold text-india-green mt-2">₹ {gratuity.toLocaleString('en-IN')}</p>
            </div>
        )}
      </div>
    </ToolLayout>
  );
};