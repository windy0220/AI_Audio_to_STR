import React, { useState } from 'react';
import Dropzone from './components/Dropzone';
import SrtEditor from './components/SrtEditor';
import { generateSubtitles } from './services/geminiService';
import { fileToBase64 } from './utils/fileUtils';
import { AppState, ProcessingStats } from './types';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [srtContent, setSrtContent] = useState<string>('');
  const [processingStatus, setProcessingStatus] = useState<string>('');
  const [stats, setStats] = useState<ProcessingStats | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const handleFileAccepted = async (file: File) => {
    setAppState(AppState.PROCESSING);
    setStats({ fileName: file.name, fileSize: file.size });
    setErrorMsg('');

    try {
      const base64 = await fileToBase64(file);
      const srt = await generateSubtitles(base64, file.type, (status) => {
        setProcessingStatus(status);
      });
      setSrtContent(srt);
      setAppState(AppState.DONE);
    } catch (err: any) {
      console.error(err);
      setAppState(AppState.ERROR);
      setErrorMsg(err.message || "An unexpected error occurred processing your file.");
    }
  };

  const reset = () => {
    setAppState(AppState.IDLE);
    setSrtContent('');
    setStats(null);
    setErrorMsg('');
  };

  return (
    <div className="min-h-screen bg-[#0f0f11] text-white selection:bg-indigo-500/30">
      {/* Background Gradient */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-900/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-900/10 blur-[120px] rounded-full"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-12 flex flex-col min-h-screen">
        
        {/* Header */}
        <header className="flex flex-col items-center mb-16 text-center space-y-4">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2.5 rounded-xl shadow-lg shadow-indigo-500/20">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white">
              AutoSub <span className="text-indigo-400">Pro</span>
            </h1>
          </div>
          <p className="text-zinc-400 max-w-md text-sm md:text-base">
            AI-powered transcription for creators. Generates PR-ready simplified Chinese subtitles with perfect formatting.
          </p>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col items-center justify-center w-full">
          
          {appState === AppState.IDLE && (
            <div className="w-full animate-fade-in">
              <Dropzone onFileAccepted={handleFileAccepted} />
            </div>
          )}

          {appState === AppState.PROCESSING && (
            <div className="text-center animate-fade-in space-y-6">
              <div className="relative w-24 h-24 mx-auto">
                <div className="absolute inset-0 border-t-2 border-indigo-500 rounded-full animate-spin"></div>
                <div className="absolute inset-3 border-r-2 border-purple-500 rounded-full animate-spin reverse"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-mono text-zinc-500">AI</span>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-medium text-white mb-2">Processing Media</h3>
                <p className="text-zinc-400 text-sm animate-pulse">{processingStatus}</p>
              </div>
              <div className="text-xs text-zinc-600 bg-zinc-900/50 px-4 py-2 rounded-full inline-block">
                 Using Gemini 2.5 Flash
              </div>
            </div>
          )}

          {appState === AppState.DONE && (
            <SrtEditor 
              initialContent={srtContent} 
              fileName={stats?.fileName || 'subtitles'} 
              onReset={reset}
            />
          )}

          {appState === AppState.ERROR && (
            <div className="text-center animate-fade-in max-w-md mx-auto">
              <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-white mb-2">Processing Failed</h3>
              <p className="text-red-400 mb-8">{errorMsg}</p>
              <button 
                onClick={reset}
                className="px-6 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors font-medium text-sm"
              >
                Try Again
              </button>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="mt-16 text-center text-xs text-zinc-600">
          <p>Optimized for tech content &bull; Adobe Premiere Pro Standard &bull; Powered by Google Gemini</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
