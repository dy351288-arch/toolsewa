import { Tool, ToolCategory } from './types';

export const TOOLS: Tool[] = [
  // Finance
  {
    id: 'salary-calc',
    name: 'Salary Calculator',
    slug: 'salary-calculator',
    description: 'Calculate monthly in-hand salary from CTC with 2024-25 Tax Regime.',
    category: ToolCategory.FINANCE,
    icon: 'Calculator',
    isPopular: true
  },
  {
    id: 'pf-calc',
    name: 'EPF Calculator',
    slug: 'pf-calculator',
    description: 'Calculate the maturity amount of your Employee Provident Fund (EPF).',
    category: ToolCategory.FINANCE,
    icon: 'PiggyBank'
  },
  {
    id: 'gratuity-calc',
    name: 'Gratuity Calculator',
    slug: 'gratuity-calculator',
    description: 'Calculate gratuity amount based on salary and years of service.',
    category: ToolCategory.FINANCE,
    icon: 'Coins'
  },
  // Business
  {
    id: 'gst-calc',
    name: 'GST Calculator',
    slug: 'gst-calculator',
    description: 'Calculate GST exclusive and inclusive amounts instantly.',
    category: ToolCategory.BUSINESS,
    icon: 'Percent',
    isPopular: true
  },
  {
    id: 'gst-invoice',
    name: 'GST Invoice Generator',
    slug: 'gst-invoice-generator',
    description: 'Generate professional GST invoices and download as PDF.',
    category: ToolCategory.BUSINESS,
    icon: 'FileText'
  },
  // Student
  {
    id: 'resume-builder',
    name: 'Resume Builder',
    slug: 'resume-builder',
    description: 'Create a professional resume formatted for Indian job market.',
    category: ToolCategory.STUDENT,
    icon: 'UserCheck',
    isPopular: true
  },
  {
    id: 'handwriting-gen',
    name: 'Text to Handwriting',
    slug: 'handwriting-generator',
    description: 'Convert typed text into realistic handwritten notes.',
    category: ToolCategory.STUDENT,
    icon: 'PenTool'
  },
  // PDF
  {
    id: 'img-to-pdf',
    name: 'Image to PDF',
    slug: 'image-to-pdf',
    description: 'Convert multiple images (JPG/PNG) into a single PDF file.',
    category: ToolCategory.PDF,
    icon: 'Image',
    isPopular: true
  },
  {
    id: 'pdf-merge',
    name: 'PDF Merge',
    slug: 'pdf-merge',
    description: 'Combine multiple PDF files into a single document.',
    category: ToolCategory.PDF,
    icon: 'Files'
  },
  {
    id: 'pdf-compress',
    name: 'PDF Compress',
    slug: 'pdf-compress',
    description: 'Reduce the file size of your PDF documents.',
    category: ToolCategory.PDF,
    icon: 'Minimize2'
  },
  // AI
  {
    id: 'ai-chat',
    name: 'AI Assistant',
    slug: 'ai-assistant',
    description: 'Get answers to your daily queries using advanced AI.',
    category: ToolCategory.AI,
    icon: 'Bot',
    isPopular: true
  }
];

export const CATEGORIES = Object.values(ToolCategory);

export const getCategorySlug = (category: ToolCategory | string) => {
  if (category === ToolCategory.FINANCE) return 'salary-tools';
  if (category === ToolCategory.BUSINESS) return 'gst-tools';
  if (category === ToolCategory.STUDENT) return 'student-tools';
  if (category === ToolCategory.PDF) return 'pdf-tools';
  if (category === ToolCategory.AI) return 'ai-tools';
  return 'tools';
};

export const getCategoryFromSlug = (slug: string): ToolCategory | string => {
  if (slug === 'salary-tools') return ToolCategory.FINANCE;
  if (slug === 'gst-tools') return ToolCategory.BUSINESS;
  if (slug === 'student-tools') return ToolCategory.STUDENT;
  if (slug === 'pdf-tools') return ToolCategory.PDF;
  if (slug === 'ai-tools') return ToolCategory.AI;
  return '';
};