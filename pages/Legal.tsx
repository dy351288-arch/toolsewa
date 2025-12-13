import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';

export const LegalPage: React.FC = () => {
  const { type } = useParams<{ type: string }>();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [type]);

  let content;
  if (type === 'privacy-policy') {
    content = (
      <>
        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
        <p className="mb-4">At ToolSewa.in, we take your privacy seriously. This Privacy Policy document contains types of information that is collected and recorded by ToolSewa.in and how we use it.</p>
        <h2 className="text-xl font-semibold mb-2">Data Collection</h2>
        <p className="mb-4">We do not sell, trade, or otherwise transfer to outside parties your Personally Identifiable Information. Most tools on our site run client-side in your browser.</p>
        <h2 className="text-xl font-semibold mb-2">Cookies</h2>
        <p className="mb-4">We use cookies to store information including visitors' preferences, and the pages on the website that the visitor accessed or visited.</p>
      </>
    );
  } else if (type === 'terms') {
    content = (
      <>
        <h1 className="text-3xl font-bold mb-6">Terms & Conditions</h1>
        <p className="mb-4">By accessing this website we assume you accept these terms and conditions. Do not continue to use ToolSewa.in if you do not agree to take all of the terms and conditions stated on this page.</p>
        <h2 className="text-xl font-semibold mb-2">License</h2>
        <p className="mb-4">Unless otherwise stated, ToolSewa.in and/or its licensors own the intellectual property rights for all material on ToolSewa.in.</p>
      </>
    );
  } else {
    content = (
      <>
        <h1 className="text-3xl font-bold mb-6">Disclaimer</h1>
        <p className="mb-4">The information provided by ToolSewa.in is for general informational purposes only. All information on the Site is provided in good faith, however we make no representation or warranty of any kind regarding the accuracy, adequacy, validity, reliability, availability or completeness of any information on the Site.</p>
        <p className="mb-4">Financial calculators are for estimation purposes only.</p>
      </>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl prose">
      {content}
    </div>
  );
};