'use client';

/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import React, { useState } from 'react';
import type { Article } from '~/types/article';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '~/components/ui/tabs';
import { Copy, Download } from 'lucide-react';
import ArticleFormatter from '~/lib/article-formatter';
import { convertJsonToArticle } from '~/lib/utils';

interface ArticleViewerProps {
  article: Article | JSON;
}

const Article = {
  id: "art_123xyz",
  metadata: {
    title: "The Future of Artificial Intelligence",
    summary: "An exploration of AI's impact on society and technology",
    keywords: ["AI", "technology", "future", "machine learning"],
    targetAudience: "tech-savvy professionals",
    readingTime: 5,
    wordCount: 1200,
    language: "en",
    tone: "informative",
    style: "professional",
    seoMetadata: {
      metaTitle: "The Future of AI: A Comprehensive Overview",
      metaDescription: "Explore the future implications of AI technology...",
    },
    generationParams: {
      prompt: "Write a professional article about AI's future...",
      temperature: 0.7,
      model: "gpt-4",
      timestamp: "2024-10-25T10:30:00Z"
    },
    version: 1
  },
  content: [
    {
      id: "sec_1",
      type: "heading",
      content: "The Future of Artificial Intelligence",
      metadata: { level: 1 }
    },
    {
      id: "sec_2",
      type: "paragraph",
      content: "Artificial Intelligence has become an integral part of our daily lives..."
    },
    {
      id: "sec_3",
      type: "heading",
      content: "Current State of AI",
      metadata: { level: 2 }
    },
    {
      id: "sec_4",
      type: "list",
      content: "Key developments in AI",
      metadata: { listType: "bullet" },
      children: [
        { id: "item_1", type: "list", content: "Machine Learning advancements" },
        { id: "item_2", type: "list", content: "Natural Language Processing" }
      ]
    },
    {
      id: "sec_5",
      type: "quote",
      content: "AI is not just transforming technology; it's reshaping society itself.",
      metadata: {
        citations: [{
          id: "cite_1",
          text: "AI Impact Report 2024",
          type: "article",
          author: "Dr. Jane Smith",
          date: "2024"
        }]
      }
    }
  ],
  created_at: "2024-10-25T10:30:00Z",
  updated_at: "2024-10-25T10:30:00Z"
};

export default function ArticleViewer({ article }: ArticleViewerProps) {
  const [viewMode, setViewMode] = useState<'rendered' | 'markdown' | 'metadata'>('rendered');
  article = convertJsonToArticle(article);
  const formatter = new ArticleFormatter(article);

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    // You might want to add a toast notification here
  };

  const downloadMarkdown = () => {
    const blob = new Blob([formatter.toMarkdown()], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${Article.metadata.title.toLowerCase().replace(/\s+/g, '-')}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const renderContent = () => {
    return article.content.map((section) => {
      switch (section.type) {
        case 'heading':
          const HeadingTag = `h${section.metadata?.level || 1}` as keyof JSX.IntrinsicElements;
          return <HeadingTag key={section.id} className="font-bold my-4">{section.content}</HeadingTag>;

        case 'paragraph':
          return <p key={section.id} className="my-4 leading-relaxed">{section.content}</p>;

        case 'list':
          const ListTag = section.metadata?.listType === 'numbered' ? 'ol' : 'ul';
          return (
            <ListTag key={section.id} className="my-4 ml-6">
              {section.children?.map(item => (
                <li key={item.id} className="my-1">{item.content}</li>
              ))}
            </ListTag>
          );

        case 'quote':
          return (
            <blockquote key={section.id} className="border-l-4 border-gray-300 pl-4 my-4 italic">
              {section.content}
              {section.metadata?.citations?.map(citation => (
                <cite key={citation.id} className="block text-sm text-gray-600 mt-2">
                  — {citation.author}, {citation.date}
                </cite>
              ))}
            </blockquote>
          );

        default:
          return <div key={section.id}>{section.content}</div>;
      }
    });
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>{article.metadata.title}</CardTitle>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span>{article.metadata.readingTime} min read</span>
          <span>•</span>
          <span>{article.metadata.wordCount} words</span>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as typeof viewMode)}>
          <TabsList className="mb-4">
            <TabsTrigger value="rendered">Rendered</TabsTrigger>
            <TabsTrigger value="markdown">Markdown</TabsTrigger>
            <TabsTrigger value="metadata">Metadata</TabsTrigger>
          </TabsList>

          <TabsContent value="rendered">
            <div className="prose max-w-none">
              {renderContent()}
            </div>
          </TabsContent>

          <TabsContent value="markdown">
            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                className="absolute right-0 top-0 m-2"
                onClick={() => copyToClipboard(formatter.toMarkdown())}
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="absolute right-20 top-0 m-2"
                onClick={downloadMarkdown}
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              <pre className="bg-gray-50 p-4 rounded-lg mt-10 overflow-auto">
                <code>{formatter.toMarkdown()}</code>
              </pre>
            </div>
          </TabsContent>

          <TabsContent value="metadata">
            <pre className="bg-gray-50 p-4 rounded-lg overflow-auto">
              <code>{JSON.stringify(article.metadata, null, 2)}</code>
            </pre>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}