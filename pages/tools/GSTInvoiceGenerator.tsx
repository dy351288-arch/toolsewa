import React, { useState } from 'react';
import { ToolLayout } from '../../components/ToolLayout';
import { useAuth } from '../../context/AuthContext';
import { ToolCategory } from '../../types';
import { jsPDF } from 'jspdf';
import { Trash2, Plus, Download } from 'lucide-react';

interface InvoiceItem {
    id: string;
    description: string;
    quantity: number;
    price: number;
    gstRate: number;
}

export const GSTInvoiceGenerator: React.FC = () => {
  const { checkUsageLimit, addToHistory } = useAuth();
  const [businessName, setBusinessName] = useState('');
  const [clientName, setClientName] = useState('');
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0]);
  const [items, setItems] = useState<InvoiceItem[]>([{ id: '1', description: 'Service Charge', quantity: 1, price: 1000, gstRate: 18 }]);

  const addItem = () => {
    setItems([...items, { id: Date.now().toString(), description: '', quantity: 1, price: 0, gstRate: 18 }]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) setItems(items.filter(i => i.id !== id));
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: any) => {
    setItems(items.map(i => i.id === id ? { ...i, [field]: value } : i));
  };

  const calculateTotal = () => {
    return items.reduce((acc, item) => {
      const taxable = item.quantity * item.price;
      const gst = taxable * (item.gstRate / 100);
      return acc + taxable + gst;
    }, 0);
  };

  const generatePDF = () => {
    if (!checkUsageLimit()) return;

    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(20);
    doc.text("INVOICE", 105, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.text(`From: ${businessName || 'Your Business Name'}`, 20, 40);
    doc.text(`To: ${clientName || 'Client Name'}`, 20, 50);
    doc.text(`Date: ${invoiceDate}`, 150, 40);
    
    // Table Header
    let y = 70;
    doc.setFillColor(240, 240, 240);
    doc.rect(20, y-5, 170, 10, 'F');
    doc.setFontSize(10);
    doc.setFont('helvetica');
    doc.text("Item", 25, y);
    doc.text("Qty", 80, y);
    doc.text("Price", 100, y);
    doc.text("GST %", 130, y);
    doc.text("Total", 160, y);
    
    y += 10;
    
    // Items
    items.forEach(item => {
        const taxable = item.quantity * item.price;
        const gst = taxable * (item.gstRate / 100);
        const total = taxable + gst;
        
        doc.text(item.description || 'Item', 25, y);
        doc.text(item.quantity.toString(), 80, y);
        doc.text(item.price.toFixed(2), 100, y);
        doc.text(item.gstRate + '%', 130, y);
        doc.text(total.toFixed(2), 160, y);
        y += 10;
    });
    
    // Total
    y += 10;
    doc.setFontSize(14);
    doc.text(`Grand Total: Rs. ${calculateTotal().toFixed(2)}`, 130, y);
    
    doc.save("invoice.pdf");
    
    addToHistory({
        toolId: 'gst-invoice',
        toolName: 'GST Invoice Generator',
        result: `Generated Invoice for ₹${calculateTotal().toFixed(2)}`
    });
  };

  const faqs = [
    { question: "Is this invoice valid for GST filing?", answer: "This tool generates a standard invoice format. Ensure you include your GSTIN and the client's GSTIN manually in the name fields for official compliance." }
  ];

  return (
    <ToolLayout
      title="GST Invoice Generator"
      description="Create professional GST-compliant PDF invoices for your business instantly."
      toolId="gst-invoice"
      category={ToolCategory.BUSINESS}
      faqs={faqs}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
                <label className="text-sm font-medium">Your Business Details</label>
                <textarea 
                    value={businessName} 
                    onChange={e => setBusinessName(e.target.value)}
                    placeholder="Business Name, Address, GSTIN..."
                    className="w-full p-3 border rounded-lg h-24 resize-none"
                />
            </div>
            <div className="space-y-2">
                <label className="text-sm font-medium">Bill To (Client)</label>
                <textarea 
                    value={clientName} 
                    onChange={e => setClientName(e.target.value)}
                    placeholder="Client Name, Address..."
                    className="w-full p-3 border rounded-lg h-24 resize-none"
                />
            </div>
        </div>
        
        <div>
            <label className="text-sm font-medium">Invoice Items</label>
            <div className="bg-gray-50 p-4 rounded-lg mt-2 space-y-3">
                {items.map((item, index) => (
                    <div key={item.id} className="grid grid-cols-12 gap-2 items-center">
                        <div className="col-span-4">
                            <input 
                                type="text" 
                                placeholder="Description" 
                                value={item.description}
                                onChange={e => updateItem(item.id, 'description', e.target.value)}
                                className="w-full p-2 border rounded"
                            />
                        </div>
                        <div className="col-span-2">
                            <input 
                                type="number" 
                                placeholder="Qty" 
                                value={item.quantity}
                                onChange={e => updateItem(item.id, 'quantity', Number(e.target.value))}
                                className="w-full p-2 border rounded"
                            />
                        </div>
                        <div className="col-span-2">
                            <input 
                                type="number" 
                                placeholder="Price" 
                                value={item.price}
                                onChange={e => updateItem(item.id, 'price', Number(e.target.value))}
                                className="w-full p-2 border rounded"
                            />
                        </div>
                        <div className="col-span-2">
                            <select 
                                value={item.gstRate}
                                onChange={e => updateItem(item.id, 'gstRate', Number(e.target.value))}
                                className="w-full p-2 border rounded"
                            >
                                <option value="5">5%</option>
                                <option value="12">12%</option>
                                <option value="18">18%</option>
                                <option value="28">28%</option>
                            </select>
                        </div>
                        <div className="col-span-2 text-right">
                             {items.length > 1 && (
                                <button onClick={() => removeItem(item.id)} className="text-red-500 hover:bg-red-50 p-2 rounded">
                                    <Trash2 size={16} />
                                </button>
                             )}
                        </div>
                    </div>
                ))}
                <button onClick={addItem} className="flex items-center gap-2 text-india-blue text-sm font-medium mt-2">
                    <Plus size={16} /> Add Item
                </button>
            </div>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-center bg-gray-100 p-4 rounded-lg">
             <div className="text-lg font-bold">
                Total Amount: <span className="text-india-green">₹ {calculateTotal().toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
             </div>
             <button 
                onClick={generatePDF}
                className="mt-4 md:mt-0 flex items-center gap-2 bg-india-blue text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-900 transition-colors shadow-lg"
            >
                <Download size={20} /> Download PDF Invoice
             </button>
        </div>
      </div>
    </ToolLayout>
  );
};