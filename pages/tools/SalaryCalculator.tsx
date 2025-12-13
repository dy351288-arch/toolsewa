import React, { useState } from 'react';
import { ToolLayout } from '../../components/ToolLayout';
import { useAuth } from '../../context/AuthContext';
import { ToolCategory } from '../../types';
import { IndianRupee } from 'lucide-react';

export const SalaryCalculator: React.FC = () => {
  const { checkUsageLimit, addToHistory } = useAuth();
  const [ctc, setCtc] = useState<number>(600000);
  const [result, setResult] = useState<{ inHandMonthly: number; taxYearly: number; pfYearly: number } | null>(null);

  const calculate = () => {
    if (!checkUsageLimit()) return;

    // Simplified New Regime 2024-25 Logic
    const pf = Math.min(ctc * 0.4 * 0.12, 21600); // Simple approx
    const standardDed = 50000;
    const taxable = Math.max(0, ctc - pf - standardDed);
    
    let tax = 0;
    if (taxable > 300000) {
       // Very rough slab approximation for 2024-25
       if (taxable <= 700000) tax = 0; // Rebate
       else {
           // Standard slabs
           if (taxable <= 600000) tax = (taxable-300000)*0.05;
           else if (taxable <= 900000) tax = 15000 + (taxable-600000)*0.10;
           else if (taxable <= 1200000) tax = 45000 + (taxable-900000)*0.15;
           else if (taxable <= 1500000) tax = 90000 + (taxable-1200000)*0.20;
           else tax = 150000 + (taxable-1500000)*0.30;
       }
    }
    const cess = tax * 0.04;
    const totalTax = tax + cess;
    const inHandY = ctc - pf - totalTax;

    setResult({
        inHandMonthly: Math.round(inHandY / 12),
        taxYearly: Math.round(totalTax),
        pfYearly: Math.round(pf)
    });
    
    addToHistory({
        toolId: 'salary-calc',
        toolName: 'Salary Calculator',
        result: `In-Hand: ₹${Math.round(inHandY / 12)}/mo`
    });
  };

  return (
    <ToolLayout
      title="Salary Calculator (India)"
      description="Calculate your monthly in-hand salary based on your CTC package (New Regime)."
      toolId="salary-calc"
      category={ToolCategory.FINANCE}
      faqs={[{question: "Does this include Professional Tax?", answer: "This calculation is an approximation and does not deduct Professional Tax (approx ₹200/mo) as it varies by state."}]}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         <div className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Annual CTC (₹)</label>
                <div className="relative">
                    <span className="absolute left-3 top-3.5 text-gray-500"><IndianRupee size={16} /></span>
                    <input type="number" value={ctc} onChange={e => setCtc(Number(e.target.value))} className="w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-india-blue outline-none" />
                </div>
            </div>
            <button onClick={calculate} className="w-full bg-india-blue text-white py-3 rounded-lg font-bold hover:bg-blue-900 transition-colors">Calculate In-Hand</button>
         </div>
         
         <div className="bg-gray-50 border rounded-xl p-6 text-center flex flex-col justify-center">
            {result ? (
                <>
                    <p className="text-gray-500 font-medium">Monthly In-Hand Salary</p>
                    <p className="text-4xl font-bold text-india-green my-2">₹ {result.inHandMonthly.toLocaleString('en-IN')}</p>
                    <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
                        <div className="bg-white p-2 rounded shadow-sm">
                            <span className="block text-gray-500">Tax/Year</span>
                            <span className="font-semibold text-red-500">₹ {result.taxYearly.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="bg-white p-2 rounded shadow-sm">
                            <span className="block text-gray-500">PF/Year</span>
                            <span className="font-semibold text-blue-500">₹ {result.pfYearly.toLocaleString('en-IN')}</span>
                        </div>
                    </div>
                </>
            ) : (
                <p className="text-gray-400">Result will appear here</p>
            )}
         </div>
      </div>
    </ToolLayout>
  );
};