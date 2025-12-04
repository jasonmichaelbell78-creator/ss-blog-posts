import React from 'react';
import ReactMarkdown from 'react-markdown';
import { FullPost, ContentType } from '../types';
import { Copy, Facebook, FileText, Image as ImageIcon, Loader2, RefreshCw, File, Mail, Search, Globe, HelpCircle, Clipboard, BarChart3, LineChart, Megaphone, Star, TrendingUp } from 'lucide-react';

interface PostCardProps {
  post: FullPost;
  onRegenerateImage: (id: string, prompt: string) => void;
}

export const PostCard: React.FC<PostCardProps> = ({ post, onRegenerateImage }) => {
  const [activeTab, setActiveTab] = React.useState<'main' | 'secondary'>('main');
  const [copied, setCopied] = React.useState(false);

  // Helper to determine labels and icons based on type
  const getLabels = () => {
    switch (post.contentType) {
      // Social
      case ContentType.OUTREACH_EMAIL:
        return { main: "Email Body", secondary: "Subject Lines", mainIcon: <Mail className="w-4 h-4" />, secIcon: <Clipboard className="w-4 h-4" /> };
      case ContentType.FLYER:
        return { main: "Flyer Copy", secondary: "Social Caption", mainIcon: <File className="w-4 h-4" />, secIcon: <FileText className="w-4 h-4" /> };
      
      // SEO
      case ContentType.GBP_UPDATE:
        return { main: "Update Post", secondary: "Target Keywords", mainIcon: <Search className="w-4 h-4" />, secIcon: <Clipboard className="w-4 h-4" /> };
      case ContentType.WEBSITE_HERO:
        return { main: "Website Copy", secondary: "Button CTA", mainIcon: <Globe className="w-4 h-4" />, secIcon: <FileText className="w-4 h-4" /> };
      case ContentType.SEO_META:
        return { main: "Meta Description", secondary: "Keywords", mainIcon: <Search className="w-4 h-4" />, secIcon: <Clipboard className="w-4 h-4" /> };
      case ContentType.FAQ_SECTION:
        return { main: "Q&A Pairs", secondary: "Summary", mainIcon: <HelpCircle className="w-4 h-4" />, secIcon: <FileText className="w-4 h-4" /> };
      
      // Competitor
      case ContentType.COMPETITOR_SEO:
        return { main: "Comparison Report", secondary: "Strategy Summary", mainIcon: <BarChart3 className="w-4 h-4" />, secIcon: <Clipboard className="w-4 h-4" /> };
      case ContentType.COMPETITOR_SOCIAL:
        return { main: "Activity Log", secondary: "Action Plan", mainIcon: <LineChart className="w-4 h-4" />, secIcon: <Clipboard className="w-4 h-4" /> };
      
      // Marketing
      case ContentType.GOOGLE_ADS:
        return { main: "Ad Headlines", secondary: "Descriptions", mainIcon: <Megaphone className="w-4 h-4" />, secIcon: <FileText className="w-4 h-4" /> };
      case ContentType.REVIEW_REQUEST:
        return { main: "Request Script", secondary: "Follow Up/Thanks", mainIcon: <Star className="w-4 h-4" />, secIcon: <FileText className="w-4 h-4" /> };
      case ContentType.STRATEGY_PLAN:
        return { main: "Strategic Plan", secondary: "KPIs & Goals", mainIcon: <TrendingUp className="w-4 h-4" />, secIcon: <BarChart3 className="w-4 h-4" /> };

      default:
        return { main: "Blog Post", secondary: "Facebook Post", mainIcon: <FileText className="w-4 h-4" />, secIcon: <Facebook className="w-4 h-4" /> };
    }
  };

  const labels = getLabels();

  const handleCopy = () => {
    const textToCopy = activeTab === 'main' 
      ? `# ${post.title}\n\n${post.blogBody}` 
      : post.facebookPost;
      
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Check if this type supports images.
  const supportsImage = 
    post.contentType !== ContentType.SEO_META && 
    post.contentType !== ContentType.GOOGLE_ADS &&
    post.contentType !== ContentType.STRATEGY_PLAN;

  return (
    <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden flex flex-col h-full transition-transform hover:scale-[1.01] duration-300">
      
      {/* Media Section (Image) - Only if supported */}
      {supportsImage ? (
        <div className="relative h-56 bg-slate-900 w-full overflow-hidden group">
          {post.isImageLoading ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 space-y-2 z-10 bg-slate-50">
              <Loader2 className="w-8 h-8 animate-spin text-teal-500" />
              <span className="text-xs font-medium uppercase tracking-wider">
                Generating Visuals...
              </span>
            </div>
          ) : post.imageUrl ? (
            <>
              <img 
                src={post.imageUrl} 
                alt={post.title} 
                className="w-full h-full object-cover transition-opacity duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                 <span className="text-white text-xs bg-black/50 px-2 py-1 rounded backdrop-blur-sm">AI Generated for Sober Solutions</span>
              </div>
            </>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-slate-400 bg-slate-100">
              <ImageIcon className="w-10 h-10" />
              <span className="ml-2">Visual Generation Failed</span>
            </div>
          )}

          {!post.isImageLoading && (
            <button
              onClick={() => onRegenerateImage(post.id, post.imagePrompt)}
              className="absolute top-3 right-3 p-2 bg-white/90 hover:bg-white text-teal-700 rounded-full shadow-md backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
              title="Regenerate Image"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          )}
        </div>
      ) : (
        <div className="h-4 bg-teal-600 w-full"></div> // Minimal header for non-image types
      )}

      {/* Content Header */}
      <div className="p-5 pb-0">
        <h3 className="text-xl font-bold text-slate-900 leading-tight mb-2 line-clamp-2">{post.title}</h3>
      </div>

      {/* Tabs */}
      <div className="px-5 mt-4 border-b border-slate-100 flex space-x-6">
        <button
          onClick={() => setActiveTab('main')}
          className={`pb-3 text-sm font-medium flex items-center space-x-2 transition-colors ${
            activeTab === 'main' 
              ? 'text-teal-600 border-b-2 border-teal-600' 
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          {labels.mainIcon}
          <span>{labels.main}</span>
        </button>
        <button
          onClick={() => setActiveTab('secondary')}
          className={`pb-3 text-sm font-medium flex items-center space-x-2 transition-colors ${
            activeTab === 'secondary' 
              ? 'text-blue-600 border-b-2 border-blue-600' 
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          {labels.secIcon}
          <span>{labels.secondary}</span>
        </button>
      </div>

      {/* Content Body */}
      <div className="p-5 flex-grow overflow-y-auto max-h-80 bg-slate-50/50">
        <div className="prose prose-sm prose-slate max-w-none">
          {activeTab === 'main' ? (
            <ReactMarkdown>{post.blogBody}</ReactMarkdown>
          ) : (
             <div className="whitespace-pre-wrap font-sans text-slate-700">{post.facebookPost}</div>
          )}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t border-slate-100 bg-white mt-auto">
        <button
          onClick={handleCopy}
          className="w-full flex items-center justify-center space-x-2 text-slate-700 bg-slate-100 hover:bg-slate-200 font-medium rounded-lg text-sm px-4 py-2.5 transition-colors"
        >
          {copied ? (
            <span className="text-teal-700 font-bold">Copied!</span>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>Copy {activeTab === 'main' ? labels.main : labels.secondary}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};