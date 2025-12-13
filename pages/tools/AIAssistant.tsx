import React, { useState } from 'react';
import { ToolLayout } from '../../components/ToolLayout';
import { useAuth } from '../../context/AuthContext';
import { ToolCategory } from '../../types';
import { Send, Loader2, Bot } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

export const AIAssistant: React.FC = () => {
  const { checkUsageLimit, addToHistory } = useAuth();
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!prompt.trim() || !checkUsageLimit()) return;
    setLoading(true);
    try {
        const apiKey = process.env.API_KEY;
        if (!apiKey || apiKey === 'undefined') {
            await new Promise(r => setTimeout(r, 1000));
            setResponse("Please configure the API_KEY to use the AI features.");
        } else {
            const ai = new GoogleGenAI({ apiKey });
            const result = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
            setResponse(result.text || "No response.");
        }
        addToHistory({toolId: 'ai-chat', toolName: 'AI Assistant', result: 'Query Processed'});
    } catch (e) {
        setResponse("Error generating response.");
    } finally {
        setLoading(false);
    }
  };

  return (
    <ToolLayout
      title="AI Assistant"
      description="Your personal AI helper for daily questions and tasks."
      toolId="ai-chat"
      category={ToolCategory.AI}
    >
        <div className="flex flex-col h-[500px] border rounded-xl overflow-hidden">
            <div className="flex-1 bg-gray-50 p-6 overflow-y-auto">
                {response ? (
                    <div className="bg-white p-4 rounded-lg shadow-sm whitespace-pre-wrap">{response}</div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400">
                        <Bot size={48} className="mb-2 opacity-20" />
                        <p>Ask me anything!</p>
                    </div>
                )}
            </div>
            <div className="p-4 bg-white border-t flex gap-2">
                <input 
                    value={prompt} 
                    onChange={e => setPrompt(e.target.value)} 
                    onKeyDown={e => e.key === 'Enter' && handleSend()}
                    placeholder="Type your message..." 
                    className="flex-1 border rounded-lg px-4 focus:outline-none focus:ring-2 focus:ring-india-blue" 
                />
                <button onClick={handleSend} disabled={loading} className="bg-india-blue text-white p-3 rounded-lg disabled:opacity-50">
                    {loading ? <Loader2 className="animate-spin" /> : <Send />}
                </button>
            </div>
        </div>
    </ToolLayout>
  );
};