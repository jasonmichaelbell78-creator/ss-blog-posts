import React, { useState, useEffect } from 'react';
import { Tone, Topic, ImageStyle, ContentType } from '../types';
import { Sparkles, Loader2, Palette, FileType } from 'lucide-react';

interface GeneratorFormProps {
  onGenerate: (topic: Topic, tone: Tone, style: ImageStyle, contentType: ContentType, context: string) => void;
  isGenerating: boolean;
  allowedContentTypes?: ContentType[];
  contextLabel?: string;
  mode: 'social' | 'seo' | 'competitor' | 'marketing';
}

export const GeneratorForm: React.FC<GeneratorFormProps> = ({ 
  onGenerate, 
  isGenerating, 
  allowedContentTypes,
  contextLabel = "Specific Focus",
  mode
}) => {
  // If no allowed types provided, use all (fallback)
  const availableTypes = allowedContentTypes || Object.values(ContentType);

  const [contentType, setContentType] = useState<ContentType>(availableTypes[0]);
  const [topic, setTopic] = useState<Topic>(Topic.SOBER_SOLUTIONS_BRAND);
  const [tone, setTone] = useState<Tone>(Tone.WARM_INVITING);
  const [style, setStyle] = useState<ImageStyle>(ImageStyle.PHOTOREALISTIC);
  const [context, setContext] = useState('');

  // Update selection if allowed types change (e.g. switching tabs)
  useEffect(() => {
    if (!availableTypes.includes(contentType)) {
      setContentType(availableTypes[0]);
    }
  }, [availableTypes]);

  // Filter Topics based on Mode
  const getFilteredTopics = () => {
    if (mode === 'seo') {
      return [
        Topic.SOBER_SOLUTIONS_BRAND,
        Topic.NASHVILLE_RECOVERY,
        Topic.ADMISSIONS_OPENINGS,
        Topic.PROGRAM_FEATURES,
        Topic.PARTNERSHIP_OPPORTUNITIES,
        Topic.GENERAL_RECOVERY
      ];
    }
    if (mode === 'competitor') {
      return [
        Topic.COMPETITOR_OVERVIEW,
        Topic.MARKET_POSITIONING
      ];
    }
    if (mode === 'marketing') {
      return [
        Topic.ADMISSIONS_OPENINGS,
        Topic.GROWTH_CAMPAIGN,
        Topic.REPUTATION_MANAGEMENT,
        Topic.ALUMNI_ENGAGEMENT,
        Topic.SOBER_SOLUTIONS_BRAND,
        Topic.PARTNERSHIP_OPPORTUNITIES
      ];
    }
    // Social Mode gets everything else + Brand
    return [
      Topic.GENERAL_RECOVERY,
      Topic.SOBER_SOLUTIONS_BRAND,
      Topic.FAMILY_SUPPORT,
      Topic.RELAPSE_PREVENTION,
      Topic.MENTAL_HEALTH_WELLNESS,
      Topic.HOLISTIC_LIVING,
      Topic.EARLY_SOBRIETY_TIPS,
      Topic.COMMUNITY_CONNECTION,
      Topic.ALUMNI_SUCCESS,
      Topic.NASHVILLE_RECOVERY
    ];
  };

  // Filter Tones based on Mode
  const getFilteredTones = () => {
    if (mode === 'competitor') {
      return [Tone.ANALYTICAL_OBJECTIVE, Tone.PROFESSIONAL_AUTHORITATIVE, Tone.DIRECT_EDUCATIONAL];
    }
    if (mode === 'marketing') {
      return [Tone.PERSUASIVE_URGENT, Tone.WARM_INVITING, Tone.PROFESSIONAL_AUTHORITATIVE, Tone.INSPIRATIONAL];
    }
    return Object.values(Tone);
  }

  const filteredTopics = getFilteredTopics();
  const filteredTones = getFilteredTones();

  // Reset topic if the current one isn't in the new list (when switching modes)
  useEffect(() => {
    if (!filteredTopics.includes(topic)) {
      setTopic(filteredTopics[0]);
    }
  }, [mode]);
  
  // Reset tone if current isn't in new list
  useEffect(() => {
    if (!filteredTones.includes(tone)) {
      setTone(filteredTones[0]);
    }
  }, [mode]);

  // Determine if Image Style should be shown
  const showVisuals = 
    contentType !== ContentType.SEO_META && 
    contentType !== ContentType.FAQ_SECTION &&
    contentType !== ContentType.GOOGLE_ADS &&
    contentType !== ContentType.STRATEGY_PLAN;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate(topic, tone, style, contentType, context);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className={`grid grid-cols-1 md:grid-cols-2 ${showVisuals ? 'lg:grid-cols-4' : 'lg:grid-cols-3'} gap-6`}>
          
          {/* Content Type Selection */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700 flex items-center gap-2">
              <FileType className="w-4 h-4 text-slate-400" />
              Format
            </label>
            <div className="relative">
              <select
                value={contentType}
                onChange={(e) => setContentType(e.target.value as ContentType)}
                className="w-full appearance-none bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-teal-500 focus:border-teal-500 block p-3 pr-8"
                disabled={isGenerating}
              >
                {availableTypes.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
              </div>
            </div>
          </div>

          {/* Topic Selection - Filtered by Mode */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700">Focus</label>
            <div className="relative">
              <select
                value={topic}
                onChange={(e) => setTopic(e.target.value as Topic)}
                className="w-full appearance-none bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-teal-500 focus:border-teal-500 block p-3 pr-8"
                disabled={isGenerating}
              >
                {filteredTopics.map((t) => (
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
            <label className="block text-sm font-semibold text-slate-700">Tone</label>
            <div className="relative">
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value as Tone)}
                className="w-full appearance-none bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-teal-500 focus:border-teal-500 block p-3 pr-8"
                disabled={isGenerating}
              >
                {filteredTones.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
              </div>
            </div>
          </div>

          {/* Image Style Selection - Hidden for Meta/FAQ/Ads */}
          {showVisuals && (
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700 flex items-center gap-2">
                <Palette className="w-4 h-4 text-slate-400" />
                Visual Style
              </label>
              <div className="relative">
                <select
                  value={style}
                  onChange={(e) => setStyle(e.target.value as ImageStyle)}
                  className="w-full appearance-none bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-teal-500 focus:border-teal-500 block p-3 pr-8"
                  disabled={isGenerating}
                >
                  {Object.values(ImageStyle).map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-700">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Custom Context */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-700">
            {contextLabel} <span className="text-slate-400 font-normal">(Required)</span>
          </label>
          <input
            type="text"
            value={context}
            onChange={(e) => setContext(e.target.value)}
            placeholder={
              mode === 'competitor' ? "e.g., 'Pathway to Peace Nashville' or 'pathwaytopeace.com'" :
              mode === 'marketing' ? "e.g., 'Fill 2 beds by November' or 'Promote Men's Program'" :
              mode === 'seo' ? "e.g., sober living nashville, halfway house tn..." : 
              "e.g., Focusing on summer activities..."
            }
            className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-teal-500 focus:border-teal-500 block p-3"
            disabled={isGenerating}
            required
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
              <span>Analyzing & Creating...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              <span>Generate Options</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};