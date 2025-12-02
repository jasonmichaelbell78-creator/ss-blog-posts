import React, { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { GeneratorForm } from './components/GeneratorForm';
import { PostCard } from './components/PostCard';
import { FullPost, Topic, Tone, ImageStyle } from './types';
import { generatePostIdeas, generatePostImage } from './services/geminiService';
import { Layout, Leaf } from 'lucide-react';

export default function App() {
  const [posts, setPosts] = useState<FullPost[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Keep track of the current style for regenerations
  const [currentStyle, setCurrentStyle] = useState<ImageStyle>(ImageStyle.PHOTOREALISTIC);

  const handleGenerate = useCallback(async (topic: Topic, tone: Tone, style: ImageStyle, context: string) => {
    setIsGenerating(true);
    setError(null);
    setPosts([]); // Clear previous results
    setCurrentStyle(style);

    try {
      // 1. Generate Text Content
      const ideas = await generatePostIdeas(topic, tone, context);
      
      if (!ideas || ideas.length === 0) {
        throw new Error("No ideas were generated. Please try again.");
      }

      // Initialize posts with loading state for images
      const initialPosts: FullPost[] = ideas.map(idea => ({
        ...idea,
        id: uuidv4(),
        isImageLoading: true
      }));

      setPosts(initialPosts);
      setIsGenerating(false); // UI can now interact, images load in background

      // 2. Generate Images in Parallel (Background)
      initialPosts.forEach(async (post) => {
        try {
          // Pass style, isRegeneration = false
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
    // Set loading state for specific post
    setPosts(currentPosts => 
      currentPosts.map(p => 
        p.id === id ? { ...p, isImageLoading: true } : p
      )
    );

    try {
      // Re-run image generation with isRegeneration = true to force variance
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
      // Reset loading state on failure, keep old image if it existed (or undefined)
      setPosts(currentPosts => 
        currentPosts.map(p => 
          p.id === id ? { ...p, isImageLoading: false } : p
        )
      );
    }
  }, [currentStyle]);

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-teal-600 p-2 rounded-lg">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">Sober Solutions</h1>
              <p className="text-xs text-slate-500 font-medium">Content Generator</p>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-4 text-sm text-slate-500">
            <span>Nashville, TN</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Intro */}
        <div className="text-center mb-10 max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Create Inspired Recovery Content</h2>
          <p className="text-slate-600">
            Generate warm, engaging blog posts and social media updates tailored for Sober Solutions. 
            Select a topic below to get started.
          </p>
        </div>

        {/* Input Form */}
        <div className="max-w-4xl mx-auto">
            <GeneratorForm onGenerate={handleGenerate} isGenerating={isGenerating} />
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
                <span>Generated Options</span>
             </div>
             
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
            <div className="w-24 h-24 bg-slate-200 rounded-full mx-auto mb-4 flex items-center justify-center">
               <Leaf className="w-10 h-10 text-slate-400" />
            </div>
            <p className="text-slate-400 font-medium">Ready to generate content</p>
          </div>
        )}

      </main>
    </div>
  );
}