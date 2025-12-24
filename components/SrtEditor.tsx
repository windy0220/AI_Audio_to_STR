import React, { useState, useEffect } from 'react';
import { downloadSrt } from '../utils/fileUtils';

interface SrtEditorProps {
  initialContent: string;
  fileName: string;
  onReset: () => void;
}

const SrtEditor: React.FC<SrtEditorProps> = ({ initialContent, fileName, onReset }) => {
  const [content, setContent] = useState(initialContent);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    downloadSrt(content, fileName);
  };

  return (
    <div className="w-full max-w-4xl mx-auto animate-fade-in-up">
      <div className="flex flex-col md:flex-row items-center justify-between mb-4 gap-4">
        <div>
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            Transcription Ready
          </h2>
          <p className="text-zinc-400 text-sm mt-1">Review and edit your subtitles below.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={onReset}
            className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors"
          >
            Start Over
          </button>
          
          <button 
            onClick={handleCopy}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
              ${copied 
                ? 'bg-green-500/20 text-green-400' 
                : 'bg-zinc-800 hover:bg-zinc-700 text-white'
              }
            `}
          >
            {copied ? (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                Copied
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
                Copy Text
              </>
            )}
          </button>

          <button 
            onClick={handleDownload}
            className="flex items-center gap-2 px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-semibold shadow-lg shadow-indigo-500/20 transition-all hover:scale-105"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
            Download .SRT
          </button>
        </div>
      </div>

      <div className="relative group">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full h-[60vh] bg-[#1a1a1e] text-zinc-300 font-mono text-sm p-6 rounded-xl border border-zinc-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none resize-none shadow-xl leading-relaxed"
          spellCheck={false}
        />
        <div className="absolute top-4 right-4 text-xs text-zinc-600 bg-[#1a1a1e] px-2 py-1 rounded border border-zinc-800">
          Editable
        </div>
      </div>
      
      <div className="mt-4 flex gap-4 text-xs text-zinc-500 justify-center">
        <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>
            Adobe Premiere Pro Compatible
        </div>
        <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>
            18 Char Limit Applied
        </div>
        <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>
            Smart Spacing
        </div>
      </div>
    </div>
  );
};

export default SrtEditor;
