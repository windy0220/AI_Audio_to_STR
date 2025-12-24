import React, { useCallback, useState } from 'react';
import { formatBytes } from '../utils/fileUtils';

interface DropzoneProps {
  onFileAccepted: (file: File) => void;
}

const MAX_SIZE = 20 * 1024 * 1024; // 20MB limitation for client-side base64 safety

const Dropzone: React.FC<DropzoneProps> = ({ onFileAccepted }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const validateAndAccept = (file: File) => {
    setError(null);
    if (file.size > MAX_SIZE) {
      setError(`File too large (${formatBytes(file.size)}). Max limit is ${formatBytes(MAX_SIZE)}.`);
      return;
    }
    // Simple mime check
    if (!file.type.startsWith('audio/') && !file.type.startsWith('video/')) {
      setError("Please upload a valid audio or video file.");
      return;
    }
    onFileAccepted(file);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      validateAndAccept(files[0]);
    }
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndAccept(e.target.files[0]);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ease-out
          ${isDragging 
            ? 'border-indigo-500 bg-indigo-500/10 scale-[1.02]' 
            : 'border-zinc-700 hover:border-zinc-500 hover:bg-zinc-800/30 bg-zinc-900/50'
          }
        `}
      >
        <input
          type="file"
          id="fileInput"
          className="hidden"
          accept="audio/*,video/*"
          onChange={handleFileInput}
        />
        
        <div className="flex flex-col items-center gap-4">
          <div className={`p-4 rounded-full ${isDragging ? 'bg-indigo-500/20 text-indigo-400' : 'bg-zinc-800 text-zinc-400'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
            </svg>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-white">Upload Media</h3>
            <p className="text-zinc-400 text-sm">
              Drag & drop audio or video, or <label htmlFor="fileInput" className="text-indigo-400 hover:text-indigo-300 cursor-pointer font-medium hover:underline">browse</label>
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-zinc-500 mt-2">
            <span className="bg-zinc-800/50 px-2 py-1 rounded">MP4</span>
            <span className="bg-zinc-800/50 px-2 py-1 rounded">MP3</span>
            <span className="bg-zinc-800/50 px-2 py-1 rounded">WAV</span>
            <span className="text-zinc-600">Max {formatBytes(MAX_SIZE)}</span>
          </div>
        </div>

        {error && (
          <div className="absolute -bottom-16 left-0 right-0 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg animate-fade-in">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dropzone;
