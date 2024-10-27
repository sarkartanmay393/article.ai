export type ArticleMetadata = {
  title: string;
  summary: string;
  keywords: string[];
  targetAudience: string;
  readingTime: number;    // in minutes
  wordCount: number;
  language: string;
  tone: string;
  style: string;
  seoMetadata?: {
    metaTitle?: string;
    metaDescription?: string;
    canonicalUrl?: string;
  };
  generationParams?: {
    prompt?: string;
    temperature?: number;
    model?: string;
    timestamp: string;
  };
  version?: number;
};

export type Article = {
  id: string;
  metadata: ArticleMetadata;
  content: string;
  created_at: string;
  updated_at: string;
};

