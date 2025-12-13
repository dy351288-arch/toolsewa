import React, { useState } from 'react';
import { ToolLayout } from '../../components/ToolLayout';
import { useAuth } from '../../context/AuthContext';
import { ToolCategory } from '../../types';
import { jsPDF } from 'jspdf';
import { Upload, X, Download, FileImage } from 'lucide-react';

export const ImageToPdf: React.FC = () => {
  const { checkUsageLimit, addToHistory } = useAuth();
  const [images, setImages] = useState<string[]>([]);
  const [isConverting, setIsConverting] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const promises = files.map(file => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.readAsDataURL(file);
        });
      });

      Promise.all(promises).then(newImages => {
        setImages(prev => [...prev, ...newImages]);
      });
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const convertToPdf = () => {
    if (images.length === 0) return;
    if (!checkUsageLimit()) return;

    setIsConverting(true);
    
    // Simulate slight delay for UX
    setTimeout(() => {
        const doc = new jsPDF();
        
        images.forEach((imgData, index) => {
            if (index > 0) doc.addPage();
            
            const imgProps = doc.getImageProperties(imgData);
            const pdfWidth = doc.internal.pageSize.getWidth();
            const pdfHeight = doc.internal.pageSize.getHeight();
            
            // Calculate aspect ratio to fit page
            const imgRatio = imgProps.width / imgProps.height;
            const pdfRatio = pdfWidth / pdfHeight;
            
            let w, h;
            if (imgRatio > pdfRatio) {
                w = pdfWidth - 20; // Margin
                h = w / imgRatio;
            } else {
                h = pdfHeight - 20; // Margin
                w = h * imgRatio;
            }
            
            const x = (pdfWidth - w) / 2;
            const y = (pdfHeight - h) / 2;
            
            doc.addImage(imgData, 'JPEG', x, y, w, h);
        });

        doc.save('converted-images.pdf');
        
        addToHistory({
            toolId: 'img-to-pdf',
            toolName: 'Image to PDF',
            result: `Converted ${images.length} images`
        });
        setIsConverting(false);
    }, 1000);
  };

  const faqs = [
    { question: "Is my data safe?", answer: "Yes, the conversion happens entirely in your browser. No images are uploaded to any server." }
  ];

  return (
    <ToolLayout
      title="Image to PDF Converter"
      description="Convert multiple JPG or PNG images into a single lightweight PDF document securely in your browser."
      toolId="img-to-pdf"
      category={ToolCategory.PDF}
      faqs={faqs}
    >
        <div className="max-w-3xl mx-auto">
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer relative">
                <input 
                    type="file" 
                    multiple 
                    accept="image/*" 
                    onChange={handleImageUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <Upload size={48} className="mx-auto text-india-blue mb-4" />
                <p className="text-lg font-medium text-gray-700">Drop images here or click to upload</p>
                <p className="text-sm text-gray-500 mt-2">Supports JPG, PNG</p>
            </div>

            {images.length > 0 && (
                <div className="mt-8">
                    <h3 className="font-semibold mb-4 text-gray-700">Selected Images ({images.length})</h3>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                        {images.map((img, idx) => (
                            <div key={idx} className="relative group aspect-square bg-gray-100 rounded-lg overflow-hidden border">
                                <img src={img} alt={`Upload ${idx}`} className="w-full h-full object-cover" />
                                <button 
                                    onClick={() => removeImage(idx)}
                                    className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <X size={12} />
                                </button>
                            </div>
                        ))}
                    </div>

                    <button 
                        onClick={convertToPdf}
                        disabled={isConverting}
                        className="w-full mt-8 bg-india-green text-white py-3 rounded-lg font-bold text-lg hover:bg-green-700 transition-colors shadow-lg flex items-center justify-center gap-2"
                    >
                        {isConverting ? 'Converting...' : (
                            <>
                                <Download size={20} /> Convert to PDF
                            </>
                        )}
                    </button>
                </div>
            )}
        </div>
    </ToolLayout>
  );
};