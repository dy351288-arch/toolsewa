import React, { useState } from 'react';
import { ToolLayout } from '../../components/ToolLayout';
import { useAuth } from '../../context/AuthContext';
import { ToolCategory } from '../../types';
import { jsPDF } from 'jspdf';
import { Download, Plus, Trash2 } from 'lucide-react';

export const ResumeBuilder: React.FC = () => {
  const { checkUsageLimit, addToHistory } = useAuth();
  
  const [personal, setPersonal] = useState({ name: '', email: '', phone: '', location: '', summary: '' });
  const [education, setEducation] = useState([{ id: '1', degree: '', college: '', year: '' }]);
  const [experience, setExperience] = useState([{ id: '1', role: '', company: '', duration: '', details: '' }]);
  const [skills, setSkills] = useState('');

  // Helper functions for dynamic fields
  const addEdu = () => setEducation([...education, { id: Date.now().toString(), degree: '', college: '', year: '' }]);
  const removeEdu = (id: string) => setEducation(education.filter(e => e.id !== id));
  const updateEdu = (id: string, field: string, val: string) => setEducation(education.map(e => e.id === id ? { ...e, [field]: val } : e));

  const addExp = () => setExperience([...experience, { id: Date.now().toString(), role: '', company: '', duration: '', details: '' }]);
  const removeExp = (id: string) => setExperience(experience.filter(e => e.id !== id));
  const updateExp = (id: string, field: string, val: string) => setExperience(experience.map(e => e.id === id ? { ...e, [field]: val } : e));

  const generateResume = () => {
    if (!checkUsageLimit()) return;

    const doc = new jsPDF();
    const margin = 20;
    let y = 20;

    // Header
    doc.setFontSize(22);
    doc.text(personal.name.toUpperCase(), margin, y);
    y += 10;
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`${personal.email} | ${personal.phone} | ${personal.location}`, margin, y);
    y += 15;
    
    // Line
    doc.setDrawColor(200);
    doc.line(margin, y - 5, 190, y - 5);

    // Summary
    if (personal.summary) {
        doc.setTextColor(0);
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text("PROFESSIONAL SUMMARY", margin, y);
        y += 7;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        const splitSummary = doc.splitTextToSize(personal.summary, 170);
        doc.text(splitSummary, margin, y);
        y += splitSummary.length * 5 + 10;
    }

    // Experience
    if (experience.length > 0 && experience[0].role) {
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text("EXPERIENCE", margin, y);
        y += 7;
        
        experience.forEach(exp => {
            doc.setFontSize(11);
            doc.setFont("helvetica", "bold");
            doc.text(exp.role, margin, y);
            doc.setFont("helvetica", "normal");
            doc.text(exp.company + " | " + exp.duration, margin + 80, y, { align: 'left' }); // Simple alignment
            y += 5;
            if (exp.details) {
                doc.setFontSize(10);
                doc.setTextColor(80);
                const splitDetails = doc.splitTextToSize(exp.details, 170);
                doc.text(splitDetails, margin, y);
                y += splitDetails.length * 5 + 5;
                doc.setTextColor(0);
            } else {
                y += 5;
            }
        });
        y += 5;
    }

    // Education
    if (education.length > 0 && education[0].degree) {
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text("EDUCATION", margin, y);
        y += 7;
        education.forEach(edu => {
            doc.setFontSize(11);
            doc.setFont("helvetica", "normal");
            doc.text(`${edu.degree} - ${edu.college} (${edu.year})`, margin, y);
            y += 6;
        });
        y += 5;
    }

    // Skills
    if (skills) {
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text("SKILLS", margin, y);
        y += 7;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        const splitSkills = doc.splitTextToSize(skills, 170);
        doc.text(splitSkills, margin, y);
    }

    doc.save(`${personal.name.replace(/\s+/g, '_')}_Resume.pdf`);
    
    addToHistory({
        toolId: 'resume-builder',
        toolName: 'Resume Builder',
        result: `Created Resume for ${personal.name}`
    });
  };

  const faqs = [
    { question: "Is this resume format ATS friendly?", answer: "Yes, this builder generates a standard, text-based PDF layout which is highly readable by Application Tracking Systems (ATS) used by HR." }
  ];

  return (
    <ToolLayout
      title="Indian Resume Builder"
      description="Create a clean, professional resume formatted for Indian recruiters in minutes."
      toolId="resume-builder"
      category={ToolCategory.STUDENT}
      faqs={faqs}
    >
      <div className="space-y-8 max-w-4xl mx-auto">
        {/* Personal Info */}
        <section className="bg-white p-6 border rounded-xl space-y-4">
            <h3 className="text-lg font-bold text-gray-800 border-b pb-2">Personal Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" placeholder="Full Name" className="p-3 border rounded" value={personal.name} onChange={e => setPersonal({...personal, name: e.target.value})} />
                <input type="email" placeholder="Email" className="p-3 border rounded" value={personal.email} onChange={e => setPersonal({...personal, email: e.target.value})} />
                <input type="text" placeholder="Phone Number" className="p-3 border rounded" value={personal.phone} onChange={e => setPersonal({...personal, phone: e.target.value})} />
                <input type="text" placeholder="City, India" className="p-3 border rounded" value={personal.location} onChange={e => setPersonal({...personal, location: e.target.value})} />
            </div>
            <textarea placeholder="Professional Summary" className="w-full p-3 border rounded h-24" value={personal.summary} onChange={e => setPersonal({...personal, summary: e.target.value})} />
        </section>

        {/* Experience */}
        <section className="bg-white p-6 border rounded-xl space-y-4">
            <h3 className="text-lg font-bold text-gray-800 border-b pb-2">Experience</h3>
            {experience.map(exp => (
                <div key={exp.id} className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded relative">
                    <input type="text" placeholder="Job Role / Title" className="p-3 border rounded" value={exp.role} onChange={e => updateExp(exp.id, 'role', e.target.value)} />
                    <input type="text" placeholder="Company Name" className="p-3 border rounded" value={exp.company} onChange={e => updateExp(exp.id, 'company', e.target.value)} />
                    <input type="text" placeholder="Duration (e.g. Jan 2022 - Present)" className="p-3 border rounded" value={exp.duration} onChange={e => updateExp(exp.id, 'duration', e.target.value)} />
                    <textarea placeholder="Key Responsibilities" className="md:col-span-2 w-full p-3 border rounded h-20" value={exp.details} onChange={e => updateExp(exp.id, 'details', e.target.value)} />
                    {experience.length > 1 && <button onClick={() => removeExp(exp.id)} className="absolute top-2 right-2 text-red-500"><Trash2 size={16} /></button>}
                </div>
            ))}
            <button onClick={addExp} className="text-india-blue font-medium flex items-center gap-1"><Plus size={16} /> Add Position</button>
        </section>

        {/* Education */}
        <section className="bg-white p-6 border rounded-xl space-y-4">
            <h3 className="text-lg font-bold text-gray-800 border-b pb-2">Education</h3>
            {education.map(edu => (
                <div key={edu.id} className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 p-4 rounded relative">
                    <input type="text" placeholder="Degree (e.g. B.Tech)" className="p-3 border rounded" value={edu.degree} onChange={e => updateEdu(edu.id, 'degree', e.target.value)} />
                    <input type="text" placeholder="College / University" className="p-3 border rounded" value={edu.college} onChange={e => updateEdu(edu.id, 'college', e.target.value)} />
                    <input type="text" placeholder="Year (e.g. 2024)" className="p-3 border rounded" value={edu.year} onChange={e => updateEdu(edu.id, 'year', e.target.value)} />
                    {education.length > 1 && <button onClick={() => removeEdu(edu.id)} className="absolute top-2 right-2 text-red-500"><Trash2 size={16} /></button>}
                </div>
            ))}
            <button onClick={addEdu} className="text-india-blue font-medium flex items-center gap-1"><Plus size={16} /> Add Education</button>
        </section>

        {/* Skills */}
        <section className="bg-white p-6 border rounded-xl space-y-4">
            <h3 className="text-lg font-bold text-gray-800 border-b pb-2">Skills</h3>
            <textarea 
                placeholder="List your skills separated by commas (e.g. Java, React, Communication, Project Management)" 
                className="w-full p-3 border rounded h-24"
                value={skills}
                onChange={e => setSkills(e.target.value)}
            />
        </section>

        <button 
            onClick={generateResume}
            className="w-full bg-india-blue text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-900 transition-colors shadow-xl flex items-center justify-center gap-2"
        >
            <Download size={24} /> Download Resume PDF
        </button>
      </div>
    </ToolLayout>
  );
};