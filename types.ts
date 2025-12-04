export enum Tone {
  WARM_INVITING = 'Warm & Inviting',
  CARING_INSTRUCTIONAL = 'Caring & Instructional',
  INSPIRATIONAL = 'Inspirational & Uplifting',
  EMPATHETIC_SUPPORTIVE = 'Empathetic & Supportive',
  DIRECT_EDUCATIONAL = 'Direct & Educational',
  HOPEFUL_ENCOURAGING = 'Hopeful & Encouraging',
  PROFESSIONAL_AUTHORITATIVE = 'Professional & Authoritative',
  REFLECTIVE_MINDFUL = 'Reflective & Mindful',
  SEO_OPTIMIZED = 'SEO Optimized & Searchable',
  ANALYTICAL_OBJECTIVE = 'Analytical & Objective',
  PERSUASIVE_URGENT = 'Persuasive & High-Converting'
}

export enum Topic {
  GENERAL_RECOVERY = 'General Recovery Insights',
  SOBER_SOLUTIONS_BRAND = 'Sober Solutions (Our Home)',
  NASHVILLE_RECOVERY = 'Nashville Specific Recovery',
  FAMILY_SUPPORT = 'Family Support & Guidance',
  RELAPSE_PREVENTION = 'Relapse Prevention & Coping',
  MENTAL_HEALTH_WELLNESS = 'Mental Health & Wellness',
  HOLISTIC_LIVING = 'Holistic Living & Self-Care',
  EARLY_SOBRIETY_TIPS = 'Tips for Early Sobriety',
  COMMUNITY_CONNECTION = 'The Power of Community',
  ALUMNI_SUCCESS = 'Success Stories & Hope',
  // B2B / SEO Topics
  PARTNERSHIP_OPPORTUNITIES = 'Partnership Opportunities (B2B)',
  ADMISSIONS_OPENINGS = 'Current Admissions & Openings',
  PROGRAM_FEATURES = 'Specific Program Features',
  // Competitor Topics
  COMPETITOR_OVERVIEW = 'General Competitor Overview',
  MARKET_POSITIONING = 'Market Positioning',
  // Marketing Topics
  GROWTH_CAMPAIGN = 'Growth & Admissions Campaign',
  REPUTATION_MANAGEMENT = 'Reputation & Reviews',
  ALUMNI_ENGAGEMENT = 'Alumni Engagement'
}

export enum ImageStyle {
  PHOTOREALISTIC = 'Photorealistic & Natural',
  WARM_COZY = 'Warm & Cozy Interiors',
  CINEMATIC = 'Cinematic & Dramatic Lighting',
  NASHVILLE_URBAN = 'Nashville Urban & Street',
  NATURE_SERENE = 'Nature, Parks & Serene',
  MINIMALIST = 'Minimalist & Clean',
  BRIGHT_ENERGETIC = 'Bright, Airy & Energetic',
  MOODY_ATMOSPHERIC = 'Moody & Atmospheric',
  WATERCOLOR = 'Artistic Watercolor',
  ABSTRACT = 'Abstract & Conceptual',
  CORPORATE_PROFESSIONAL = 'Corporate & Professional',
  DATA_VISUALIZATION = 'Data Visualization & Charts'
}

export enum ContentType {
  // Social & Marketing
  BLOG_SHORT = 'Blog Post (Short Form)',
  BLOG_LONG = 'Blog Post (Long Form)',
  FACEBOOK = 'Facebook Post Only',
  FLYER = 'Promotional Flyer',
  OUTREACH_EMAIL = 'Professional Outreach Email',
  
  // SEO & Web
  GBP_UPDATE = 'Google Business Profile Update',
  WEBSITE_HERO = 'Website Hero Section',
  SEO_META = 'SEO Meta Titles & Descriptions',
  FAQ_SECTION = 'FAQ Section (Schema Ready)',

  // Competitor Analysis
  COMPETITOR_SEO = 'Competitor SEO & Web Comparison',
  COMPETITOR_SOCIAL = 'Competitor Social Activity Log (Recent)',

  // Marketing & Strategy
  GOOGLE_ADS = 'Google Ads Campaign (PPC)',
  REVIEW_REQUEST = 'Review Request Script (Ethical)',
  STRATEGY_PLAN = '30-Day Marketing Strategy'
}

export interface GeneratedContent {
  title: string;
  blogBody: string;
  facebookPost: string;
  imagePrompt: string;
}

export interface FullPost extends GeneratedContent {
  id: string;
  contentType: ContentType;
  imageUrl?: string;
  isImageLoading: boolean;
}