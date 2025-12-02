export enum Tone {
  WARM_INVITING = 'Warm & Inviting',
  CARING_INSTRUCTIONAL = 'Caring & Instructional',
  INSPIRATIONAL = 'Inspirational & Uplifting'
}

export enum Topic {
  GENERAL_RECOVERY = 'General Recovery',
  SOBER_SOLUTIONS_BRAND = 'Sober Solutions (Our Home)',
  NASHVILLE_RECOVERY = 'Nashville Specific Recovery'
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
