import React, { useState, useRef } from 'react';
import { ToolLayout } from '../../components/ToolLayout';
import { useAuth } from '../../context/AuthContext';
import { ToolCategory } from '../../types';
import { jsPDF } from 'jspdf';
import { Download } from 'lucide-react';

export const Handwriter: React.FC = () => {
  const { checkUsageLimit, addToHistory } = useAuth();
  const [text, setText] = useState('Type here to convert to handwritten notes...');
  const [inkColor, setInkColor] = useState('#000080');
  const canvasRef = useRef<HTMLDivElement>(null);

  const download = () => {
    if (!checkUsageLimit()) return;
    const doc = new jsPDF();
    if (canvasRef.current) {
        doc.html(canvasRef.current, {
            callback: (d) => d.save('notes.pdf'),
            x: 10, y: 10, width: 180, windowWidth: 800
        });
        addToHistory({toolId: 'handwriting-gen', toolName: 'Handwriting Gen', result: 'Downloaded PDF'});
    }
  };

  return (
    <ToolLayout
      title="Text to Handwriting"
      description="Convert digital text into realistic handwritten notes for assignments."
      toolId="handwriting-gen"
      category={ToolCategory.STUDENT}
    >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
                <textarea value={text} onChange={e => setText(e.target.value)} className="w-full h-64 p-4 border rounded-lg resize-none" />
                <div className="flex gap-2">
                    {['#000080', '#000000', '#FF0000', '#138808'].map(c => (
                        <button key={c} onClick={() => setInkColor(c)} className={`w-8 h-8 rounded-full border-2 ${inkColor === c ? 'border-gray-400' : 'border-transparent'}`} style={{backgroundColor: c}} />
                    ))}
                </div>
                <button onClick={download} className="w-full bg-india-green text-white py-2 rounded-lg flex items-center justify-center gap-2"><Download size={18} /> Download PDF</button>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg overflow-auto">
                <div ref={canvasRef} className="bg-white p-8 min-h-[500px] w-[595px]" style={{fontFamily: 'Caveat, cursive', color: inkColor, fontSize: '24px', lineHeight: '1.6', backgroundImage: 'linear-gradient(#e5e7eb 1px, transparent 1px)', backgroundSize: '100% 2rem'}}>
                    {text}
                </div>
            </div>
        </div>
    </ToolLayout>
  );
};