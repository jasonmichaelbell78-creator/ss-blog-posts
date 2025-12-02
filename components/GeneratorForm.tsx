import React, { useState } from 'react';
import { Tone, Topic } from '../types';
import { Sparkles, Loader2 } from 'lucide-react';

interface GeneratorFormProps {
  onGenerate: (topic: Topic, tone: Tone, context: string) => void;
  isGenerating: boolean;
}

export const GeneratorForm: React.FC<GeneratorFormProps> = ({ onGenerate, isGenerating }) => {
  const [topic, setTopic] = useState<Topic>(Topic.GENERAL_RECOVERY);
  const [tone, setTone] = useState<Tone>(Tone.WARM_INVITING);
  const [context, setContext] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate(topic, tone, context);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Topic Selection */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700">Content Topic</label>
            <div className="relative">
              <select
                value={topic}
                onChange={(e) => setTopic(e.target.value as Topic)}
                className="w-full appearance-none bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-teal-500 focus:border-teal-500 block p-3 pr-8"
                disabled={isGenerating}
              >
                {Object.values(Topic).map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
              </div>
            </div>
          </div>

          {/* Tone Selection */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700">Tone of Voice</label>
            <div className="relative">
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value as Tone)}
                className="w-full appearance-none bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-teal-500 focus:border-teal-500 block p-3 pr-8"
                disabled={isGenerating}
              >
                {Object.values(Tone).map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
              </div>
            </div>
          </div>
        </div>

        {/* Custom Context */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-700">
            Specific Focus <span className="text-slate-400 font-normal">(Optional)</span>
          </label>
          <input
            type="text"
            value={context}
            onChange={(e) => setContext(e.target.value)}
            placeholder="e.g., Focusing on summer activities in Nashville, or overcoming holiday stress..."
            className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-teal-500 focus:border-teal-500 block p-3"
            disabled={isGenerating}
          />
        </div>

        <button
          type="submit"
          disabled={isGenerating}
          className={`w-full flex items-center justify-center space-x-2 text-white font-medium rounded-lg text-sm px-5 py-4 text-center transition-all ${
            isGenerating 
              ? 'bg-slate-400 cursor-not-allowed' 
              : 'bg-teal-600 hover:bg-teal-700 shadow-md hover:shadow-lg'
          }`}
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Crafting Content...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              <span>Generate 3 Options</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};
