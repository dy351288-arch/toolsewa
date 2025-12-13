import React, { useState } from 'react';
import { ToolLayout } from '../../components/ToolLayout';
import { useAuth } from '../../context/AuthContext';
import { ToolCategory } from '../../types';

export const GSTCalculator: React.FC = () => {
  const { checkUsageLimit, addToHistory } = useAuth();
  const [amount, setAmount] = useState(1000);
  const [rate, setRate] = useState(18);
  const [type, setType] = useState<'exclusive' | 'inclusive'>('exclusive');
  const [result, setResult] = useState<any>(null);

  const calculate = () => {
    if (!checkUsageLimit()) return;
    let net = 0, gst = 0, total = 0;
    if (type === 'exclusive') {
        gst = (amount * rate) / 100;
        total = amount + gst;
        net = amount;
    } else {
        total = amount;
        net = amount / (1 + rate/100);
        gst = total - net;
    }
    setResult({ net, gst, total });
    addToHistory({
        toolId: 'gst-calc',
        toolName: 'GST Calculator',
        result: `GST: ₹${gst.toFixed(2)}`
    });
  };

  return (
    <ToolLayout
      title="GST Calculator"
      description="Easily calculate inclusive and exclusive GST amounts for Indian goods and services."
      toolId="gst-calc"
      category={ToolCategory.BUSINESS}
      faqs={[{question: "What are the standard GST rates?", answer: "Common rates in India are 5%, 12%, 18%, and 28%."}]}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         <div className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Amount (₹)</label>
                <input type="number" value={amount} onChange={e => setAmount(Number(e.target.value))} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-india-blue outline-none" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">GST Rate (%)</label>
                <div className="flex gap-2">
                    {[5, 12, 18, 28].map(r => (
                        <button key={r} onClick={() => setRate(r)} className={`flex-1 py-2 rounded border ${rate === r ? 'bg-india-blue text-white border-india-blue' : 'bg-white'}`}>{r}%</button>
                    ))}
                </div>
            </div>
            <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" checked={type === 'exclusive'} onChange={() => setType('exclusive')} /> Exclusive (Add GST)
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" checked={type === 'inclusive'} onChange={() => setType('inclusive')} /> Inclusive (Remove GST)
                </label>
            </div>
            <button onClick={calculate} className="w-full bg-india-blue text-white py-3 rounded-lg font-bold">Calculate</button>
         </div>
         
         <div className="bg-gray-50 border rounded-xl p-6 flex flex-col justify-center space-y-4">
            {result ? (
                <>
                    <div className="flex justify-between border-b pb-2"><span className="text-gray-500">Net Amount</span><span className="font-semibold">₹ {result.net.toFixed(2)}</span></div>
                    <div className="flex justify-between border-b pb-2"><span className="text-gray-500">GST ({rate}%)</span><span className="font-semibold text-red-500">₹ {result.gst.toFixed(2)}</span></div>
                    <div className="flex justify-between pt-2"><span className="font-bold text-lg">Total</span><span className="font-bold text-2xl text-india-green">₹ {result.total.toFixed(2)}</span></div>
                </>
            ) : (
                <p className="text-center text-gray-400">Enter amount to calculate</p>
            )}
         </div>
      </div>
    </ToolLayout>
  );
};