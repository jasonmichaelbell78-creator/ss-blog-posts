import React, { useState, useCallback } from 'react';
import { GeneratorForm } from './components/GeneratorForm';
import { PostCard } from './components/PostCard';
import { FullPost, Topic, Tone, ImageStyle, ContentType } from './types';
import { generatePostIdeas, generatePostImage } from './services/geminiService';
import { Layout, Leaf, ArrowLeft, Users, Search, Code, Megaphone, LineChart, TrendingUp } from 'lucide-react';

type AppMode = 'hub' | 'social' | 'seo' | 'competitor' | 'marketing';

export default function App() {
  const [mode, setMode] = useState<AppMode>('hub');
  const [posts, setPosts] = useState<FullPost[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [currentStyle, setCurrentStyle] = useState<ImageStyle>(ImageStyle.PHOTOREALISTIC);

  const handleGenerate = useCallback(async (topic: Topic, tone: Tone, style: ImageStyle, contentType: ContentType, context: string) => {
    setIsGenerating(true);
    setError(null);
    setPosts([]); 
    setCurrentStyle(style);

    try {
      // 1. Generate Text Content
      const ideas = await generatePostIdeas(topic, tone, contentType, context);
      
      if (!ideas || ideas.length === 0) {
        throw new Error("No ideas were generated. Please try again.");
      }

      // Initialize posts with loading state for images
      // Note: SEO Meta tags and Google Ads might not generate images, controlled in service
      const initialPosts: FullPost[] = ideas.map(idea => ({
        ...idea,
        id: crypto.randomUUID(),
        contentType: contentType,
        isImageLoading: true
      }));

      setPosts(initialPosts);
      setIsGenerating(false);

      // 2. Generate Images in Parallel (Background)
      initialPosts.forEach(async (post) => {
        try {
          const imageUrl = await generatePostImage(post.imagePrompt, style, false);
          setPosts(currentPosts => 
            currentPosts.map(p => 
              p.id === post.id 
                ? { ...p, imageUrl, isImageLoading: false } 
                : p
            )
          );
        } catch (err) {
          console.error(`Failed to generate image for post ${post.id}`, err);
          setPosts(currentPosts => 
            currentPosts.map(p => 
              p.id === post.id 
                ? { ...p, isImageLoading: false } 
                : p
            )
          );
        }
      });

    } catch (err) {
      console.error(err);
      setError("Something went wrong while generating content. Please check your API key or try again.");
      setIsGenerating(false);
    }
  }, []);

  const handleRegenerateImage = useCallback(async (id: string, prompt: string) => {
    setPosts(currentPosts => 
      currentPosts.map(p => 
        p.id === id ? { ...p, isImageLoading: true } : p
      )
    );

    try {
      const imageUrl = await generatePostImage(prompt, currentStyle, true);
      setPosts(currentPosts => 
        currentPosts.map(p => 
          p.id === id 
            ? { ...p, imageUrl, isImageLoading: false } 
            : p
        )
      );
    } catch (err) {
      console.error(`Failed to regenerate image for post ${id}`, err);
      setPosts(currentPosts => 
        currentPosts.map(p => 
          p.id === id ? { ...p, isImageLoading: false } : p
        )
      );
    }
  }, [currentStyle]);

  const goBackToHub = () => {
    setMode('hub');
    setPosts([]);
    setError(null);
  };

  // --- RENDER HUB ---
  if (mode === 'hub') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
         <div className="mb-8 text-center">
            <div className="bg-teal-600 p-4 rounded-2xl inline-block mb-4 shadow-lg">
              <Leaf className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Sober Solutions</h1>
            <p className="text-slate-500 font-medium">Growth & Content Platform</p>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl w-full">
            {/* Card 1: Social & Outreach */}
            <button 
              onClick={() => setMode('social')}
              className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:border-teal-500 hover:shadow-xl transition-all group text-left"
            >
              <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-teal-600 transition-colors">
                 <Users className="w-6 h-6 text-teal-600 group-hover:text-white" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">Social & Outreach</h2>
              <p className="text-slate-500 text-sm">
                Blog articles, flyers, and professional B2B outreach emails.
              </p>
            </button>

            {/* Card 2: Marketing & Strategy */}
            <button 
              onClick={() => setMode('marketing')}
              className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:border-orange-500 hover:shadow-xl transition-all group text-left"
            >
               <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-orange-600 transition-colors">
                 <Megaphone className="w-6 h-6 text-orange-600 group-hover:text-white" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">Marketing & Strategy</h2>
              <p className="text-slate-500 text-sm">
                Google Ads campaigns, event promo kits, and strategic planning.
              </p>
            </button>

            {/* Card 3: SEO & Web */}
            <button 
              onClick={() => setMode('seo')}
              className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:border-blue-500 hover:shadow-xl transition-all group text-left"
            >
               <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors">
                 <Search className="w-6 h-6 text-blue-600 group-hover:text-white" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">SEO & Web Dev</h2>
              <p className="text-slate-500 text-sm">
                Google Business Profile updates, landing page copy, and meta tags.
              </p>
            </button>

             {/* Card 4: Competitor Analysis */}
             <button 
              onClick={() => setMode('competitor')}
              className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:border-indigo-500 hover:shadow-xl transition-all group text-left"
            >
               <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-indigo-600 transition-colors">
                 <LineChart className="w-6 h-6 text-indigo-600 group-hover:text-white" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">Competitor Intel</h2>
              <p className="text-slate-500 text-sm">
                Compare SEO metrics and track competitor social engagement.
              </p>
            </button>
         </div>
         <p className="mt-12 text-xs text-slate-400">Authorized for Sober Solutions Nashville</p>
      </div>
    );
  }

  // --- RENDER GENERATOR ---
  let allowedTypes: ContentType[] = [];
  let headerTitle = "";
  let headerIcon = null;
  let headerColor = "";
  let introTitle = "";
  let introDesc = "";
  let contextLabel = "Specific Focus";

  if (mode === 'seo') {
    allowedTypes = [ContentType.GBP_UPDATE, ContentType.WEBSITE_HERO, ContentType.SEO_META, ContentType.FAQ_SECTION];
    headerTitle = "SEO & Website Growth";
    headerIcon = <Code className="w-6 h-6 text-white" />;
    headerColor = "bg-blue-600";
    introTitle = "Optimize Your Digital Presence";
    introDesc = "Generate technical content designed to rank on Google and convert visitors into residents.";
    contextLabel = "Target Keywords / Service";
  } else if (mode === 'competitor') {
    allowedTypes = [ContentType.COMPETITOR_SEO, ContentType.COMPETITOR_SOCIAL];
    headerTitle = "Competitor Intelligence";
    headerIcon = <LineChart className="w-6 h-6 text-white" />;
    headerColor = "bg-indigo-600";
    introTitle = "Analyze the Market";
    introDesc = "Compare your presence against other Nashville sober living homes to find opportunities.";
    contextLabel = "Competitor Name & URL";
  } else if (mode === 'marketing') {
    allowedTypes = [ContentType.GOOGLE_ADS, ContentType.REVIEW_REQUEST, ContentType.STRATEGY_PLAN];
    headerTitle = "Marketing & Strategy";
    headerIcon = <Megaphone className="w-6 h-6 text-white" />;
    headerColor = "bg-orange-600";
    introTitle = "Grow Your Brand";
    introDesc = "Create paid ad campaigns, reputation scripts, and build strategic roadmaps.";
    contextLabel = "Campaign Focus / Goal";
  } else {
    allowedTypes = [ContentType.BLOG_SHORT, ContentType.BLOG_LONG, ContentType.FACEBOOK, ContentType.FLYER, ContentType.OUTREACH_EMAIL];
    headerTitle = "Social & Outreach Content";
    headerIcon = <Users className="w-6 h-6 text-white" />;
    headerColor = "bg-teal-600";
    introTitle = "Engage Your Community";
    introDesc = "Create warm, inviting content for families, alumni, and potential residents.";
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button 
              onClick={goBackToHub}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors"
              title="Back to Dashboard"
            >
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </button>
            <div className="flex items-center space-x-3">
              <div className={`${headerColor} p-2 rounded-lg`}>
                {headerIcon}
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">{headerTitle}</h1>
                <p className="text-xs text-slate-500 font-medium">Sober Solutions Nashville</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Intro */}
        <div className="text-center mb-10 max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            {introTitle}
          </h2>
          <p className="text-slate-600">
            {introDesc}
          </p>
        </div>

        {/* Input Form */}
        <div className="max-w-5xl mx-auto">
            <GeneratorForm 
              onGenerate={handleGenerate} 
              isGenerating={isGenerating}
              allowedContentTypes={allowedTypes}
              contextLabel={contextLabel}
              mode={mode}
            />
        </div>

        {/* Error Message */}
        {error && (
          <div className="max-w-3xl mx-auto mb-8 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-center justify-center">
            {error}
          </div>
        )}

        {/* Results Grid */}
        {posts.length > 0 && (
          <div className="space-y-6">
             <div className="flex items-center space-x-2 text-slate-800 font-semibold text-lg border-b border-slate-200 pb-2">
                <Layout className="w-5 h-5" />
                <span>Generated Content</span>
             </div>
             
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
               {posts.map((post) => (
                 <div key={post.id} className="h-full">
                    <PostCard 
                      post={post} 
                      onRegenerateImage={handleRegenerateImage}
                    />
                 </div>
               ))}
             </div>
          </div>
        )}

        {/* Empty State / Placeholder */}
        {!isGenerating && posts.length === 0 && !error && (
          <div className="text-center py-20 opacity-50">
            <div className={`w-24 h-24 ${headerColor.replace('bg-', 'text-').replace('600', '100').replace('text-', 'bg-')} rounded-full mx-auto mb-4 flex items-center justify-center`}>
               {/* Re-using icon logic somewhat hackily for placeholder */}
               {mode === 'seo' ? <Search className="w-10 h-10 text-blue-400" /> : 
                mode === 'competitor' ? <LineChart className="w-10 h-10 text-indigo-400" /> :
                mode === 'marketing' ? <TrendingUp className="w-10 h-10 text-orange-400" /> :
                <Users className="w-10 h-10 text-teal-400" />}
            </div>
            <p className="text-slate-400 font-medium">Ready to generate content</p>
          </div>
        )}

      </main>
    </div>
  );
}