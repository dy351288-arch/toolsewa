import React, { useState } from 'react';
import { ToolLayout } from '../../components/ToolLayout';
import { useAuth } from '../../context/AuthContext';
import { ToolCategory } from '../../types';

export const PFCalculator: React.FC = () => {
  const { checkUsageLimit, addToHistory } = useAuth();
  const [basicPay, setBasicPay] = useState(15000);
  const [age, setAge] = useState(25);
  const [retireAge, setRetireAge] = useState(58);
  const [interestRate, setInterestRate] = useState(8.15);
  const [increaseRate, setIncreaseRate] = useState(5);
  const [result, setResult] = useState<{ total: number; employeeShare: number; employerShare: number; interest: number } | null>(null);

  const calculatePF = () => {
    if (!checkUsageLimit()) return;

    let currentBalance = 0;
    let totalEmployee = 0;
    let totalEmployer = 0;
    let currentBasic = basicPay;
    const months = (retireAge - age) * 12;

    // Simplified calculation (Annual compounding for performance demo)
    for (let i = 0; i < (retireAge - age); i++) {
        const yearlyBasic = currentBasic * 12;
        const employeeYearly = yearlyBasic * 0.12;
        const employerYearly = yearlyBasic * 0.0367; // 3.67% goes to PF, rest to Pension
        
        totalEmployee += employeeYearly;
        totalEmployer += employerYearly;
        
        const yearlyContribution = employeeYearly + employerYearly;
        const interest = (currentBalance + yearlyContribution) * (interestRate / 100);
        
        currentBalance += yearlyContribution + interest;
        
        // Annual increment
        currentBasic += currentBasic * (increaseRate / 100);
    }

    const totalInterest = currentBalance - totalEmployee - totalEmployer;

    setResult({
        total: Math.round(currentBalance),
        employeeShare: Math.round(totalEmployee),
        employerShare: Math.round(totalEmployer),
        interest: Math.round(totalInterest)
    });

    addToHistory({
        toolId: 'pf-calc',
        toolName: 'EPF Calculator',
        result: `Maturity: ₹${Math.round(currentBalance).toLocaleString('en-IN')}`
    });
  };

  const faqs = [
    { question: "What is the current EPF interest rate?", answer: "The current EPF interest rate for FY 2023-24 is declared around 8.25% (subject to change by EPFO)." },
    { question: "When can I withdraw my PF?", answer: "You can withdraw your PF balance upon retirement (age 58). Partial withdrawals are allowed for specific purposes like marriage, medical emergency, or house purchase after a certain service period." }
  ];

  return (
    <ToolLayout
      title="EPF Calculator"
      description="Calculate the maturity amount of your Employee Provident Fund (EPF) savings."
      toolId="pf-calc"
      category={ToolCategory.FINANCE}
      faqs={faqs}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Basic Salary + DA (₹)</label>
            <input type="number" value={basicPay} onChange={e => setBasicPay(Number(e.target.value))} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-india-blue outline-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Current Age</label>
              <input type="number" value={age} onChange={e => setAge(Number(e.target.value))} className="w-full p-3 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Retirement Age</label>
              <input type="number" value={retireAge} onChange={e => setRetireAge(Number(e.target.value))} className="w-full p-3 border rounded-lg" />
            </div>
          </div>
          <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">Interest Rate (%)</label>
             <input type="number" value={interestRate} onChange={e => setInterestRate(Number(e.target.value))} className="w-full p-3 border rounded-lg" step="0.05" />
          </div>
          <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">Yearly Salary Increment (%)</label>
             <input type="number" value={increaseRate} onChange={e => setIncreaseRate(Number(e.target.value))} className="w-full p-3 border rounded-lg" />
          </div>
          <button onClick={calculatePF} className="w-full bg-india-blue text-white py-3 rounded-lg font-bold hover:bg-blue-900 transition-colors">Calculate Maturity Amount</button>
        </div>

        <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
            {result ? (
                <div className="space-y-6">
                    <div className="text-center pb-6 border-b border-gray-200">
                        <p className="text-sm text-gray-500 uppercase tracking-wide">Total Corpus at Age {retireAge}</p>
                        <p className="text-4xl font-bold text-india-green mt-2">₹ {result.total.toLocaleString('en-IN')}</p>
                    </div>
                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Your Contribution</span>
                            <span className="font-semibold">₹ {result.employeeShare.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Employer Contribution</span>
                            <span className="font-semibold">₹ {result.employerShare.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Total Interest Earned</span>
                            <span className="font-semibold text-india-orange">₹ {result.interest.toLocaleString('en-IN')}</span>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="h-full flex flex-col items-center justify-center text-gray-400">
                    <p>Enter details to see projection</p>
                </div>
            )}
        </div>
      </div>
    </ToolLayout>
  );
};