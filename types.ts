export enum Tone {
  WARM_INVITING = 'Warm & Inviting',
  CARING_INSTRUCTIONAL = 'Caring & Instructional',
  INSPIRATIONAL = 'Inspirational & Uplifting',
  EMPATHETIC_SUPPORTIVE = 'Empathetic & Supportive',
  DIRECT_EDUCATIONAL = 'Direct & Educational',
  HOPEFUL_ENCOURAGING = 'Hopeful & Encouraging',
  PROFESSIONAL_AUTHORITATIVE = 'Professional & Authoritative',
  REFLECTIVE_MINDFUL = 'Reflective & Mindful'
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
  ALUMNI_SUCCESS = 'Success Stories & Hope'
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
  ABSTRACT = 'Abstract & Conceptual'
}

export interface GeneratedContent {
  title: string;
  blogBody: string;
  facebookPost: string;
  imagePrompt: string;
}

export interface FullPost extends GeneratedContent {
  id: string;
  imageUrl?: string;
  isImageLoading: boolean;
}