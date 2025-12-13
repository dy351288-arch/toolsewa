import React, { useState } from 'react';
import { ToolLayout } from '../../components/ToolLayout';
import { useAuth } from '../../context/AuthContext';
import { ToolCategory } from '../../types';
import { PDFDocument } from 'pdf-lib';
import { Upload, X, Download, FileText, Plus } from 'lucide-react';

export const PdfMerge: React.FC = () => {
  const { checkUsageLimit, addToHistory } = useAuth();
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).filter(f => f.type === 'application/pdf');
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const moveFile = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === files.length - 1) return;
    
    const newFiles = [...files];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    [newFiles[index], newFiles[swapIndex]] = [newFiles[swapIndex], newFiles[index]];
    setFiles(newFiles);
  };

  const mergePDFs = async () => {
    if (files.length < 2) return;
    if (!checkUsageLimit()) return;

    setIsProcessing(true);
    
    try {
      const mergedPdf = await PDFDocument.create();

      for (const file of files) {
        const fileBuffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(fileBuffer);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }

      const pdfBytes = await mergedPdf.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `merged_${Date.now()}.pdf`;
      link.click();

      addToHistory({
        toolId: 'pdf-merge',
        toolName: 'PDF Merge',
        result: `Merged ${files.length} files`
      });
    } catch (error) {
      console.error('Merge error:', error);
      alert('Failed to merge PDFs. Please try with valid PDF files.');
    } finally {
      setIsProcessing(false);
    }
  };

  const faqs = [
    { question: "Is it secure?", answer: "Yes, merging happens 100% in your browser. No files are uploaded to our servers." },
    { question: "How many files can I merge?", answer: "There is no strict limit, but performance depends on your device's memory." }
  ];

  return (
    <ToolLayout
      title="PDF Merge"
      description="Combine multiple PDF files into a single document. Reorder files as needed."
      toolId="pdf-merge"
      category={ToolCategory.PDF}
      faqs={faqs}
    >
      <div className="max-w-3xl mx-auto">
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer relative bg-gray-50/50">
          <input 
            type="file" 
            multiple 
            accept="application/pdf" 
            onChange={handleFileUpload}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <Upload size={48} className="mx-auto text-india-blue mb-4" />
          <p className="text-lg font-medium text-gray-700">Drop PDF files here or click to upload</p>
          <p className="text-sm text-gray-500 mt-2">Only PDF files supported</p>
        </div>

        {files.length > 0 && (
          <div className="mt-8 space-y-4">
            <h3 className="font-semibold text-gray-700 flex items-center justify-between">
              <span>Selected Files ({files.length})</span>
              <span className="text-xs font-normal text-gray-500">Drag/Buttons to reorder</span>
            </h3>
            
            <div className="space-y-2">
              {files.map((file, idx) => (
                <div key={idx} className="flex items-center justify-between bg-white p-3 rounded-lg border shadow-sm group">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="bg-red-50 p-2 rounded text-red-500">
                      <FileText size={20} />
                    </div>
                    <span className="truncate text-sm font-medium text-gray-700">{file.name}</span>
                    <span className="text-xs text-gray-400">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="flex flex-col gap-1 mr-2 opacity-50 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => moveFile(idx, 'up')} disabled={idx === 0} className="hover:bg-gray-100 p-0.5 rounded disabled:opacity-30">▲</button>
                      <button onClick={() => moveFile(idx, 'down')} disabled={idx === files.length - 1} className="hover:bg-gray-100 p-0.5 rounded disabled:opacity-30">▼</button>
                    </div>
                    <button onClick={() => removeFile(idx)} className="text-gray-400 hover:text-red-500 p-2">
                      <X size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-4 pt-4">
              <label className="flex-1 cursor-pointer">
                 <input type="file" multiple accept="application/pdf" onChange={handleFileUpload} className="hidden" />
                 <div className="flex items-center justify-center gap-2 border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                   <Plus size={20} /> Add More Files
                 </div>
              </label>
              
              <button 
                onClick={mergePDFs}
                disabled={isProcessing || files.length < 2}
                className="flex-[2] bg-india-green text-white py-3 rounded-lg font-bold text-lg hover:bg-green-700 transition-colors shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? 'Merging...' : (
                  <>
                    <Download size={20} /> Merge PDFs
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
};